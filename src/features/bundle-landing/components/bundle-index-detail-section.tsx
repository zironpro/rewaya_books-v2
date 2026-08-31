"use client";

import { Badge } from "@/components/ui/badge";

import type { BundlePresentation } from "@/domain/bundle";
import { cn } from "@/lib/utils";

import { CompactBookTile } from "./ui/compact-book-tile";
import { StickyBundleCard } from "./ui/sticky-bundle-card";

interface BundleIndexDetailSectionProps {
	bundle: BundlePresentation;
	featuredSlug: string;
	index: number;
}

export function BundleIndexDetailSection({
	bundle,
	featuredSlug,
	index,
}: BundleIndexDetailSectionProps) {
	const sectionNum = String(index + 1).padStart(2, "0");

	return (
		<section
			className="scroll-mt-24 border-t py-8 md:py-10"
			id={`bundle-${bundle.slug}`}
		>
			<div className="container flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
				<div className="min-w-0 flex-1 lg:py-1">
					<div className="mb-4">
						<p className="font-medium text-[0.65rem] text-primary uppercase tracking-[0.2em]">
							Set {sectionNum}
						</p>
						<div className="flex items-center gap-2">
							<h3 className="mt-1 font-bold font-display text-2xl text-secondary">
								What&apos;s inside
							</h3>
							<Badge
								className="hidden sm:inline-flex"
								size="sm"
								variant="secondary"
							>
								{bundle.books.length} books
							</Badge>
						</div>
					</div>

					<ul
						className={cn(
							"scrollbar-thin -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth px-4 pb-1",
							"lg:mx-0 lg:flex-col lg:gap-2 lg:overflow-visible lg:px-0 lg:pb-0"
						)}
					>
						{bundle.books.map((book, bookIndex) => (
							<CompactBookTile book={book} index={bookIndex} key={book.id} />
						))}
					</ul>
				</div>

				<StickyBundleCard bundle={bundle} featuredSlug={featuredSlug} />
			</div>
		</section>
	);
}
