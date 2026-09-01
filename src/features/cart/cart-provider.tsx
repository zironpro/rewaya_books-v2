"use client";

import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";
import { useSession } from "next-auth/react";

import { CART_UPDATED_EVENT, dispatchCartUpdated } from "@/components/commerce/cart-events";
import { toastManager } from "@/components/ui/toast";

import { fetchCart, syncCart, addItem as serverAddItem, clearCart as serverClearCart } from "@/features/cart/cart-actions";
import {
	type CartSnapshot,
} from "@/features/cart/cart-sdk";

interface CartContextValue {
	count: number;
	snapshot: CartSnapshot | null;
	error: string | null;
	isLoading: boolean;
	refresh: () => Promise<void>;
	addItem: (item: any) => Promise<void>;
	removeItem: (lineId: string) => Promise<void>;
	updateQuantity: (lineId: string, quantity: number) => Promise<void>;
	clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
	const { data: session, status } = useSession();
	const [snapshot, setSnapshot] = useState<CartSnapshot | null>({ lineItems: [], summary: { subtotal: "0", total: "0", discountNames: [] } });
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const refresh = useCallback(async () => {
		if (status === "loading") return;
		setIsLoading(true);
		setError(null);
		try {
			if (session?.user) {
				const serverCart = await fetchCart();
				if (serverCart) setSnapshot(serverCart);
			} else {
				setSnapshot({ lineItems: [], summary: { subtotal: "0", total: "0", discountNames: [] } });
			}
		} catch (e) {
			console.error("Cart refresh error", e);
		} finally {
			setIsLoading(false);
		}
	}, [session?.user, status]);

	useEffect(() => {
		const onUpdate = (event: Event) => {
			const detail = (event as CustomEvent<{ cart?: unknown }>).detail;
			if (detail?.cart) {
				setSnapshot(detail.cart as CartSnapshot);
			} else {
				setSnapshot({ lineItems: [], summary: { subtotal: "0", total: "0", discountNames: [] } });
			}
		};

		window.addEventListener(CART_UPDATED_EVENT, onUpdate);
		return () => window.removeEventListener(CART_UPDATED_EVENT, onUpdate);
	}, []);

	useEffect(() => {
		if (status !== "loading") {
			refresh();
		}
	}, [refresh, status]);

	const updateCartTotals = (items: any[]) => {
		const subtotal = items.reduce((acc, item) => {
			const itemPrice = typeof item.price === "object" ? Number(item.price.amount || 0) : Number(item.price || 0);
			return acc + (itemPrice * (item.quantity || 1));
		}, 0);
		return {
			lineItems: items,
			summary: {
				subtotal: `AED ${subtotal.toFixed(2)}`,
				total: `AED ${subtotal.toFixed(2)}`,
				discountNames: []
			}
		} as CartSnapshot;
	};

	const addItem = useCallback(async (item: any) => {
		if (!session?.user) {
			throw new Error("require_auth");
		}
		const res = await serverAddItem(null, item);
		if (res.error) {
			throw new Error(res.error);
		}
		if (res.cart) {
			setSnapshot(res.cart);
		}
	}, [session?.user]);

	const removeItem = useCallback(async (lineId: string) => {
		if (!session?.user) return;
		const currentItems = snapshot?.lineItems || [];
		const newItems = currentItems.filter(i => i._id !== lineId && i.productId !== lineId);
		setSnapshot(updateCartTotals(newItems));
		await syncCart(newItems);
	}, [session?.user, snapshot]);

	const updateQuantity = useCallback(async (lineId: string, quantity: number) => {
		if (!session?.user) return;
		const currentItems = snapshot?.lineItems || [];
		const newItems = [...currentItems];
		const item = newItems.find(i => i._id === lineId || i.productId === lineId);
		if (item) {
			item.quantity = quantity;
			const itemPrice = typeof item.price === "object" ? Number(item.price.amount || 0) : Number(item.price || 0);
			item.lineItemPrice = {
				amount: (itemPrice * quantity).toString(),
				formattedConvertedAmount: `AED ${(itemPrice * quantity).toFixed(2)}`
			};
			setSnapshot(updateCartTotals(newItems));
			await syncCart(newItems);
		}
	}, [session?.user, snapshot]);

	const clearCartAction = useCallback(async () => {
		if (!session?.user) return;
		setSnapshot({ lineItems: [], summary: { subtotal: "0", total: "0", discountNames: [] } });
		await serverClearCart();
	}, [session?.user]);

	const count = useMemo(
		() =>
			snapshot?.lineItems?.reduce(
				(sum, item) => sum + (item.quantity ?? 0),
				0
			) ?? 0,
		[snapshot]
	);

	const value = useMemo(
		() => ({ count, snapshot, error, isLoading, refresh, addItem, removeItem, updateQuantity, clearCart: clearCartAction }),
		[count, snapshot, error, isLoading, refresh, addItem, removeItem, updateQuantity, clearCartAction]
	);

	return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
	const ctx = useContext(CartContext);
	if (!ctx) {
		throw new Error("useCart must be used within CartProvider");
	}
	return ctx;
}
