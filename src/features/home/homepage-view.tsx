import Image from "next/image";
import Link from "next/link";

import { BundleSection } from "@/components/BundleSection";
import { CategoryStrip } from "@/components/CategoryStrip";
import { PolicyCards } from "@/components/PolicyCards";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { HeroCarousel } from "@/features/home/components/hero-carousel";
import { ProductStrip } from "@/features/products/components/product-strip";
import type { Bundle } from "@/lib/catalog/types";

interface HomepageViewProps {
	sections: any[];
	banners: any[];
	bundles: Bundle[];
	categories?: any[];
}

function EmptyStrip({ title }: { title: string }) {
	return (
		<section className="container py-8">
			<h2 className="font-serif text-2xl text-secondary">{title}</h2>
			<p className="mt-2 text-muted-foreground text-sm">
				No products in this section yet. Add items to the matching category in
				the database.
			</p>
		</section>
	);
}

export const HomepageView = ({
	sections,
	banners,
	bundles,
	categories = [],
}: HomepageViewProps) => {
	const childrenSection = sections.find((s) => s.sectionKey === "children");
	const childrenCategorySlug = "children";

	return (
		<main className="overflow-hidden">
			<HeroCarousel banners={banners} />
			<CategoryStrip categories={categories} />

			{sections
				.filter((s) => s.sectionKey !== "children")
				.map((section) =>
					section.books.length > 0 ? (
						<ProductStrip
							books={section.books}
							href={section.href}
							key={section.sectionKey}
							subtitle={section.subtitle}
							title={section.title}
						/>
					) : (
						<EmptyStrip key={section.sectionKey} title={section.title} />
					)
				)}

			<section className="container mb-16">
				<div className="group relative overflow-hidden rounded-2xl shadow-lg md:min-h-90">
					<Image
						alt="Rewaya Books at the Dubai Book Fair"
						className="object-cover object-left transition-transform duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-102 md:object-center"
						fill
						sizes="(max-width: 1280px) 100vw, 1280px"
						src="/banners/book-fair-banner.webp"
					/>
					<div className="relative z-10 flex flex-col items-start justify-center p-6 text-card sm:p-10 md:min-h-90 md:max-w-2xl md:p-12">
						<Badge
							className="border-card/20 bg-card/10 text-card tracking-normal backdrop-blur-sm"
							size="lg"
							variant="outline"
						>
							Event recap
						</Badge>
						<h3 className="mt-2 font-bold font-display text-2xl leading-tight sm:text-3xl md:mt-3 md:text-5xl">
							Rewaya at the <span className="italic">Book Fair</span>
						</h3>
						<p className="mt-4 font-light text-card/90 text-xs sm:text-base">
							Thank you to everyone who visited our stand. We loved meeting
							readers, signing books, and sharing stories from across the
							Islamic world.
						</p>
						{/* <p className="mt-3 flex items-center gap-1.5 text-card/75 text-sm">
							<MapPin aria-hidden className="size-4 shrink-0" />
							Dubai, United Arab Emirates
						</p> */}
						<Button asChild className="mt-4 md:mt-8" size="lg">
							<Link href="/shop">Browse the collection</Link>
						</Button>
					</div>
				</div>
			</section>

			<BundleSection bundles={bundles} />

			<section className="container mb-12 pb-16">
				<div className="group relative overflow-hidden rounded-2xl shadow-lg">
					<Image
						alt="Children's Books"
						className="object-cover transition-transform duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105"
						fill
						sizes="(max-width: 1280px) 100vw, 1280px"
						src="/banners/kids-banner.webp"
					/>
					<div className="relative z-10 flex flex-col items-center justify-center p-6 sm:p-10 md:p-16 lg:p-20">
						<Badge
							className="bg-secondary px-2 text-secondary-foreground tracking-normal"
							size="lg"
						>
							Special Release
						</Badge>
						<h3 className="mt-2 mb-8 max-w-xl text-center font-bold font-display text-4xl text-secondary leading-tight md:text-5xl">
							Nurturing the
							<span className="text-accent italic">Next Generation</span> of
							Seekers.
						</h3>
						<Button asChild size="lg">
							<Link
								href={`/shop?category=${encodeURIComponent(childrenCategorySlug)}`}
							>
								Shop Children&apos;s books
							</Link>
						</Button>
					</div>
				</div>
			</section>

			{childrenSection &&
				(childrenSection.books.length > 0 ? (
					<ProductStrip
						books={childrenSection.books}
						href={childrenSection.href}
						subtitle={childrenSection.subtitle}
						title={childrenSection.title}
					/>
				) : (
					<EmptyStrip title={childrenSection.title} />
				))}

			<PolicyCards />
		</main>
	);
};
