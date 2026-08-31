import { BookCard } from "@/features/products/components/book-card";
import type { BookProps } from "@/lib/store";

import { BundleSectionHeading } from "./bundle-section-heading";

interface BundleRelatedBooksProps {
	books: BookProps[];
}

export function BundleRelatedBooks({ books }: BundleRelatedBooksProps) {
	if (books.length === 0) return null;

	return (
		<section className="mt-12">
			<div className="mb-12 flex items-end justify-between">
				<BundleSectionHeading
					eyebrow="You might also like"
					highlight="reads"
					title="More"
				/>
			</div>

			<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
				{books.map((book) => (
					<BookCard key={book.id} {...book} />
				))}
			</div>
		</section>
	);
}
