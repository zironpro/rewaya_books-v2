import type { Review } from "@/lib/bundle-reviews-data";
import { getBundleReviews } from "@/lib/bundle-reviews-data";
import type { Bundle } from "@/lib/catalog/types";

export type { Review };

export interface BundleBookItem {
	id: string;
	title: string;
	author: string;
	coverUrl: string;
	description: string;
}

export interface BundlePresentationFaq {
	id: string;
	question: string;
	answer: string;
}

/** Marketing / campaign view-model for bundle landing pages. */
export interface BundlePresentation {
	slug: string;
	name: string;
	tagline: string;
	description: string;
	longDescription: string;
	price: number;
	originalPrice: number;
	savingsAmount: number;
	books: BundleBookItem[];
	reviews: Review[];
	faqs: BundlePresentationFaq[];
	bundleProductId: string;
	checkoutCatalogItemId: string;
	checkoutCatalogAppId: string;
	storeProductIds: string[];
	coverImage: string;
}

export function bundleToPresentation(bundle: Bundle): BundlePresentation {
	return {
		slug: bundle.id,
		name: bundle.title,
		tagline: bundle.tagline,
		description: bundle.description,
		longDescription: bundle.longDescription,
		price: bundle.price,
		originalPrice: bundle.originalPrice,
		savingsAmount: bundle.originalPrice - bundle.price,
		bundleProductId: bundle.bundleProductId,
		checkoutCatalogItemId: bundle.checkoutCatalogItemId,
		checkoutCatalogAppId: bundle.checkoutCatalogAppId,
		storeProductIds: bundle.storeProductIds,
		coverImage: bundle.coverImage,
		books: bundle.books.map((book) => ({
			id: book.id,
			title: book.title,
			author: book.author ?? book.publisher,
			coverUrl: book.image,
			description: book.overview,
		})),
		reviews: getBundleReviews(bundle.id),
		faqs: bundle.faqs,
	};
}
