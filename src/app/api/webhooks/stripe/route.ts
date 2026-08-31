import { NextResponse } from "next/server";

import { Cart } from "@/lib/db/models/Cart";
import { Order } from "@/lib/db/models/Order";
import connectToDatabase from "@/lib/db/mongodb";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
	const body = await req.text();
	const sig = req.headers.get("stripe-signature") as string;
	const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

	let event;

	try {
		event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
	} catch (err: any) {
		console.error("Webhook signature verification failed.", err.message);
		return NextResponse.json({ error: "Webhook Error" }, { status: 400 });
	}

	if (event.type === "checkout.session.completed") {
		const session = event.data.object as any;

		const cartId = session.metadata?.cartId;
		const userId = session.metadata?.userId;

		await connectToDatabase();

		const cart = await Cart.findById(cartId).lean();

		if (cart) {
			// Extract line items to construct order items
			const items = cart.lineItems?.map((item: any) => {
				const isBundle = item.isBundle;
				return {
					productId: isBundle ? undefined : (item.productId || item._id),
					bundleId: isBundle ? (item.productId || item._id) : undefined,
					title: item.title,
					price: typeof item.price === "object" ? Number(item.price.amount || 0) : Number(item.price || 0),
					quantity: item.quantity,
				};
			}) || [];

			// Create Order in MongoDB
			const newOrder = new Order({
				userId: userId || undefined,
				email:
					session.customer_details?.email ||
					session.customer_email ||
					"guest@example.com",
				status: "PENDING", // Initial status, will be shipped later
				items,
				total: session.amount_total ? session.amount_total / 100 : 0,
				shippingCost: session.metadata?.s_cost ? Number(session.metadata.s_cost) : 0,
				taxAmount: session.metadata?.s_tax ? Number(session.metadata.s_tax) : 0,
				couponCode: session.metadata?.s_coupon || undefined,
				discountAmount: session.metadata?.s_discount ? Number(session.metadata.s_discount) : 0,
				paymentMethod: "Stripe",
				shippingMethod: session.metadata?.s_method || "standard",
				isPaid: true,
				stripeTransactionId: session.payment_intent || session.id,
				shippingAddress: {
					firstName: session.metadata?.s_first || session.customer_details?.name?.split(" ")[0] || "Unknown",
					lastName:
						session.metadata?.s_last ||
						session.customer_details?.name?.split(" ").slice(1).join(" ") ||
						"Unknown",
					addressLine1: session.metadata?.s_line1 || session.customer_details?.address?.line1 || "Unknown",
					addressLine2: session.metadata?.s_line2 || session.customer_details?.address?.line2 || "",
					city: session.metadata?.s_city || session.customer_details?.address?.city || "Unknown",
					state: session.metadata?.s_state || session.customer_details?.address?.state || "Unknown",
					postalCode:
						session.metadata?.s_postal || session.customer_details?.address?.postal_code || "Unknown",
					country: session.metadata?.s_country || session.customer_details?.address?.country || "UAE",
					phone: session.metadata?.s_phone || session.customer_details?.phone || "",
				},
			});

			await newOrder.save();
			
			// Generate Invoice
			try {
				const { generateAndUploadInvoice } = await import("@/lib/invoice");
				const invoiceData = await generateAndUploadInvoice(newOrder);
				newOrder.invoiceUrl = invoiceData.url;
				newOrder.invoiceNumber = invoiceData.invoiceNumber;
				await newOrder.save();
			} catch (err) {
				console.error("Failed to generate invoice for Stripe order:", err);
			}

			// Clear the user's cart
			await Cart.findByIdAndUpdate(cartId, {
				$set: { lineItems: [], summary: { total: 0 } },
			});
		}
	}

	return NextResponse.json({ received: true });
}
