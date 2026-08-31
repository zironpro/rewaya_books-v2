"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";

import type { BundlePresentation } from "@/domain/bundle";
import { cn } from "@/lib/utils";

import { BundleCheckoutCta } from "./bundle-checkout-cta";
import { CountdownTimer } from "./countdown-timer";

const OFFER_LABEL = "Offer may end in";

type CampaignActionsVariant =
	| "countdown"
	| "countdown-compact"
	| "buy-featured"
	| "buy-bundle"
	| "scroll-bundles";

interface BundlesCampaignActionsProps {
	variant: CampaignActionsVariant;
	featuredSlug: string;
	featuredBundle?: BundlePresentation;
	bundle?: BundlePresentation;
	buyLabel?: string;
	className?: string;
	buttonSize?: "default" | "sm" | "lg";
	countdownVariant?: "default" | "dark";
}

export function BundlesCampaignActions({
	variant,
	featuredSlug,
	featuredBundle,
	bundle,
	buyLabel = "Buy the bundle now",
	className,
	buttonSize = "lg",
	countdownVariant = "default",
}: BundlesCampaignActionsProps) {
	if (variant === "countdown") {
		return (
			<CountdownTimer
				className={className}
				label={OFFER_LABEL}
				slug={featuredSlug}
				variant={countdownVariant}
			/>
		);
	}

	if (variant === "countdown-compact") {
		return (
			<CountdownTimer
				className={className}
				label={OFFER_LABEL}
				size="compact"
				slug={featuredSlug}
				variant={countdownVariant}
			/>
		);
	}

	if (variant === "scroll-bundles") {
		return (
			<Button
				className={cn("min-h-11 shrink-0", className)}
				data-track="cta"
				nativeButton={false}
				render={<Link href="#bundles" />}
				size={buttonSize}
				variant="outline"
			>
				Choose your bundle
			</Button>
		);
	}

	if (variant === "buy-featured" && featuredBundle) {
		return (
			<BundleCheckoutCta
				bundle={featuredBundle}
				className={className}
				label={buyLabel}
				shimmerClass="campaign-shimmer"
				size={buttonSize}
			/>
		);
	}

	if (variant === "buy-bundle" && bundle) {
		return (
			<BundleCheckoutCta
				bundle={bundle}
				className={cn("w-full", className)}
				label={buyLabel}
				shimmerClass="campaign-shimmer"
				size={buttonSize}
			/>
		);
	}

	return null;
}
