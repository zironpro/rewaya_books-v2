import type { Metadata } from "next";

import { WishlistView } from "@/features/wishlist/wishlist-view";

export const metadata: Metadata = {
	title: "Wishlist | Al Rewaya",
	description: "View your saved books and stories at Al Rewaya.",
};

export default function WishlistPage() {
	return <WishlistView />;
}
