import { GraphQLClient } from "graphql-request";

let endpoint = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || "/api/graphql";

if (endpoint.startsWith("/")) {
	if (typeof window !== "undefined") {
		endpoint = `${window.location.origin}${endpoint}`;
	} else {
		// Use NEXTAUTH_URL in production (Vercel), fallback to localhost in dev
		const baseUrl =
			process.env.NEXTAUTH_URL ||
			process.env.NEXT_PUBLIC_SITE_URL ||
			`http://localhost:${process.env.PORT || 3000}`;
		endpoint = `${baseUrl.replace(/\/$/, "")}${endpoint}`;
	}
}

export const graphqlClient = new GraphQLClient(endpoint, {
	fetch:
		typeof window === "undefined"
			? (url, options) => fetch(url, { ...options, cache: "no-store" })
			: fetch,
});

export function customFetcher<TData, TVariables extends Record<string, any>>(
	query: any,
	variables?: TVariables,
	options?: RequestInit["headers"]
) {
	return async (): Promise<TData> => {
		let url = endpoint;
		if (typeof window === "undefined" && url.startsWith("/")) {
			const baseUrl =
				process.env.NEXTAUTH_URL ||
				process.env.NEXT_PUBLIC_SITE_URL ||
				`http://localhost:${process.env.PORT || 3000}`;
			url = `${baseUrl.replace(/\/$/, "")}${url}`;
		}
		const client = new GraphQLClient(url, {
			fetch:
				typeof window === "undefined"
					? (url, options) =>
							fetch(url, { ...options, next: { revalidate: 60 } })
					: fetch,
		});
		// @ts-ignore
		return client.request<TData, TVariables>(query, variables, options);
	};
}
