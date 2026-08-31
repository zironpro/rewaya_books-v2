import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";

import { CountdownTimer } from "@/features/products/components/timer";
import { BookProps } from "@/lib/store";

import { BookCard } from "./book-card";

const navButtonClass =
	"static   bg-card translate-x-0 translate-y-0 hover:border-primary hover:bg-mauve-100 hover:text-primary disabled:opacity-40";

interface ProductStripProps {
	title: string;
	subtitle?: string;
	books: BookProps[];
	href?: string;
}

export function ProductStrip({
	title,
	subtitle,
	books,
	href,
}: ProductStripProps) {
	return (
		<section className="group/strip container mx-auto pb-16">
			<Carousel
				className="w-full"
				opts={{ align: "start", dragFree: true, loop: false }}
			>
				<div className="mb-10 flex items-end justify-between gap-6">
					<div>
						{subtitle && (
							<Badge className="mb-1" variant="secondary">
								{subtitle}
							</Badge>
						)}
						<div className="flex flex-wrap items-center gap-4 md:gap-6">
							<h2 className="whitespace-nowrap font-bold font-serif text-2xl md:text-4xl">
								{title.split(" ").map((word, i) => (
									<span
										className={i % 2 !== 0 ? "font-normal italic" : ""}
										key={Number(i + 1)}
									>
										{word}{" "}
									</span>
								))}
							</h2>
							{title === "Today's Deals" && <CountdownTimer />}
						</div>
					</div>
					<div className="flex gap-2">
						<CarouselPrevious className={navButtonClass} />
						<CarouselNext className={navButtonClass} />
					</div>
				</div>

				<CarouselContent className="-ml-6 pb-8">
					{books.map((book, i) => (
						<CarouselItem
							className="basis-[240px] pl-6 md:basis-[280px]"
							key={`${book.id}-${Number(i + 1)}`}
						>
							<BookCard {...book} />
						</CarouselItem>
					))}
					<CarouselItem className="flex basis-[240px] pl-6 md:basis-[280px]">
						{href ? (
							<Link
								className="group flex h-full min-h-0 w-full cursor-pointer items-center justify-center border-2 border-stone-100 border-dashed transition-colors hover:border-primary/30"
								href={href}
							>
								<div className="text-center">
									<span className="font-bold text-sm text-stone-300 transition-colors group-hover:text-primary">
										View All <br /> Collection
									</span>
								</div>
							</Link>
						) : (
							<div className="group flex h-full min-h-0 w-full cursor-pointer items-center justify-center border-2 border-stone-100 border-dashed transition-colors hover:border-primary/30">
								<div className="text-center">
									<span className="font-bold text-sm text-stone-300 transition-colors group-hover:text-primary">
										View All <br /> Collection
									</span>
								</div>
							</div>
						)}
					</CarouselItem>
				</CarouselContent>
			</Carousel>
		</section>
	);
}
