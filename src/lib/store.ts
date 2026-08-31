// Generic ProductVariant type since we removed the original backend
export type ProductVariant = any;

export interface BookProps {
	id: string;
	/** Product ID for headless cart */
	productId?: string;
	/** URL slug from catalog */
	slug?: string;
	title: string;
	author?: string;
	price: number;
	image: string;
	category: string;
	/** Collection/category GUID */
	categoryId?: string;
	/** Collection/category slug */
	categorySlug?: string;
	badge?: "new seller" | "new arrival" | "best seller";
	variants?: ProductVariant[];
	defaultVariant?: ProductVariant;
	availableForSale?: boolean;
}

/** Stable, unique React list key — avoids collisions between productId and numeric id. */
export function getBookReactKey(book: BookProps, index?: number): string {
	if (book.productId) return book.productId;
	if (book.slug) return `slug:${book.slug}`;
	if (index !== undefined) return `book:${book.id}:${index}`;
	return `book-${index}:${book.id}`;
}
