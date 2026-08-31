import Image from "next/image";

import type { BundlePresentation } from "@/domain/bundle";

interface BookGallerySectionProps {
	bundle: BundlePresentation;
}

export function BookGallerySection({ bundle }: BookGallerySectionProps) {
	return (
		<section className="border-gold/30 border-y bg-card py-12 md:py-16">
			<div className="container">
				<h2 className="font-bold font-display text-2xl text-secondary tracking-tight sm:text-3xl md:text-5xl">
					Inside the bundle
				</h2>
				<p className="mt-2 max-w-2xl text-balance font-light text-lg text-muted-foreground">
					Five physical volumes mix of seerah, remembrance, reflection, and
					habits chosen to read well together.
				</p>

				<div className="mt-8 md:hidden">
					<div className="-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto overscroll-x-contain px-4 pb-2">
						{bundle.books.map((book) => (
							<div
								className="w-[42vw] shrink-0 snap-center sm:w-[200px]"
								key={book.id}
							>
								<div className="relative aspect-3/4 overflow-hidden rounded-sm shadow-md">
									<Image
										alt={book.title}
										className="object-cover"
										fill
										sizes="42vw"
										src={book.coverUrl}
									/>
								</div>
								<p className="mt-2 font-semibold text-secondary">
									{book.title}
								</p>
							</div>
						))}
					</div>
				</div>

				<div className="mt-8 hidden gap-6 md:grid md:grid-cols-5">
					{bundle.books.map((book) => (
						<div key={book.id}>
							<div className="relative aspect-4/5 overflow-hidden rounded-sm shadow-sm">
								<Image
									alt={book.title}
									className="object-cover"
									fill
									sizes="(max-width: 1200px) 18vw, 200px"
									src={book.coverUrl}
								/>
							</div>
							<p className="mt-2 font-semibold text-secondary leading-snug">
								{book.title}
							</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
