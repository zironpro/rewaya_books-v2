export type BundleCampaignBannerSlot = {
	id: string;
	imageSrc: string;
	imageAlt: string;
	title?: string;
	subtitle?: string;
	ctaLabel?: string;
	ctaHref?: string;
	aspect?: "hero" | "wide";
};

export const BUNDLE_CAMPAIGN_BANNERS: Record<
	"hero-banner" | "mid-banner",
	BundleCampaignBannerSlot
> = {
	"hero-banner": {
		id: "hero-banner",
		imageSrc: "/bundles/bundle-hero.webp",
		imageAlt: "Rewaya bundle campaign hero",
		title: "Curated sets for young readers",
		subtitle: "Save more when you buy the full bundle",
		ctaLabel: "Buy the bundle now",
		ctaHref: "/bundles",
		aspect: "hero",
	},
	"mid-banner": {
		id: "mid-banner",
		imageSrc: "/banners/all-bundle-banner.webp",
		imageAlt: "Bundle offer - limited time",
		ctaLabel: "Buy the bundle now",
		ctaHref: "/bundles",
		aspect: "wide",
	},
};

export function resolveCampaignBanners(): {
	hero: BundleCampaignBannerSlot;
	mid: BundleCampaignBannerSlot;
} {
	const envSrc = process.env.BUNDLE_CAMPAIGN_BANNER_SRC?.trim();
	const hero = { ...BUNDLE_CAMPAIGN_BANNERS["hero-banner"] };
	const mid = { ...BUNDLE_CAMPAIGN_BANNERS["mid-banner"] };

	if (envSrc) {
		hero.imageSrc = envSrc;
	}

	return { hero, mid };
}
