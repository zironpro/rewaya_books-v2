"use server";

import { auth } from "@/auth";
import { Cart } from "@/lib/db/models/Cart";
import connectToDatabase from "@/lib/db/mongodb";

export type CartActionResult = {
	error: string | null;
	cart?: any;
};

async function getUserId() {
	const session = await auth();
	return session?.user?.id || session?.user?.email;
}

export async function fetchCart(): Promise<any | null> {
	const userId = await getUserId();
	if (!userId) return null; // Guest mode handled by client-side local storage

	await connectToDatabase();
	const cart = await Cart.findOne({ userId }).lean();

	if (!cart)
		return {
			lineItems: [],
			summary: { subtotal: "AED 0.00", total: "AED 0.00", discountNames: [] },
		};

	const subtotal = cart.lineItems.reduce(
		(acc: number, item: any) => acc + item.price * item.quantity,
		0
	);
	cart.summary = {
		subtotal: `AED ${subtotal.toFixed(2)}`,
		total: `AED ${subtotal.toFixed(2)}`,
		discountNames: [],
	};

	const { Product } = await import("@/lib/db/models/Product");
	const productIds = cart.lineItems
		.map((item: any) => item.productId)
		.filter(Boolean);
	const products = await Product.find({ _id: { $in: productIds } })
		.select("stock")
		.lean();
	const stockMap = new Map(
		products.map((p: any) => [p._id.toString(), p.stock])
	);

	// Map items to match expected CartSnapshot format
	cart.lineItems = cart.lineItems.map((item: any) => ({
		...item,
		availability: {
			quantityAvailable: stockMap.get(item.productId?.toString()) ?? 99,
		},
		price: {
			amount: (item.price || 0).toString(),
			formattedConvertedAmount: `AED ${(item.price || 0).toFixed(2)}`,
		},
		lineItemPrice: {
			amount: ((item.price || 0) * (item.quantity || 1)).toString(),
			formattedConvertedAmount: `AED ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}`,
		},
		productName: { translated: item.title || "Product" },
	}));

	// Stringify and parse to avoid Mongoose lean Object ID issues with Next.js Server Components
	return JSON.parse(JSON.stringify(cart));
}

export async function syncCart(localCartLineItems: any[]) {
	const userId = await getUserId();
	if (!userId) return null;

	await connectToDatabase();

	const dbLineItems = localCartLineItems.map((item) => ({
		productId: item.productId || item._id,
		quantity: item.quantity || 1,
		price:
			typeof item.price === "object"
				? Number(item.price.amount || 0)
				: Number(item.price || 0),
		title: item.title || item.productName?.translated || "Product",
		image: item.image,
		isBundle: item.isBundle || false,
		bundleSlug: item.bundleSlug,
	}));

	const cart = await Cart.findOneAndUpdate(
		{ userId },
		{ $set: { lineItems: dbLineItems } },
		{ new: true, upsert: true }
	);

	const subtotal = cart.lineItems.reduce(
		(acc: number, item: any) => acc + item.price * item.quantity,
		0
	);
	const leanCart = cart.toObject();
	leanCart.summary = {
		subtotal: `AED ${subtotal.toFixed(2)}`,
		total: `AED ${subtotal.toFixed(2)}`,
		discountNames: [],
	};

	const { Product } = await import("@/lib/db/models/Product");
	const productIds = leanCart.lineItems
		.map((item: any) => item.productId)
		.filter(Boolean);
	const products = await Product.find({ _id: { $in: productIds } })
		.select("stock")
		.lean();
	const stockMap = new Map(
		products.map((p: any) => [p._id.toString(), p.stock])
	);

	// Map items to match expected CartSnapshot format
	leanCart.lineItems = leanCart.lineItems.map((item: any) => ({
		...item,
		availability: {
			quantityAvailable: stockMap.get(item.productId?.toString()) ?? 99,
		},
		price: {
			amount: (item.price || 0).toString(),
			formattedConvertedAmount: `AED ${(item.price || 0).toFixed(2)}`,
		},
		lineItemPrice: {
			amount: ((item.price || 0) * (item.quantity || 1)).toString(),
			formattedConvertedAmount: `AED ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}`,
		},
		productName: { translated: item.title || "Product" },
	}));

	return JSON.parse(JSON.stringify(leanCart));
}

// These functions will now be bypassed by the client-side Zustand store for UI speed,
// and the store will call `syncCart` periodically or on changes when logged in.
// Alternatively, we can use these directly for authenticated users.

export async function addItem(
	_prevState: unknown,
	item: any
): Promise<CartActionResult> {
	const userId = await getUserId();
	if (!userId) {
		return {
			error:
				"Please log in to add items server-side. (Use local storage for guests)",
		};
	}

	await connectToDatabase();

	// Atomic update to avoid VersionError
	let cart = await Cart.findOne({ userId });
	if (!cart) cart = new Cart({ userId, lineItems: [] });

	const { Product } = await import("@/lib/db/models/Product");
	const product = await Product.findById(item.productId).select("stock").lean();
	const maxStock = product?.stock ?? 0;

	const existing = cart.lineItems.find(
		(i: any) => i.productId === item.productId
	);
	if (existing) {
		const currentQty = existing.quantity || 1;
		const addQty = item.quantity || 1;
		if (currentQty + addQty > maxStock) {
			return { error: `Cannot add more than ${maxStock} to cart.` };
		}
		await Cart.findOneAndUpdate(
			{ userId, "lineItems.productId": item.productId },
			{ $inc: { "lineItems.$.quantity": addQty } }
		);
		cart = await Cart.findOne({ userId });
	} else {
		const addQty = item.quantity || 1;
		if (addQty > maxStock) {
			return { error: `Cannot add more than ${maxStock} to cart.` };
		}
		await Cart.findOneAndUpdate(
			{ userId },
			{
				$push: {
					lineItems: {
						productId: item.productId,
						quantity: addQty,
						price: item.price || 0,
						title: item.title || "Product " + item.productId,
						image: item.image,
						isBundle: item.isBundle || false,
						bundleSlug: item.bundleSlug,
					},
				},
			},
			{ upsert: true }
		);
		cart = await Cart.findOne({ userId });
	}

	const formattedCart = await fetchCart();
	return { error: null, cart: formattedCart };
}

export async function clearCart() {
	const userId = await getUserId();
	if (!userId) return;
	await connectToDatabase();
	await Cart.findOneAndDelete({ userId });
}

export type BundleCheckoutResult = {
	ok: boolean;
	checkoutUrl?: string;
	error?: string;
	debug?: any;
};

export async function getCheckoutUrl(
	_originOverride?: string
): Promise<BundleCheckoutResult> {
	return {
		ok: true,
		checkoutUrl: "/checkout",
	};
}

export async function startBundleCheckout(
	item: {
		catalogItemId: string;
		catalogAppId?: string;
		bundleSlug?: string;
		quantity?: number;
	},
	_originOverride?: string
): Promise<BundleCheckoutResult> {
	return {
		ok: true,
		checkoutUrl: "/checkout",
	};
}

import { redirect } from "next/navigation";
export async function redirectToCheckout(_originOverride?: string) {
	redirect("/checkout");
}
