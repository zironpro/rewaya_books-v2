"use client";

import { useEffect, useState, useTransition } from "react";

import { useRouter } from "next/navigation";

import { useOpenPanel } from "@openpanel/nextjs";
import { ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";

import type { BundlePresentation } from "@/domain/bundle";
import { AddBundleToCartButton } from "@/features/bundles/components/add-bundle-to-cart-button";
import {
	type BundleCheckoutResult,
	startBundleCheckout,
} from "@/features/cart/cart-actions";
import { trackMetaEvent } from "@/lib/analytics/meta";
import { cn } from "@/lib/utils";

const showCheckoutDebug = process.env.NEXT_PUBLIC_CHECKOUT_DEBUG === "1";

interface BundleCheckoutCtaProps {
	bundle: BundlePresentation;
	className?: string;
	size?: "default" | "sm" | "lg" | "icon";
	label?: string;
	shimmerClass?: string;
	/**
	 * "cart": add to cart (default).
	 * "checkout": add to cart then redirect to checkout immediately.
	 */
	mode?: "cart" | "checkout";
}

function formatCheckoutDebug(result: BundleCheckoutResult): string | null {
	if (!showCheckoutDebug || !result.debug) return null;
	return JSON.stringify(result.debug, null, 2);
}

export function BundleCheckoutCta({
	bundle,
	className,
	size = "lg",
	label = "Add bundle to cart",
	shimmerClass = "btn-shimmer",
	mode = "cart",
}: BundleCheckoutCtaProps) {
	const router = useRouter();
	const { track } = useOpenPanel();
	const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [debugDetails, setDebugDetails] = useState<string | null>(null);
	const [isPending, startCheckout] = useTransition();
	const [isRestored, setIsRestored] = useState(false);

	useEffect(() => {
		const onPageShow = (event: PageTransitionEvent) => {
			if (event.persisted) {
				setStatus("idle");
				setIsRestored(true);
			}
		};
		window.addEventListener("pageshow", onPageShow);
		return () => window.removeEventListener("pageshow", onPageShow);
	}, []);

	const canCheckout = Boolean(bundle.checkoutCatalogItemId);
	const isLoading = (status === "loading" || isPending) && !isRestored;
	const isDisabled = !canCheckout || isLoading;

	const handleCheckout = () => {
		if (!canCheckout) return;

		setStatus("loading");
		setIsRestored(false);
		setErrorMessage(null);
		setDebugDetails(null);

		if (typeof window !== "undefined") {
			trackMetaEvent("InitiateCheckout", {
				event_source_url: window.location.href,
				custom_data: {
					content_ids: [bundle.checkoutCatalogItemId],
					content_name: bundle.slug,
					content_type: "product_group",
					currency: "AED",
				},
			});
		}

		track("checkout", {
			product_id: bundle.checkoutCatalogItemId,
			product_name: bundle.slug,
			is_bundle: true,
		});

		startCheckout(() => {
			void startBundleCheckout(
				{
					catalogItemId: bundle.checkoutCatalogItemId,
					catalogAppId: bundle.checkoutCatalogAppId,
					bundleSlug: bundle.slug,
				},
				typeof window !== "undefined" ? window.location.origin : undefined
			).then((result) => {
				if (result.ok) {
					// If a checkout URL was returned (Shopify), redirect browser directly.
					if (result.checkoutUrl && typeof window !== "undefined") {
						window.location.href = result.checkoutUrl;
						return;
					}
					// Fallback to internal checkout route which triggers server-side redirect
					router.push("/checkout");
					return;
				}
				setStatus("error");
				setErrorMessage(
					result.error ?? "Could not start checkout. Please try again."
				);
				setDebugDetails(formatCheckoutDebug(result));
				if (showCheckoutDebug) {
					console.error("[checkout:debug] bundle CTA failed", result);
				}
			});
		});
	};

	if (mode === "cart") {
		return (
			<AddBundleToCartButton
				bundleSlug={bundle.slug}
				checkoutCatalogAppId={bundle.checkoutCatalogAppId}
				checkoutCatalogItemId={bundle.checkoutCatalogItemId || bundle.id}
				title={bundle.title}
				price={bundle.price}
				image={bundle.coverImage}
				className={cn(
					shimmerClass,
					"min-h-11 w-full shrink-0 gap-2",
					className
				)}
				size={size}
			>
				<ShoppingBag className="size-4" />
				{label}
			</AddBundleToCartButton>
		);
	}

	return (
		<div className="flex w-full flex-col gap-1">
			<Button
				className={cn(shimmerClass, "min-h-11 w-full shrink-0", className)}
				disabled={isDisabled}
				onClick={handleCheckout}
				size={size}
				title={
					!canCheckout ? "This bundle is not available for purchase" : undefined
				}
				variant="secondary"
			>
				<ShoppingBag className="size-4" />
				{isLoading ? "Redirecting…" : label}
			</Button>
			{status === "error" && errorMessage ? (
				<p className="text-destructive text-xs">{errorMessage}</p>
			) : null}
			{status === "error" && debugDetails ? (
				<pre className="max-h-40 overflow-auto rounded-md bg-muted p-2 font-mono text-[10px] text-muted-foreground">
					{debugDetails}
				</pre>
			) : null}
		</div>
	);
}
