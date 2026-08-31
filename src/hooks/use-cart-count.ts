"use client";

import { useCart } from "@/features/cart/cart-provider";

export function useCartCount() {
	const { count } = useCart();
	return count;
}
