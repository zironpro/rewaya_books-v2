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

import { CART_UPDATED_EVENT } from "@/components/commerce/cart-events";

import {
	fetchCart,
	addItem as serverAddItem,
	clearCart as serverClearCart,
	syncCart,
} from "@/features/cart/cart-actions";
import { type CartSnapshot } from "@/features/cart/cart-sdk";

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
	const [snapshot, setSnapshot] = useState<CartSnapshot | null>({
		lineItems: [],
		summary: { subtotal: "0", total: "0", discountNames: [] },
	});
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const saveGuestCart = useCallback((newSnapshot: CartSnapshot) => {
		setSnapshot(newSnapshot);
		sessionStorage.setItem("guest_cart", JSON.stringify(newSnapshot));
	}, []);

	const refresh = useCallback(async () => {
		if (status === "loading") return;
		setIsLoading(true);
		setError(null);
		try {
			if (session?.user) {
				const serverCart = await fetchCart();
				if (serverCart) setSnapshot(serverCart);
			} else {
				const guestCartStr = sessionStorage.getItem("guest_cart");
				if (guestCartStr) {
					setSnapshot(JSON.parse(guestCartStr));
				} else {
					setSnapshot({
						lineItems: [],
						summary: { subtotal: "0", total: "0", discountNames: [] },
					});
				}
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
				setSnapshot({
					lineItems: [],
					summary: { subtotal: "0", total: "0", discountNames: [] },
				});
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
			const itemPrice =
				typeof item.price === "object"
					? Number(item.price.amount || 0)
					: Number(item.price || 0);
			return acc + itemPrice * (item.quantity || 1);
		}, 0);
		return {
			lineItems: items,
			summary: {
				subtotal: `AED ${subtotal.toFixed(2)}`,
				total: `AED ${subtotal.toFixed(2)}`,
				discountNames: [],
			},
		} as CartSnapshot;
	};

	const addItem = useCallback(
		async (item: any) => {
			if (!session?.user) {
				const currentItems = snapshot?.lineItems || [];
				const actualProductId = item.productId || item.catalogItemId || item._id;
				const existingIndex = currentItems.findIndex(
					(i) => (i.productId || i._id) === actualProductId
				);

				const newItems = [...currentItems];
				if (existingIndex >= 0) {
					newItems[existingIndex].quantity =
						(newItems[existingIndex].quantity || 1) + (item.quantity || 1);
				} else {
					newItems.push({
						_id: actualProductId,
						productId: actualProductId,
						title: item.title || item.productName?.translated || "Product",
						price: item.price || 0,
						quantity: item.quantity || 1,
						image: item.image,
						isBundle: item.isBundle || !!item.bundleSlug,
						bundleSlug: item.bundleSlug,
					});
				}
				
				saveGuestCart(updateCartTotals(newItems));
				return;
			}

			const res = await serverAddItem(null, item);
			if (res.error) {
				throw new Error(res.error);
			}
			if (res.cart) {
				setSnapshot(res.cart);
			}
		},
		[session?.user, snapshot, saveGuestCart]
	);

	const removeItem = useCallback(
		async (lineId: string) => {
			const currentItems = snapshot?.lineItems || [];
			const newItems = currentItems.filter(
				(i) => i._id !== lineId && i.productId !== lineId
			);
			const newSnapshot = updateCartTotals(newItems);
			
			if (!session?.user) {
				saveGuestCart(newSnapshot);
				return;
			}
			
			setSnapshot(newSnapshot);
			await syncCart(newItems);
		},
		[session?.user, snapshot, saveGuestCart]
	);

	const updateQuantity = useCallback(
		async (lineId: string, quantity: number) => {
			const currentItems = snapshot?.lineItems || [];
			const newItems = [...currentItems];
			const item = newItems.find(
				(i) => i._id === lineId || i.productId === lineId
			);
			if (item) {
				item.quantity = quantity;
				const itemPrice =
					typeof item.price === "object"
						? Number(item.price.amount || 0)
						: Number(item.price || 0);
				item.lineItemPrice = {
					amount: (itemPrice * quantity).toString(),
					formattedConvertedAmount: `AED ${(itemPrice * quantity).toFixed(2)}`,
				};
				const newSnapshot = updateCartTotals(newItems);
				
				if (!session?.user) {
					saveGuestCart(newSnapshot);
					return;
				}
				
				setSnapshot(newSnapshot);
				await syncCart(newItems);
			}
		},
		[session?.user, snapshot, saveGuestCart]
	);

	const clearCartAction = useCallback(async () => {
		const emptySnapshot = {
			lineItems: [],
			summary: { subtotal: "0", total: "0", discountNames: [] },
		};
		if (!session?.user) {
			saveGuestCart(emptySnapshot);
			return;
		}
		setSnapshot(emptySnapshot);
		await serverClearCart();
	}, [session?.user, saveGuestCart]);

	const count = useMemo(
		() =>
			snapshot?.lineItems?.reduce(
				(sum, item) => sum + (item.quantity ?? 0),
				0
			) ?? 0,
		[snapshot]
	);

	const value = useMemo(
		() => ({
			count,
			snapshot,
			error,
			isLoading,
			refresh,
			addItem,
			removeItem,
			updateQuantity,
			clearCart: clearCartAction,
		}),
		[
			count,
			snapshot,
			error,
			isLoading,
			refresh,
			addItem,
			removeItem,
			updateQuantity,
			clearCartAction,
		]
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
