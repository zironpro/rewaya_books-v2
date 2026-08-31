import type { Metadata } from "next";

import { resolveCampaignBanners } from "@/features/bundle-landing/data/bundle-campaign-banners";
import { BundleLandingPageView } from "@/features/bundles/bundle-landing-page-view";
export async function generateMetadata(): Promise<Metadata> {
	const title = "Bundle deals · Rewaya Book world";
	const description =
		"Curated book bundles and limited-time offers. UAE delivery.";

	return {
		title,
		description,
		openGraph: {
			title,
			description,
			type: "website",
		},
		twitter: {
			card: "summary_large_image",
			title,
			description,
		},
	};
}

export default async function BundleIndexPage() {
	const data: any = {
		featuredBundle: null,
		secondaryBundles: [],
		remainingBundles: [],
	};
	const banners = resolveCampaignBanners();

	return <BundleLandingPageView banners={banners} data={data} />;
}
