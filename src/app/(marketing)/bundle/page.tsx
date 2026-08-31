import type { Metadata } from "next";

import { resolveCampaignBanners } from "@/features/bundle-landing/data/bundle-campaign-banners";
import { BundleLandingPageView } from "@/features/bundles/bundle-landing-page-view";
import { graphqlClient } from "@/lib/graphql-client";
import { GetBundlesDocument } from "@/types/graphql";
import { buildBundlesIndexPageData } from "@/features/bundle-landing/lib/bundlesIndexData";
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
	let bundles: any[] = [];
	try {
		const res = await graphqlClient.request(GetBundlesDocument);
		bundles = res.bundles || [];
	} catch (e) {
		console.error("Failed to fetch bundles for index page", e);
	}

	const data = buildBundlesIndexPageData(bundles);
	const banners = resolveCampaignBanners();

	return <BundleLandingPageView banners={banners} data={data} />;
}
