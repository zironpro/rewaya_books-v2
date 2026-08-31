import Link from "next/link";

import { BundleSectionHeading } from "@/features/bundles/components/bundle-detail/bundle-section-heading";
import { BookCard } from "@/features/products/components/book-card";
import type { BookProps } from "@/lib/store";
import { getBookReactKey } from "@/lib/store";

type ProductBooksSectionVariant = "same-category" | "related-reads";

const SECTION_HEADINGS: Record<
	ProductBooksSectionVariant,
	{ eyebrow: string; title: string; highlight: string }
> = {
	"same-category": {
		eyebrow: "Same category",
		title: "More",
		highlight: "books",
	},
	"related-reads": {
		eyebrow: "You might also like",
		title: "Related",
		highlight: "reads",
	},
};

interface ProductRelatedBooksProps {
	books: BookProps[];
	variant: ProductBooksSectionVariant;
	category?: string;
	categorySlug?: string;
}

export function ProductRelatedBooks({
	books,
	variant,
	category,
	categorySlug,
}: ProductRelatedBooksProps) {
	if (books.length === 0) return null;

	const isSameCategory = variant === "same-category";
	const shopHref =
		isSameCategory && categorySlug
			? `/shop?category=${encodeURIComponent(categorySlug)}`
			: "/shop";

	const heading = SECTION_HEADINGS[variant];

	return (
		<section className="mt-12">
			<div className="mb-12 flex flex-wrap items-end justify-between gap-4">
				<BundleSectionHeading
					eyebrow={heading.eyebrow}
					highlight={isSameCategory && category ? category : heading.highlight}
					title={heading.title}
				/>
				<Link
					className="font-medium text-primary text-sm underline-offset-4 hover:underline"
					href={shopHref}
				>
					{isSameCategory && category
						? `View all in ${category}`
						: "View all books"}
				</Link>
			</div>

			<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
				{books.map((book, index) => (
					<BookCard key={getBookReactKey(book, index)} {...book} />
				))}
			</div>
		</section>
	);
}
