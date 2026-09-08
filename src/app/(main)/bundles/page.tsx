import { BundlesView } from "@/features/bundles/bundles-view";
import { graphqlClient } from "@/lib/graphql-client";
import { GetBundlesDocument } from "@/types/graphql";

export const revalidate = 60;

export default async function BundlesPage() {
	let bundles: any[] = [];
	try {
		const res = await graphqlClient.request(GetBundlesDocument);
		bundles = res.bundles || [];
	} catch (error) {
		console.error("Failed to fetch bundles:", error);
	}

	return <BundlesView bundles={bundles} />;
}
