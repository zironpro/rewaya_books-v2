import { ShopView } from "@/features/shop/shop-view";
import { graphqlClient } from "@/lib/graphql-client";
import {
	GetCategoriesDocument,
	GetProductsPaginatedDocument,
} from "@/types/graphql";

export const revalidate = 60;

interface ShopPageProps {
	searchParams: Promise<{
		q?: string;
		category?: string;
		page?: string;
		limit?: string;
		minPrice?: string;
		maxPrice?: string;
	}>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
	const {
		q,
		category,
		page,
		limit,
		sort,
		minPrice: _minPrice,
		maxPrice: _maxPrice,
	} = await searchParams;

	const currentPage = Math.max(1, Number.parseInt(page ?? "1", 10) || 1);
	const itemsPerPage = Math.max(1, Number.parseInt(limit ?? "25", 10) || 25);
	const _offset = (currentPage - 1) * itemsPerPage;

	let books: any[] = [];
	let categories: any[] = [];
	let totalCount = 0;
	let totalPages = 0;
	let categoryIdToSearch = category;
	let customOrderIds: string[] = [];
	try {
		const [categoriesRes] = await Promise.all([
			graphqlClient.request(GetCategoriesDocument),
		]);
		categories = categoriesRes.categories || [];

		let matchedCategory = null;

		if (category) {
			const catLower = category.toLowerCase();
			matchedCategory = categories.find(
				(c) =>
					c.slug?.toLowerCase() === catLower ||
					c.name?.toLowerCase() === catLower ||
					c.id === category
			);

			if (matchedCategory) {
				categoryIdToSearch = matchedCategory.id;
				customOrderIds = matchedCategory.products?.map((p: any) => p.id) || [];
			}
		}

		const productsRes = await graphqlClient.request(
			GetProductsPaginatedDocument,
			{
				category: categoryIdToSearch || undefined,
				q: q || undefined,
				sort: sort || undefined,
				page: currentPage,
				limit: itemsPerPage,
				customOrderIds:
					!sort && customOrderIds.length > 0 ? customOrderIds : undefined,
				inStockOnly: true,
			}
		);

		books = productsRes.productsPaginated?.items || [];
		totalCount = productsRes.productsPaginated?.totalCount || 0;
		totalPages = productsRes.productsPaginated?.totalPages || 0;
	} catch (e) {
		console.error("Failed to fetch shop data", e);
	}

	return (
		<ShopView
			activeCategory={category}
			books={books}
			categories={categories}
			categoryIdToSearch={categoryIdToSearch}
			currentPage={currentPage}
			customOrderIds={
				!sort && customOrderIds.length > 0 ? customOrderIds : undefined
			}
			searchQuery={q}
			totalCount={totalCount}
			totalPages={totalPages}
		/>
	);
}
