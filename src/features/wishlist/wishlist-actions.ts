"use server";

import { auth } from "@/auth";
import Wishlist from "@/lib/db/models/Wishlist";
import connectToDatabase from "@/lib/db/mongodb";

async function getUserId() {
	const session = await auth();
	return session?.user?.id || session?.user?.email;
}

export async function fetchWishlist(): Promise<string[]> {
	const userId = await getUserId();
	if (!userId) return [];

	await connectToDatabase();
	const wishlist = await Wishlist.findOne({ userId }).lean();

	if (!wishlist) return [];

	return wishlist.productIds || [];
}

export async function syncWishlist(productIds: string[]): Promise<string[]> {
	const userId = await getUserId();
	if (!userId) throw new Error("require_auth");

	await connectToDatabase();

	const wishlist = await Wishlist.findOneAndUpdate(
		{ userId },
		{ $set: { productIds } },
		{ new: true, upsert: true }
	).lean();

	return wishlist.productIds;
}

export async function fetchWishlistProducts(
	productIds: string[]
): Promise<any[]> {
	if (!productIds || productIds.length === 0) return [];

	await connectToDatabase();
	const { Product } = await import("@/lib/db/models/Product");
	const { Bundle } = await import("@/lib/db/models/Bundle");

	const [products, bundles] = await Promise.all([
		Product.find({ _id: { $in: productIds } }).lean(),
		Bundle.find({ _id: { $in: productIds } }).lean(),
	]);

	const formattedProducts = products.map((p: any) => ({
		id: p._id.toString(),
		productId: p._id.toString(),
		title: p.title,
		slug: p.slug,
		author: p.author,
		price: p.price,
		image: p.coverImage || (p.images && p.images[0]) || "",
		category: p.categoryName || "",
		categoryId: p.categoryId,
		categorySlug: p.categorySlug,
		stock: p.stock,
		availableForSale: p.stock > 0,
		badge: p.ribbon,
	}));

	const formattedBundles = bundles.map((b: any) => ({
		id: b._id.toString(),
		productId: b._id.toString(),
		title: b.title,
		slug: b.slug,
		price: b.price,
		image: b.coverImage || "",
		category: "Bundle",
		stock: 99,
		availableForSale: true,
		isBundle: true,
	}));

	return [...formattedProducts, ...formattedBundles];
}
