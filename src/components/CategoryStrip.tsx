import Image from "next/image";
import Link from "next/link";

import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";

interface CategoryStripProps {
	categories?: any[];
}

export function CategoryStrip({ categories = [] }: CategoryStripProps) {
	if (categories.length === 0) return null;

	const items = categories.map((cat) => ({
		name: cat.name,
		image: cat.image || cat.imageUrl || "/categories/islamic.png",
		href: cat.href || `/shop?category=${encodeURIComponent(cat.slug || cat.id)}`,
	}));

	return (
		<section className="container w-full py-9 md:py-16">
			<Carousel
				className="w-full"
				opts={{ align: "start", dragFree: true, loop: false }}
			>
				<CarouselContent className="-ml-6">
					{items.map((cat) => (
						<CarouselItem
							className="basis-[30%] pl-6 sm:basis-[45%] md:basis-1/3 lg:basis-1/7"
							key={cat.href}
						>
							<Link
								className="group flex flex-col items-center gap-4"
								href={cat.href}
							>
								<div className="relative mx-auto size-32 overflow-hidden rounded-sm border-2 border-stone-100 bg-stone-50 shadow-sm transition-all group-hover:border-primary/30 group-hover:shadow-xl md:size-48">
									<Image
										alt={cat.name}
										className="object-cover transition-transform duration-700 group-hover:scale-110"
										fill
										sizes="(max-width: 768px) 128px, 192px"
										src={cat.image}
										unoptimized={cat.image.startsWith("http")}
									/>
								</div>
								<span className="text-center font-semibold text-muted-foreground text-sm transition-colors group-hover:text-primary">
									{cat.name}
								</span>
							</Link>
						</CarouselItem>
					))}
				</CarouselContent>

				<CarouselPrevious />
				<CarouselNext />
			</Carousel>
		</section>
	);
}
