import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { Cart } from "@/lib/db/models/Cart";
import { Order } from "@/lib/db/models/Order";
import { User } from "@/lib/db/models/User";
import connectToDatabase from "@/lib/db/mongodb";
import { stripe } from "@/lib/stripe";
import { ShippingConfig } from "@/lib/db/models/ShippingConfig";
import { TaxConfig } from "@/lib/db/models/TaxConfig";
import { Coupon } from "@/lib/db/models/Coupon";

export async function POST(request: Request) {
	try {
		const session = await auth();
		const userId = session?.user?.id;
		const authEmail = session?.user?.email;

		const body = await request.json();
		const { cartId, paymentMethod, shippingMethod, shippingAddress, contact, couponCode } = body;

		if (!process.env.STRIPE_SECRET_KEY) {
			return NextResponse.json(
				{
					error:
						"Stripe API key is not configured. Please add STRIPE_SECRET_KEY to your .env.local file.",
				},
				{ status: 500 }
			);
		}

		if (!cartId && !userId) {
			return NextResponse.json(
				{ error: "Missing cart ID or user session" },
				{ status: 400 }
			);
		}

		await connectToDatabase();

		const query = userId ? { userId } : { _id: cartId };
		const cart = await Cart.findOne(query).lean();

		if (!cart || !cart.lineItems || cart.lineItems.length === 0) {
			return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
		}

		// Save the shipping address to the User model if user is logged in
		if (userId && shippingAddress) {
			await User.findByIdAndUpdate(userId, {
				$set: {
					phone: contact?.phone,
					shippingAddress: {
						firstName: shippingAddress.firstName,
						lastName: shippingAddress.lastName,
						addressLine1: shippingAddress.addressLine1,
						addressLine2: shippingAddress.addressLine2,
						city: shippingAddress.city,
						state: shippingAddress.state,
						postalCode: shippingAddress.postalCode,
						country: shippingAddress.country,
					},
				},
			});
		}

		const origin = request.headers.get("origin") || "http://localhost:3000";

		const items = cart.lineItems.map((item: any) => ({
			productId: item.isBundle ? undefined : item.productId || item._id,
			bundleId: item.isBundle ? item.productId || item._id : undefined,
			title: item.title,
			price:
				typeof item.price === "object"
					? Number(item.price.amount || 0)
					: Number(item.price || 0),
			quantity: item.quantity,
		}));

		const baseCartTotal = items.reduce(
			(acc: number, item: any) => acc + item.price * item.quantity,
			0
		);

		let cartTotal = baseCartTotal;
		let appliedCouponDoc = null;

		if (couponCode) {
			const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
			if (coupon && coupon.status === "Active") {
				const isExpired = coupon.expiryDate && new Date(coupon.expiryDate) < new Date();
				const isLimitReached = coupon.maxUses && coupon.usedCount >= coupon.maxUses;
				const isMinMet = !coupon.minPurchase || baseCartTotal >= coupon.minPurchase;
				
				if (!isExpired && !isLimitReached && isMinMet) {
					appliedCouponDoc = coupon;
					if (coupon.discountType === "percentage") {
						cartTotal = Math.max(0, baseCartTotal - (baseCartTotal * (coupon.discountAmount / 100)));
					} else {
						cartTotal = Math.max(0, baseCartTotal - coupon.discountAmount);
					}
				}
			}
		}


		let shippingCost = 0;
		const country = shippingAddress?.country || "UAE";
		const shippingConfigs = await ShippingConfig.find({ status: "Active" }).lean();
		if (shippingConfigs && shippingConfigs.length > 0) {
			const matchedConfig = shippingConfigs.find((c: any) => 
				c.countries.includes(country) || 
				c.countries.includes("*") || 
				c.countries.includes("Worldwide")
			);
			if (matchedConfig) {
				let standardCost = matchedConfig.standardFee || 0;
				if (matchedConfig.freeThreshold > 0 && cartTotal >= matchedConfig.freeThreshold) {
					standardCost = 0;
				}

				if (shippingMethod === "express" && matchedConfig.isExpressEnabled) {
					shippingCost = matchedConfig.expressFee || 0;
				} else {
					shippingCost = standardCost;
				}
			}
		}

		// 3. Calculate Tax Cost
		const taxConfigs = await TaxConfig.find({ status: "Active" });
		let taxCost = 0;
		let taxName = "Tax";
		
		if (taxConfigs.length > 0) {
			const matchedTax = taxConfigs.find((t: any) => t.region === country || t.region === "Worldwide" || t.region === "Global");
			if (matchedTax) {
				taxName = matchedTax.name;
				const amountToTax = matchedTax.appliedToShipping ? (cartTotal + shippingCost) : cartTotal;
				taxCost = amountToTax * (matchedTax.rate / 100);
			}
		}

		// Handle COD
		if (paymentMethod === "cod") {
			const total = cartTotal + shippingCost + taxCost;

			const newOrder = new Order({
				userId: userId || undefined,
				email: contact?.email || authEmail || "guest@example.com",
				status: "PENDING",
				items,
				total,
				shippingCost,
				taxAmount: taxCost,
				couponCode: appliedCouponDoc?.code,
				discountAmount: baseCartTotal - cartTotal,
				paymentMethod: "COD",
				shippingMethod: shippingMethod === "express" ? "express" : "standard",
				isPaid: false,
				shippingAddress: {
					firstName: shippingAddress?.firstName || "Unknown",
					lastName: shippingAddress?.lastName || "Unknown",
					addressLine1: shippingAddress?.addressLine1 || "Unknown",
					addressLine2: shippingAddress?.addressLine2 || "",
					city: shippingAddress?.city || "Unknown",
					state: shippingAddress?.state || "Unknown",
					postalCode: shippingAddress?.postalCode || "",
					country: shippingAddress?.country || "UAE",
					phone: contact?.phone || "",
				},
			});

			await newOrder.save();
			
			// Reduce stock
			const { Product } = await import("@/lib/db/models/Product");
			for (const item of items) {
				if (item.productId) {
					await Product.findByIdAndUpdate(item.productId, {
						$inc: { stock: -item.quantity },
					});
				}
			}
			
			// Generate Invoice
			try {
				const { generateAndUploadInvoice } = await import("@/lib/invoice");
				const invoiceData = await generateAndUploadInvoice(newOrder);
				newOrder.invoiceUrl = invoiceData.url;
				newOrder.invoiceNumber = invoiceData.invoiceNumber;
				await newOrder.save();
			} catch (err) {
				console.error("Failed to generate invoice for COD order:", err);
			}

			// Increment coupon usage if used
			if (appliedCouponDoc) {
				appliedCouponDoc.usedCount += 1;
				await appliedCouponDoc.save();
			}

			// Clear the user's cart
			await Cart.findByIdAndUpdate(cart._id, {
				$set: { lineItems: [], summary: { total: 0 } },
			});

			return NextResponse.json({
				url: `${origin}/thank-you?orderId=${newOrder._id.toString()}`,
				orderId: newOrder._id.toString(),
			});
		}

		// Handle Stripe
		const line_items = cart.lineItems.map((item: any) => ({
			price_data: {
				currency: "aed",
				product_data: {
					name: item.title,
				},
				unit_amount: Math.round(
					(typeof item.price === "object"
						? Number(item.price.amount || 0)
						: Number(item.price || 0)) * 100
				),
			},
			quantity: item.quantity,
		}));

		if (shippingCost > 0) {
			line_items.push({
				price_data: {
					currency: "aed",
					product_data: {
						name: shippingMethod === "express" ? "Express Shipping" : "Standard Shipping",
					},
					unit_amount: Math.round(shippingCost * 100),
				},
				quantity: 1,
			});
		}

		if (taxCost > 0) {
			line_items.push({
				price_data: {
					currency: "aed",
					product_data: {
						name: taxName,
						description: "Taxes & VAT",
					},
					unit_amount: Math.round(taxCost * 100),
				},
				quantity: 1,
			});
		}

		let stripeDiscounts = undefined;
		
		if (appliedCouponDoc) {
			try {
				let couponParams: any = { duration: "once" };
				if (appliedCouponDoc.discountType === "percentage") {
					couponParams.percent_off = appliedCouponDoc.discountAmount;
				} else {
					couponParams.amount_off = Math.round(appliedCouponDoc.discountAmount * 100);
					couponParams.currency = "aed";
				}
				const stripeCoupon = await stripe.coupons.create(couponParams);
				stripeDiscounts = [{ coupon: stripeCoupon.id }];

				// We can increment usage here for Stripe, but realistically a webhook on successful payment is better.
				// For now, we will increment it on checkout initiation to prevent over-usage if they open multiple windows.
				appliedCouponDoc.usedCount += 1;
				await appliedCouponDoc.save();
			} catch (e) {
				console.error("Failed to create Stripe coupon:", e);
			}
		}

		const stripeSession = await stripe.checkout.sessions.create({
			payment_method_types: ["card"],
			line_items,
			discounts: stripeDiscounts,
			mode: "payment",
			success_url: `${origin}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${origin}/cart`,
			customer_email: contact?.email || authEmail || undefined,
			metadata: {
				cartId: cart._id.toString(),
				userId: userId || "",
				// Pass shipping details so webhook can use it
				s_first: shippingAddress?.firstName || "",
				s_last: shippingAddress?.lastName || "",
				s_line1: shippingAddress?.addressLine1 || "",
				s_line2: shippingAddress?.addressLine2 || "",
				s_city: shippingAddress?.city || "",
				s_state: shippingAddress?.state || "",
				s_postal: shippingAddress?.postalCode || "",
				s_country: shippingAddress?.country || "UAE",
				s_phone: contact?.phone || "",
				s_cost: shippingCost.toString(),
				s_tax: taxCost.toString(),
				s_coupon: appliedCouponDoc?.code || "",
				s_discount: (baseCartTotal - cartTotal).toString(),
				s_method: shippingMethod === "express" ? "express" : "standard",
			},
			// Disable Stripe's built-in address collection since we collected it
			billing_address_collection: "auto",
		});

		return NextResponse.json({ url: stripeSession.url });
	} catch (error) {
		console.error("Stripe checkout error:", error);
		const errorMessage =
			error instanceof Error ? error.message : "Internal Server Error";
		return NextResponse.json({ error: errorMessage }, { status: 500 });
	}
}
