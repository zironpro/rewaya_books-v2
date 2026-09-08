import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BundleLandingPage } from "@/features/bundle-landing/BundleLandingPage";
import { graphqlClient } from "@/lib/graphql-client";
import { GetBundleBySlugDocument, GetBundlesDocument } from "@/types/graphql";

export async function generateStaticParams() {
	return [];
}

interface BundleSlugPageProps {
	params: Promise<{ slug: string }>;
}

export async function generateMetadata({
	params,
}: BundleSlugPageProps): Promise<Metadata> {
	const { slug } = await params;
	let bundle: any = null;
	try {
		const res = await graphqlClient.request(GetBundleBySlugDocument, { slug });
		bundle = res.bundleBySlug;
	} catch (e) {
		console.error("Failed to fetch bundle metadata", e);
	}

	if (!bundle) {
		return { title: "Oops, you're in wrong shelf!" };
	}

	const title = bundle.title
		? `${bundle.title} · Rewaya Books`
		: "Bundle · Rewaya Books";

	const description = bundle.description || "";

	return {
		title,
		description,
		openGraph: {
			title,
			description: bundle.description,
			type: "website",
		},
		twitter: {
			card: "summary_large_image",
			title,
			description: bundle.description,
		},
	};
}

export default async function BundleSlugPage({ params }: BundleSlugPageProps) {
	const { slug } = await params;
	let bundle: any = null;
	let allBundles: any[] = [];
	const productVariantId: string | null = null;

	try {
		const [bundleRes, allBundlesRes] = await Promise.all([
			graphqlClient.request(GetBundleBySlugDocument, { slug }),
			graphqlClient.request(GetBundlesDocument),
		]);
		bundle = bundleRes.bundleBySlug;
		allBundles = allBundlesRes.bundles || [];
	} catch (e) {
		console.error("Failed to fetch bundle page data", e);
	}

	if (!bundle) {
		notFound();
	}

	const relatedBundles = allBundles.filter((b: any) => b.slug !== slug);

	return (
		<BundleLandingPage
			bundle={bundle}
			productVariantId={productVariantId}
			relatedBundles={relatedBundles}
		/>
	);
}
