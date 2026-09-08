"use server";

const MIN_QUERY_LENGTH = 2;
const _SUGGESTION_LIMIT = 6;

export type SearchSuggestion = {
	id: string;
	slug?: string;
	title: string;
	author?: string;
	image: string;
	price: number;
};

export type SearchProductsResult = {
	results: SearchSuggestion[];
};

export async function searchProductsAction(
	query: string
): Promise<SearchProductsResult> {
	const trimmed = query.trim();
	if (trimmed.length < MIN_QUERY_LENGTH) {
		return { results: [] };
	}

	try {
		const { Product } = await import("@/lib/db/models/Product");
		await import("@/lib/db/mongodb").then((m) => m.default());

		const queryFilter = {
			$or: [{ isbn: trimmed }, { title: { $regex: trimmed, $options: "i" } }],
		};

		const products = await Product.find(queryFilter)
			.limit(_SUGGESTION_LIMIT)
			.lean();

		const results: SearchSuggestion[] = products.map((p: any) => ({
			id: p._id.toString(),
			slug: p.slug,
			title: p.title,
			author: p.author,
			image: p.coverImage || (p.images && p.images[0]) || "",
			price: p.price,
		}));

		return { results };
	} catch (e) {
		console.error("Search error:", e);
		return { results: [] };
	}
}
