import { HomepageView } from "@/features/home/homepage-view";
import { graphqlClient } from "@/lib/graphql-client";
import {
	GetBundlesDocument,
	GetCategoriesDocument,
	GetProductsDocument,
} from "@/types/graphql";

export const dynamic = "force-dynamic";

export default async function Home() {
	let products: any[] = [];
	let bundles: any[] = [];
	let categories: any[] = [];

	try {
		const [productsRes, bundlesRes, categoriesRes] = await Promise.all([
			graphqlClient.request(GetProductsDocument),
			graphqlClient.request(GetBundlesDocument),
			graphqlClient.request(GetCategoriesDocument),
		]);
		products = productsRes.products || [];
		bundles = bundlesRes.bundles || [];
		categories = categoriesRes.categories || [];
	} catch (e) {
		console.error("Failed to fetch homepage data", e);
	}

	const sections = [
		{
			sectionKey: "new-arrivals",
			title: "New Arrivals",
			subtitle: "Fresh off the press",
			href: "/shop",
			books: products.slice(0, 8),
		},
	];
	const banners: any[] = [];

	// Filter and sort active categories
	const activeCategories = categories
		.filter((cat: any) => cat.status !== "Hidden" && cat.status !== "Draft")
		.sort((a: any, b: any) => (a.sort || 0) - (b.sort || 0));

	return (
		<HomepageView
			banners={banners}
			bundles={bundles}
			categories={activeCategories}
			sections={sections}
		/>
	);
}
