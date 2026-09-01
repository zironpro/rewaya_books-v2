import { HomepageView } from "@/features/home/homepage-view";
import { graphqlClient } from "@/lib/graphql-client";
import {
	GetBundlesDocument,
	GetCategoriesDocument,
	GetProductsDocument,
	GetHeroBannersDocument,
} from "@/types/graphql";

export const dynamic = "force-dynamic";

export default async function Home() {
	let products: any[] = [];
	let bundles: any[] = [];
	let categories: any[] = [];
	let banners: any[] = [];

	try {
		const [productsRes, bundlesRes, categoriesRes, bannersRes] = await Promise.all([
			graphqlClient.request(GetProductsDocument),
			graphqlClient.request(GetBundlesDocument),
			graphqlClient.request(GetCategoriesDocument),
			graphqlClient.request(GetHeroBannersDocument),
		]);
		products = productsRes.products || [];
		bundles = bundlesRes.bundles || [];
		categories = categoriesRes.categories || [];
		banners = (bannersRes.heroBanners || []).filter((b: any) => b.enabled !== false).sort((a: any, b: any) => (a.sortOrder || 0) - (b.sortOrder || 0));
	} catch (e) {
		console.error("Failed to fetch homepage data", e);
	}

	const sections = [
		{
			sectionKey: "new-arrivals",
			title: "Top Picks",
			subtitle: "Our best selection",
			href: "/shop",
			books: products.slice(0, 8),
		},
	];

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
