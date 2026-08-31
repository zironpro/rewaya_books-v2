import type { BookProps } from "@/lib/store";

export type ProductDetailData = BookProps & {
	description: string;
	details: Array<{ label: string; value: string }>;
	/** Additional gallery images (main `image` is always shown first). */
	images?: string[];
};
