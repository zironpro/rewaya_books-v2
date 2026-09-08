"use client";

import { useState } from "react";

import { useOpenPanel } from "@openpanel/nextjs";

import { dispatchCartUpdated } from "@/components/commerce/cart-events";
import { Button } from "@/components/ui/button";
import { toastManager } from "@/components/ui/toast";

import { useCart } from "@/features/cart/cart-provider";
import { trackMetaEvent } from "@/lib/analytics/meta";

interface AddToCartButtonProps {
	productId: string;
	productName: string;
	catalogAppId?: string;
	productVariant?: any;
	availableForSale?: boolean;
	quantity?: number;
	price?: number;
	image?: string;
	stock?: number;
	disabled?: boolean;
	className?: string;
	size?: "default" | "sm" | "lg" | "icon";
	variant?: "default" | "secondary" | "outline" | "ghost";
	children?: React.ReactNode;
	onAdded?: () => void;
	trackEventName?: string;
}

export function AddToCartButton({
	productId,
	productName,
	catalogAppId,
	productVariant,
	availableForSale,
	quantity = 1,
	price,
	image,
	stock,
	disabled,
	className,
	size = "lg",
	variant = "secondary",
	children,
	onAdded,
	trackEventName = "add_to_cart",
}: AddToCartButtonProps) {
	const { track } = useOpenPanel();
	const { addItem } = useCart();
	const [status, setStatus] = useState<"idle" | "loading" | "added" | "error">(
		"idle"
	);

	const inStock = stock !== undefined ? stock > 0 : availableForSale !== false;
	const canAdd = Boolean(productId) && inStock;
	const outOfStock = Boolean(productId) && !inStock;

	const handleAddToCart = () => {
		if (!productId || !canAdd) return;

		setStatus("added");
		onAdded?.();
		setTimeout(() => setStatus("idle"), 2000);

		addItem({
			productId,
			title: productName,
			variant: productVariant,
			quantity,
			price,
			image,
			stock,
			catalogAppId,
			availableForSale,
		})
			.then(() => {
				toastManager.add({
					title: "Added to cart",
					description: productName,
					type: "success",
				});
				// Track Meta AddToCart event
				if (typeof window !== "undefined") {
					trackMetaEvent("AddToCart", {
						event_source_url: window.location.href,
						custom_data: {
							content_ids: [productId],
							content_name: productName,
							content_type: "product",
							currency: "AED",
						},
					});
				}
				track(trackEventName, {
					product_id: productId,
					product_name: productName,
					quantity,
				});
			})
			.catch((e: any) => {
				console.error("[cart] add to cart failed:", e);
				setStatus("error");

				if (e instanceof Error && e.message === "require_auth") {
					toastManager.add({
						title: "Login Required",
						description: "Please login to add items to your bag.",
						type: "info",
						actionProps: {
							children: "Login",
							altText: "Navigate to Login",
							onClick: () => {
								window.location.href = "/login";
							},
						},
					});
				} else {
					toastManager.add({
						title: "Error",
						description:
							e instanceof Error ? e.message : "Could not add to cart.",
						type: "error",
					});
				}

				dispatchCartUpdated();
				setTimeout(() => setStatus("idle"), 2500);
			});
	};

	const label =
		status === "loading"
			? "Adding…"
			: status === "added"
				? "Added ✓"
				: status === "error"
					? "Try again"
					: outOfStock
						? "Out of Stock"
						: (children ?? "Add to Cart");

	return (
		<Button
			className={className}
			disabled={disabled || !canAdd || status === "added"}
			onClick={handleAddToCart}
			size={size}
			title={outOfStock ? "This item is currently out of stock" : undefined}
			variant={variant}
		>
			{label}
		</Button>
	);
}
