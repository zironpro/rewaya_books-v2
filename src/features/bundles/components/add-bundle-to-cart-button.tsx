"use client";

import { useState } from "react";

import { useOpenPanel } from "@openpanel/nextjs";

import { dispatchCartUpdated } from "@/components/commerce/cart-events";
import { Button } from "@/components/ui/button";
import { toastManager } from "@/components/ui/toast";

import { useCart } from "@/features/cart/cart-provider";
import { trackMetaEvent } from "@/lib/analytics/meta";

interface AddBundleToCartButtonProps {
	checkoutCatalogItemId: string;
	checkoutCatalogAppId?: string;
	/** Rewaya bundle slug — server re-resolves checkout ids at click time. */
	bundleSlug?: string;
	title?: string;
	price?: number;
	image?: string;
	quantity?: number;
	disabled?: boolean;
	className?: string;
	size?: "default" | "sm" | "lg" | "icon";
	variant?: "default" | "secondary" | "outline" | "ghost";
	children?: React.ReactNode;
	onAdded?: () => void;
}

export function AddBundleToCartButton({
	checkoutCatalogItemId,
	checkoutCatalogAppId,
	bundleSlug,
	title,
	price,
	image,
	quantity = 1,
	disabled,
	className,
	size = "lg",
	variant = "secondary",
	children,
	onAdded,
}: AddBundleToCartButtonProps) {
	const { track } = useOpenPanel();
	const { addItem } = useCart();
	const [status, setStatus] = useState<"idle" | "loading" | "added" | "error">(
		"idle"
	);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const canAdd = Boolean(checkoutCatalogItemId);

	const handleAddToCart = () => {
		if (!canAdd) return;

		setStatus("added");
		setErrorMessage(null);
		onAdded?.();
		setTimeout(() => setStatus("idle"), 2000);

		addItem({
			productId: checkoutCatalogItemId,
			catalogItemId: checkoutCatalogItemId,
			catalogAppId: checkoutCatalogAppId,
			bundleSlug,
			title,
			price,
			image,
			quantity,
			isBundle: true,
		})
			.then(() => {
				toastManager.add({
					title: "Bundle added to cart",
					description: bundleSlug ?? "bundle",
					type: "success",
				});
				// Track Meta AddToCart for bundle
				if (typeof window !== "undefined") {
					trackMetaEvent("AddToCart", {
						event_source_url: window.location.href,
						custom_data: {
							content_ids: [checkoutCatalogItemId],
							content_name: bundleSlug ?? "bundle",
							content_type: "product_group",
							currency: "AED",
						},
					});
				}
				track("add_to_cart", {
					product_id: checkoutCatalogItemId,
					product_name: bundleSlug ?? "bundle",
					quantity,
					is_bundle: true,
				});
			})
			.catch((e: any) => {
				const isAuthError = e instanceof Error && e.message === "require_auth";
				const errorMsg = isAuthError
					? "Please login to add items to your bag."
					: "Could not add bundle to cart. Please try again.";

				setErrorMessage(isAuthError ? null : errorMsg);
				setStatus("error");

				if (isAuthError) {
					toastManager.add({
						title: "Login Required",
						description: errorMsg,
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
						description: errorMsg,
						type: "error",
					});
				}

				dispatchCartUpdated();
				setTimeout(() => {
					setStatus("idle");
					setErrorMessage(null);
				}, 4000);
			});
	};

	const label =
		status === "loading"
			? "Adding…"
			: status === "added"
				? "Added ✓"
				: status === "error"
					? "Try again"
					: (children ?? "Add to Cart");

	return (
		<div className="flex w-full flex-col gap-1">
			<Button
				className={className}
				disabled={disabled || !canAdd || status === "added"}
				onClick={handleAddToCart}
				size={size}
				title={
					!canAdd ? "This bundle is not available for purchase" : undefined
				}
				variant={variant}
			>
				{label}
			</Button>
			{status === "error" && errorMessage ? (
				<p className="text-destructive text-xs">{errorMessage}</p>
			) : null}
		</div>
	);
}
