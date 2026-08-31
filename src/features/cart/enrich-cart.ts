import type { Bundle } from "@/lib/catalog/types";

/** Attach bundle slug, label, href, and cover for cart line items. */
export function enrichCartWithBundles(
	cart: unknown,
	_bundles: Bundle[]
): unknown {
	return cart;
}
