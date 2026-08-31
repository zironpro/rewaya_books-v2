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
		// Dummy return since backend is removed
		return { results: [] };
	} catch {
		return { results: [] };
	}
}
