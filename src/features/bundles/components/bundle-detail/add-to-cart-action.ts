"use server";

export async function addToCartAction(_input: {
	checkoutCatalogItemId: string;
	checkoutCatalogAppId?: string;
	bundleSlug?: string;
	quantity?: number;
}) {
	return { cart: null };
}
