export const CART_UPDATED_EVENT = "cart-updated";

export function dispatchCartUpdated(cart?: unknown) {
	if (typeof window === "undefined") return;
	window.dispatchEvent(
		new CustomEvent(CART_UPDATED_EVENT, {
			detail: cart ? { cart } : undefined,
		})
	);
}
