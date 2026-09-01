import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProductDetailView } from "@/features/products/product-detail-view";
import { graphqlClient } from "@/lib/graphql-client";
import { GetProductBySlugDocument } from "@/types/graphql";

export async function generateStaticParams() {
	return [];
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ id: string }>;
}): Promise<Metadata> {
	const { id } = await params;
	let detail: any = null;
	try {
		const res = await graphqlClient.request(GetProductBySlugDocument, {
			slug: id,
		});
		detail = res.productBySlug;
	} catch (e) {
		console.error("Failed to fetch product", e);
	}

	if (!detail) {
		return {
			title: "Product Not Found · Rewaya Book world",
		};
	}

	const title = detail.author
		? `${detail.title} by ${detail.author} · Rewaya Book world`
		: `${detail.title} · Rewaya Book world`;

	const description = detail.description
		? detail.description
				.replace(/<[^>]*>/g, "")
				.trim()
				.substring(0, 160)
		: `Buy ${detail.title} online at Rewaya Book World.`;

	return {
		title,
		description,
		openGraph: {
			title,
			description,
			type: "website",
			images: detail.coverImage ? [{ url: detail.coverImage }] : [],
		},
		twitter: {
			card: "summary_large_image",
			title,
			description,
			images: detail.coverImage ? [detail.coverImage] : [],
		},
	};
}

export default async function ProductDetailPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;

	let detail: any = null;
	try {
		const res = await graphqlClient.request(GetProductBySlugDocument, {
			slug: id,
		});
		detail = res.productBySlug;
	} catch (e) {
		console.error("Failed to fetch product", e);
	}

	if (!detail) {
		notFound();
	}

	const formattedDetail = {
		...detail,
		image: detail.coverImage,
		category: detail.categoryName,
		productId: detail.id,
		availableForSale: detail.stock > 0,
		stock: detail.stock,
		details: [
			detail.author && { label: "Author", value: detail.author },
			detail.format && { label: "Format", value: detail.format },
			detail.pages && { label: "Pages", value: detail.pages.toString() },
			detail.language && { label: "Language", value: detail.language },
			detail.publisher && { label: "Publisher", value: detail.publisher },
			detail.isbn && { label: "ISBN", value: detail.isbn },
		].filter(Boolean),
	};

	const bookSections = {
		relatedReads: [],
		sameCategory: [],
	};

	return (
		<ProductDetailView
			product={formattedDetail}
			relatedReads={bookSections.relatedReads}
			sameCategoryBooks={bookSections.sameCategory}
		/>
	);
}
