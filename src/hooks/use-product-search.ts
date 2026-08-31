"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
	type SearchSuggestion,
	searchProductsAction,
} from "@/features/search/search-actions";

export function useProductSearch(debounceMs = 300) {
	const [query, setQuery] = useState("");
	const [results, setResults] = useState<SearchSuggestion[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const search = useCallback(async (q: string) => {
		const trimmed = q.trim();
		if (!trimmed) {
			setResults([]);
			return;
		}
		setIsLoading(true);
		try {
			const { results: hits } = await searchProductsAction(trimmed);
			setResults(hits);
		} catch {
			setResults([]);
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		if (debounceRef.current) clearTimeout(debounceRef.current);
		debounceRef.current = setTimeout(() => {
			search(query);
		}, debounceMs);
		return () => {
			if (debounceRef.current) clearTimeout(debounceRef.current);
		};
	}, [query, debounceMs, search]);

	return { query, setQuery, results, isLoading };
}
