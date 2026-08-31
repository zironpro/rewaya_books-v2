import type { BundlePresentation } from "@/domain/bundle";

import { BundlesCampaignActions } from "./bundles-campaign-actions";
import { CountdownTimer } from "./countdown-timer";

interface BundlesIndexCtaProps {
	featuredSlug: string;
	featuredBundle: BundlePresentation;
}

export function BundlesIndexCta({
	featuredSlug,
	featuredBundle,
}: BundlesIndexCtaProps) {
	return (
		<section className="relative overflow-hidden bg-secondary py-16 text-secondary-foreground md:py-24">
			<div
				aria-hidden
				className="pointer-events-none absolute inset-0 opacity-[0.07]"
				style={{
					backgroundImage:
						"repeating-linear-gradient(-135deg, transparent, transparent 3px, rgba(255,255,255,0.65) 3px, rgba(255,255,255,0.65) 4px)",
				}}
			/>
			<div className="container relative z-1 mx-auto max-w-3xl px-4 text-center sm:px-6">
				<p className="font-medium text-gold text-xs uppercase tracking-[0.25em]">
					Last chance
				</p>
				<h2 className="mt-3 font-display text-2xl tracking-tight sm:text-3xl md:text-4xl">
					Buy your bundle before this offer ends
				</h2>
				<p className="mt-4 text-base text-white/75 leading-relaxed">
					Choose a curated set below, add to cart, and checkout with the same
					secure Rewaya delivery you trust.
				</p>
				<div className="mx-auto mt-6 flex justify-center">
					<CountdownTimer
						label="Offer may end in"
						slug={featuredSlug}
						variant="dark"
					/>
				</div>
				<div className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row sm:justify-center">
					<BundlesCampaignActions
						featuredBundle={featuredBundle}
						featuredSlug={featuredSlug}
						variant="buy-featured"
					/>
					<BundlesCampaignActions
						featuredSlug={featuredSlug}
						variant="scroll-bundles"
					/>
				</div>
			</div>
		</section>
	);
}
