import { BundleSetCard } from "@/components/bundle-set-card";

import { BundleIndexDetailSection } from "@/features/bundle-landing/components/bundle-index-detail-section";
import { BundlesBookMarquee } from "@/features/bundle-landing/components/bundles-book-marquee";
import { BundlesCampaignBanner } from "@/features/bundle-landing/components/bundles-campaign-banner";
import { BundlesIndexCta } from "@/features/bundle-landing/components/bundles-index-cta";
import { BundlesIndexFaqSection } from "@/features/bundle-landing/components/bundles-index-faq-section";
import { BundlesIndexHero } from "@/features/bundle-landing/components/bundles-index-hero";
import { BundlesIndexSocialProof } from "@/features/bundle-landing/components/bundles-index-social-proof";
import { BundlesIndexStickyBar } from "@/features/bundle-landing/components/bundles-index-sticky-bar";
import { BundlesIndexTrust } from "@/features/bundle-landing/components/bundles-index-trust";
import { BundlesUrgencyCallout } from "@/features/bundle-landing/components/bundles-urgency-callout";
import type { BundleCampaignBannerSlot } from "@/features/bundle-landing/data/bundle-campaign-banners";
import type { BundlesIndexPageData } from "@/features/bundle-landing/lib/bundlesIndexData";

interface BundleLandingPageViewProps {
	data: BundlesIndexPageData;
	banners: {
		hero: BundleCampaignBannerSlot;
		mid: BundleCampaignBannerSlot;
	};
}

export function BundleLandingPageView({
	data,
	banners,
}: BundleLandingPageViewProps) {
	const featuredSlug = data.featuredBundle?.id ?? "/bundles";

	if (data.bundles.length === 0) {
		return (
			<main className="container py-32 text-center">
				<h1 className="font-bold font-display text-3xl text-secondary">
					Bundle deals
				</h1>
				<p className="mt-4 text-muted-foreground">
					No bundles are available right now. Check back soon or browse the
					shop.
				</p>
			</main>
		);
	}

	return (
		<main className="bg-background pb-24 md:pb-0">
			{data.featuredPresentation ? (
				<BundlesIndexHero
					bundles={data.bundles}
					featuredBundle={data.featuredPresentation}
					featuredSlug={featuredSlug}
					heroBanner={banners.hero}
					maxSavings={data.maxSavings}
				/>
			) : null}

			<BundlesBookMarquee slides={data.bookSlides} />

			{data.featuredBundle ? (
				<BundlesUrgencyCallout featuredSlug={featuredSlug} />
			) : null}

			<section className="container scroll-mt-24 py-14 md:py-20" id="bundles">
				<div className="mb-10 text-center md:text-left">
					<p className="font-medium text-primary text-xs uppercase tracking-[0.2em]">
						Pick your set
					</p>
					<h2 className="mt-1 font-bold font-display text-3xl text-secondary md:text-4xl">
						Bundle deals
					</h2>
					<p className="mt-2 max-w-xl text-muted-foreground">
						Compare curated stacks and add to cart in one tap.
					</p>
				</div>

				<div className="grid grid-cols-1 gap-8 md:grid-cols-2">
					{data.bundles.map((bundle) => (
						<BundleSetCard bundle={bundle} key={bundle.id} />
					))}
				</div>
			</section>

			{data.featuredPresentation ? (
				<section className="container py-10 md:py-14">
					<BundlesCampaignBanner
						featuredBundle={data.featuredPresentation}
						featuredSlug={featuredSlug}
						slot={banners.mid}
					/>
				</section>
			) : null}

			{data.bundlePresentations.map((bundle, index) => (
				<BundleIndexDetailSection
					bundle={bundle}
					featuredSlug={featuredSlug}
					index={index}
					key={bundle.slug}
				/>
			))}

			<BundlesIndexSocialProof reviews={data.reviews} />
			<BundlesIndexFaqSection faqs={data.faqs} />
			<BundlesIndexTrust />
			{data.featuredPresentation ? (
				<BundlesIndexCta
					featuredBundle={data.featuredPresentation}
					featuredSlug={featuredSlug}
				/>
			) : null}
			{data.featuredBundle ? (
				<BundlesIndexStickyBar featuredSlug={featuredSlug} />
			) : null}
		</main>
	);
}
