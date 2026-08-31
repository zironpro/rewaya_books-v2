import { notFound } from "next/navigation";

import { BundleDetailView } from "@/features/bundles/bundle-detail-view";
import { graphqlClient } from "@/lib/graphql-client";
import { GetBundlesDocument, GetProductsDocument } from "@/types/graphql";

export const dynamic = "force-dynamic";

export default async function BundleDetailPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	
	let allBundles: any[] = [];
	let relatedBooks: any[] = [];
	
	try {
		const [bundlesRes, productsRes] = await Promise.all([
			graphqlClient.request(GetBundlesDocument),
			graphqlClient.request(GetProductsDocument)
		]);
		allBundles = bundlesRes.bundles || [];
		
		// For related books, just pick some random/recent products
		// Assuming we just take the first 4 for demonstration, or we can filter them
		relatedBooks = (productsRes.products || []).slice(0, 4);
	} catch (e) {
		console.error("Failed to fetch bundle data", e);
	}

	const bundle = allBundles.find((b: any) => b.id === id || b.slug === id);

	if (!bundle) notFound();

	return (
		<>
			<BundleDetailView
				allBundles={allBundles}
				bundle={bundle}
				id={id}
				relatedBooks={relatedBooks}
			/>
		</>
	);
}
