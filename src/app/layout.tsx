import type { Metadata } from "next";
import "@/styles/globals.css";

import MetaPixelProvider from "@/components/meta/MetaPixelProvider";
import QueryProvider from "@/components/providers/query";
import { ToastProvider } from "@/components/ui/toast";
import { TooltipProvider } from "@/components/ui/tooltip";

import { inter, playfair } from "@/assets/fonts";

import { CartProvider } from "@/features/cart/cart-provider";
import { WishlistProvider } from "@/features/wishlist/wishlist-provider";
import OpenPanelProvider from "@/lib/open-panel/provider";
import { cn } from "@/lib/utils";
import { SessionProvider } from "next-auth/react";

export const metadata: Metadata = {
	title: "Al Rewaya Book World | Your Premier Bookstore in UAE",
	description:
		"Discover a curated collection of Islamic literature, academic texts, and classic books at Rewaya Book World.",

	other: {
		"facebook-domain-verification": "40qw6zil0ubg6k26nl0ku20oy70djy",
		"apple-mobile-web-app-title": "Rewaya",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			className={cn(
				"scroll-smooth antialiased",
				playfair.variable,
				"font-sans",
				inter.variable
			)}
			data-scroll-behavior="smooth"
			lang="en"
		>
			<body>
				<SessionProvider>
					<QueryProvider>
						<OpenPanelProvider>
						<CartProvider>
							<WishlistProvider>
								<MetaPixelProvider>
									<TooltipProvider delay={0}>
										<ToastProvider>{children}</ToastProvider>
									</TooltipProvider>
								</MetaPixelProvider>
							</WishlistProvider>
						</CartProvider>
					</OpenPanelProvider>
				</QueryProvider>
				</SessionProvider>
			</body>
		</html>
	);
}
