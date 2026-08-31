import type { ProductVariant } from "@/lib/store";

/** Product-level availability (catalog + list views). */
export function resolveProductAvailableForSale(
	visible?: boolean,
	inventoryStatus?: string,
	variantInStock?: boolean,
	variantPreorderEnabled?: boolean
): boolean {
	if (visible === false) return false;
	if (inventoryStatus === "OUT_OF_STOCK") return false;
	if (variantInStock === false && variantPreorderEnabled !== true) {
		return false;
	}
	return true;
}

/** Whether the customer can add this product/variant to cart. */
export function isAvailableForPurchase(
	availableForSale?: boolean,
	variant?: ProductVariant
): boolean {
	return availableForSale !== false && variant?.availableForSale !== false;
}

/** Variant list implies purchasable when any variant is available. */
export function isAvailableFromVariants(
	variants: ProductVariant[] | undefined
): boolean {
	if (!variants?.length) return true;
	return variants.some((v) => v.availableForSale !== false);
}
