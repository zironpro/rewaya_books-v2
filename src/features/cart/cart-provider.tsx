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
	readCartSnapshot,
	writeCartSnapshot,
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
	const [snapshot, setSnapshot] = useState<CartSnapshot | null>(() =>
		readCartSnapshot() || { lineItems: [], summary: { subtotal: "0", total: "0", discountNames: [] } }
	);
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const saveToLocal = (newSnapshot: CartSnapshot) => {
		writeCartSnapshot(newSnapshot);
		setSnapshot(newSnapshot);
	};

	const refresh = useCallback(async () => {
		if (status === "loading") return;
		setIsLoading(true);
		setError(null);
		try {
			if (session?.user) {
				const localCart = readCartSnapshot();
				// Sync local cart to db if local cart has items
				let serverCart;
				if (localCart && localCart.lineItems.length > 0) {
					serverCart = await syncCart(localCart.lineItems);
					// clear local after sync to prevent infinite syncs? For now we just keep them same.
					saveToLocal(serverCart);
				} else {
					serverCart = await fetchCart();
					if (serverCart) saveToLocal(serverCart);
				}
			} else {
				// Guest mode
				setSnapshot(readCartSnapshot() || { lineItems: [], summary: { subtotal: "0", total: "0", discountNames: [] } });
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
				saveToLocal(detail.cart as CartSnapshot);
			} else {
				setSnapshot(readCartSnapshot() || { lineItems: [], summary: { subtotal: "0", total: "0", discountNames: [] } });
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
		if (session?.user) {
			const res = await serverAddItem(null, item);
			if (res.cart) {
				saveToLocal(res.cart);
			}
		} else {
			// Local storage
			const current = readCartSnapshot() || { lineItems: [], summary: { subtotal: "0", total: "0", discountNames: [] } };
			const idToUse = item.catalogItemId || item.productId;
			const existing = current.lineItems.find(i => i._id === idToUse || i.productId === idToUse);
			let newItems = [...current.lineItems];
			if (existing) {
				existing.quantity = (existing.quantity || 1) + (item.quantity || 1);
			} else {
				newItems.push({
					_id: idToUse,
					productId: idToUse,
					quantity: item.quantity || 1,
					price: {
						amount: (item.price || 0).toString(),
						formattedConvertedAmount: `AED ${(item.price || 0).toFixed(2)}`
					},
					title: item.title || item.bundleSlug || "Product",
					image: item.image,
					isBundle: item.isBundle || false,
					bundleSlug: item.bundleSlug,
					lineItemPrice: { 
						amount: ((item.price || 0) * (item.quantity || 1)).toString(),
						formattedConvertedAmount: `AED ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}`
					},
					productName: { translated: item.title || item.bundleSlug }
				});
			}
			const newCart = updateCartTotals(newItems);
			saveToLocal(newCart);
			dispatchCartUpdated(newCart);
		}
	}, [session?.user]);

	const removeItem = useCallback(async (lineId: string) => {
		// ... to do server sync if needed ...
		const current = readCartSnapshot() || { lineItems: [], summary: { subtotal: "0", total: "0", discountNames: [] } };
		const newItems = current.lineItems.filter(i => i._id !== lineId && i.productId !== lineId);
		const newCart = updateCartTotals(newItems);
		saveToLocal(newCart);
		dispatchCartUpdated(newCart);
		
		if (session?.user) {
			await syncCart(newItems);
		}
	}, [session?.user]);

	const updateQuantity = useCallback(async (lineId: string, quantity: number) => {
		const current = readCartSnapshot() || { lineItems: [], summary: { subtotal: "0", total: "0", discountNames: [] } };
		const newItems = [...current.lineItems];
		const item = newItems.find(i => i._id === lineId || i.productId === lineId);
		if (item) {
			item.quantity = quantity;
			const itemPrice = typeof item.price === "object" ? Number(item.price.amount || 0) : Number(item.price || 0);
			item.lineItemPrice = {
				amount: (itemPrice * quantity).toString(),
				formattedConvertedAmount: `AED ${(itemPrice * quantity).toFixed(2)}`
			};
			const newCart = updateCartTotals(newItems);
			saveToLocal(newCart);
			dispatchCartUpdated(newCart);
			
			if (session?.user) {
				await syncCart(newItems);
			}
		}
	}, [session?.user]);

	const clearCartAction = useCallback(async () => {
		const newCart = { lineItems: [], summary: { subtotal: "0", total: "0", discountNames: [] } };
		saveToLocal(newCart);
		dispatchCartUpdated(newCart);
		if (session?.user) {
			await serverClearCart();
		}
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
