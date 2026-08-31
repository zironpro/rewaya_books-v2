"use client";

import { useWishlist } from "@/features/wishlist/wishlist-provider";

export function useWishlistCount() {
	return useWishlist().count;
}
