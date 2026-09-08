"use client";

import { useEffect, useRef } from "react";

import { useCart } from "@/features/cart/cart-provider";

export function ClearCartEffect() {
	const { clearCart } = useCart();
	const hasCleared = useRef(false);

	useEffect(() => {
		if (!hasCleared.current) {
			hasCleared.current = true;
			clearCart();
		}
	}, [clearCart]);

	return null;
}
