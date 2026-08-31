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

type WishlistContextValue = {
	productIds: string[];
	count: number;
	isLoading: boolean;
	isWishlisted: (productId: string | undefined) => boolean;
	toggle: (productId: string) => Promise<void>;
	refresh: () => Promise<void>;
};

const WishlistContext = createContext<WishlistContextValue | null>(null);

function getLocalWishlist(): string[] {
	if (typeof window === "undefined") return [];
	try {
		return JSON.parse(localStorage.getItem("rewaya-wishlist") || "[]");
	} catch {
		return [];
	}
}

function setLocalWishlist(ids: string[]) {
	if (typeof window === "undefined") return;
	localStorage.setItem("rewaya-wishlist", JSON.stringify(ids));
}

function dispatchWishlistUpdated() {
	if (typeof window !== "undefined") {
		window.dispatchEvent(new CustomEvent("wishlist-updated"));
	}
}

export function WishlistProvider({ children }: { children: ReactNode }) {
	const [productIds, setProductIds] = useState<string[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		setProductIds(getLocalWishlist());
		setIsLoading(false);
	}, []);

	const refresh = useCallback(async () => {
		setProductIds(getLocalWishlist());
	}, []);

	useEffect(() => {
		const onUpdate = () => refresh();
		window.addEventListener("wishlist-updated", onUpdate);
		return () => window.removeEventListener("wishlist-updated", onUpdate);
	}, [refresh]);

	const toggle = useCallback(async (productId: string) => {
		if (!productId) return;

		setProductIds((prev) => {
			const isCurrentlyWishlisted = prev.includes(productId);
			const nextIds = isCurrentlyWishlisted
				? prev.filter((id) => id !== productId)
				: [...prev, productId];

			setLocalWishlist(nextIds);
			dispatchWishlistUpdated();
			return nextIds;
		});
	}, []);

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
