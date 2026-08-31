import Link from "next/link";

import {
	BookOpenCheckIcon,
	ShieldCheckIcon,
	ShoppingBagIcon,
	TruckIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import type { BundlePresentation } from "@/domain/bundle";
import type { Bundle } from "@/domain/catalog";

import type { BundleCampaignBannerSlot } from "../data/bundle-campaign-banners";
import { BundlesCampaignActions } from "./bundles-campaign-actions";
import { BundlesCampaignBanner } from "./bundles-campaign-banner";
import { HeroFeaturedBundleCard } from "./ui/hero-featured-bundle-card";

interface BundlesIndexHeroProps {
	featuredSlug: string;
	featuredBundle: BundlePresentation;
	maxSavings: number;
	bundles: Bundle[];
	heroBanner: BundleCampaignBannerSlot;
}

export function BundlesIndexHero({
	featuredSlug,
	featuredBundle,
	maxSavings,
	heroBanner,
}: BundlesIndexHeroProps) {
	return (
		<section className="relative overflow-hidden bg-card py-6 sm:py-12 md:py-20">
			<div className="absolute inset-0 bg-[radial-gradient(100%_100%_at_50%_100%,oklch(from_var(--color-gold)_l_c_h/0.25)_0,var(--color-card)_50%,var(--color-card)_100%)] bg-card" />
			<div className="container relative z-10">
				<div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
					<div className="flex flex-col items-start gap-3 md:gap-5 lg:col-span-5">
						<Badge variant="warning">Limited-time bundle offer</Badge>
						<h1 className="font-bold font-display text-3xl text-secondary leading-tight tracking-tight md:text-4xl lg:text-5xl">
							Curated book bundles: One cart, one great price
						</h1>
						<p className="max-w-md text-muted-foreground leading-relaxed">
							Save up to{" "}
							<span className="font-semibold text-primary">
								AED {maxSavings}
							</span>{" "}
							per set. Prices return to list value when the offer window ends.
						</p>
						<BundlesCampaignActions
							featuredSlug={featuredSlug}
							variant="countdown"
						/>
						<div className="flex w-full flex-col gap-3 sm:flex-row sm:items-stretch">
							<Button
								className="btn-shimmer min-h-11 w-full shrink-0 sm:flex-1"
								nativeButton={false}
								render={<Link href={`/bundles/${featuredSlug}`} />}
								size="lg"
								variant="secondary"
							>
								<ShoppingBagIcon className="mr-2 size-4" />
								Buy the bundle now
							</Button>

							<BundlesCampaignActions
								buttonSize="lg"
								className="w-full shrink-0 bg-card sm:flex-1"
								featuredSlug={featuredSlug}
								variant="scroll-bundles"
							/>
						</div>
						<ul className="flex flex-wrap gap-x-6 gap-y-1 text-gold text-xs">
							<li>
								<TruckIcon className="mr-1 inline size-[2ch]" />
								UAE delivery
							</li>
							<li>
								<BookOpenCheckIcon className="mr-1 inline size-[2ch]" /> Curated
								sets
							</li>
							<li>
								<ShieldCheckIcon className="mr-1 inline size-[2ch]" /> Secure
								checkout
							</li>
						</ul>
					</div>

					<div className="relative lg:col-span-7">
						<BundlesCampaignBanner
							priority
							showOverlayCta={false}
							slot={heroBanner}
						/>
						<HeroFeaturedBundleCard
							coverImage={featuredBundle.coverImage}
							name={featuredBundle.name}
							originalPrice={featuredBundle.originalPrice}
							price={featuredBundle.price}
						/>
					</div>
				</div>
			</div>
		</section>
	);
}
