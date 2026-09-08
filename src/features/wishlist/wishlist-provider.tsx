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

import { fetchWishlist, syncWishlist } from "./wishlist-actions";

type WishlistContextValue = {
	productIds: string[];
	count: number;
	isLoading: boolean;
	isWishlisted: (productId: string | undefined) => boolean;
	toggle: (productId: string) => Promise<void>;
	refresh: () => Promise<void>;
};

const WishlistContext = createContext<WishlistContextValue | null>(null);

function dispatchWishlistUpdated() {
	if (typeof window !== "undefined") {
		window.dispatchEvent(new CustomEvent("wishlist-updated"));
	}
}

export function WishlistProvider({ children }: { children: ReactNode }) {
	const { data: session, status } = useSession();
	const [productIds, setProductIds] = useState<string[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	const refresh = useCallback(async () => {
		if (status === "loading") return;
		setIsLoading(true);
		try {
			if (session?.user) {
				const serverWishlist = await fetchWishlist();
				setProductIds(serverWishlist);
			} else {
				setProductIds([]);
			}
		} catch (e) {
			console.error("Wishlist refresh error", e);
		} finally {
			setIsLoading(false);
		}
	}, [session?.user, status]);

	useEffect(() => {
		if (status !== "loading") {
			refresh();
		}
	}, [refresh, status]);

	useEffect(() => {
		const onUpdate = () => refresh();
		window.addEventListener("wishlist-updated", onUpdate);
		return () => window.removeEventListener("wishlist-updated", onUpdate);
	}, [refresh]);

	const toggle = useCallback(
		async (productId: string) => {
			if (!productId) return;
			if (!session?.user) {
				throw new Error("require_auth");
			}

			const isCurrentlyWishlisted = productIds.includes(productId);
			const nextIds = isCurrentlyWishlisted
				? productIds.filter((id) => id !== productId)
				: [...productIds, productId];

			// Optimistic update
			setProductIds(nextIds);

			try {
				await syncWishlist(nextIds);
				dispatchWishlistUpdated();
			} catch (e: any) {
				// Rollback on error
				setProductIds(productIds);
				if (e.message === "require_auth") {
					throw e;
				}
				console.error("Failed to sync wishlist", e);
				throw new Error("Failed to sync wishlist");
			}
		},
		[session?.user, productIds]
	);

	const value = useMemo<WishlistContextValue>(
		() => ({
			productIds,
			count: productIds.length,
			isLoading,
			isWishlisted: (productId) =>
				Boolean(productId && productIds.includes(productId)),
			toggle,
			refresh,
		}),
		[productIds, isLoading, toggle, refresh]
	);

	return (
		<WishlistContext.Provider value={value}>
			{children}
		</WishlistContext.Provider>
	);
}

export function useWishlist() {
	const ctx = useContext(WishlistContext);
	if (!ctx) {
		throw new Error("useWishlist must be used within WishlistProvider");
	}
	return ctx;
}
