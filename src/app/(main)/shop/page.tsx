import { ShopView } from "@/features/shop/shop-view";
import { graphqlClient } from "@/lib/graphql-client";
import { GetProductsDocument, GetCategoriesDocument } from "@/types/graphql";

export const dynamic = "force-dynamic";

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
	try {
		const [productsRes, categoriesRes] = await Promise.all([
			graphqlClient.request(GetProductsDocument),
			graphqlClient.request(GetCategoriesDocument),
		]);
		books = productsRes.products || [];
		categories = categoriesRes.categories || [];

		if (category) {
			const catLower = category.toLowerCase();
			const matchedCategory = categories.find(c => c.slug?.toLowerCase() === catLower || c.name?.toLowerCase() === catLower || c.id === category);
			
			if (matchedCategory) {
				const orderedProductIds = matchedCategory.products?.map((p: any) => p.id) || [];
				const productIdsInCategory = new Set(orderedProductIds);
				books = books.filter(b => productIdsInCategory.has(b.id));
				
				// Apply custom sort ONLY if no explicit sort is requested
				if (!sort && orderedProductIds.length > 0) {
					const orderMap = new Map(orderedProductIds.map((id: string, index: number) => [id, index]));
					books.sort((a, b) => {
						const indexA = orderMap.has(a.id) ? orderMap.get(a.id) : Infinity;
						const indexB = orderMap.has(b.id) ? orderMap.get(b.id) : Infinity;
						return indexA - indexB;
					});
				}
			} else {
				books = books.filter(
					(b) =>
						b.categorySlug?.toLowerCase() === catLower ||
						b.categoryId === category ||
						b.categoryName?.toLowerCase() === catLower
				);
			}
		}
		if (q) {
			const query = q.toLowerCase();
			books = books.filter(
				(b) =>
					b.title.toLowerCase().includes(query) ||
					(b.author && b.author.toLowerCase().includes(query))
			);
		}

		// Apply explicit sorting if provided
		if (sort) {
			switch (sort) {
				case "price-asc":
					books.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
					break;
				case "price-desc":
					books.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
					break;
				case "title-asc":
					books.sort((a, b) => a.title.localeCompare(b.title));
					break;
				case "title-desc":
					books.sort((a, b) => b.title.localeCompare(a.title));
					break;
			}
		}
	} catch (e) {
		console.error("Failed to fetch shop data", e);
	}

	const totalCount = books.length;
	// Pagination slice
	books = books.slice(_offset, _offset + itemsPerPage);

	return (
		<ShopView
			activeCategory={category}
			books={books}
			categories={categories}
			currentPage={currentPage}
			itemsPerPage={itemsPerPage}
			searchQuery={q}
			totalCount={totalCount}
		/>
	);
}
