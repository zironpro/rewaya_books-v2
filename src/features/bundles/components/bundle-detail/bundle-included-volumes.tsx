"use client";

import Image from "next/image";

import WheelGestures from "embla-carousel-wheel-gestures";
import { User as UserIcon } from "lucide-react";

import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";

import type { Book } from "@/domain/catalog";

import { BundleSectionHeading } from "./bundle-section-heading";

interface BundleIncludedVolumesProps {
	books: Book[];
}

export function BundleIncludedVolumes({ books }: BundleIncludedVolumesProps) {
	return (
		<section className="my-20">
			<div className="mb-6 flex items-end justify-between">
				<BundleSectionHeading
					eyebrow="The collection archive"
					highlight="volumes"
					title="Included"
				/>
			</div>

			<Carousel
				className="w-full"
				opts={{ align: "start", loop: false }}
				plugins={[WheelGestures()]}
			>
				<CarouselContent className="-ml-6 px-2">
					{books.map((book) => (
						<CarouselItem
							className="-my-4 basis-full py-6 pl-6 sm:basis-1/2 lg:basis-1/2"
							key={book.id}
						>
							<div className="group relative flex h-full flex-col items-start gap-8 rounded-lg border bg-card p-4 transition-all hover:scale-102 hover:border-primary hover:shadow-sm md:flex-row">
								<div className="relative aspect-4/5 w-full shrink-0 transform overflow-hidden rounded-md bg-white transition-transform group-hover:scale-105 sm:w-48 md:w-56">
									<Image
										alt={book.title}
										className="object-cover"
										fill
										sizes="(max-width: 768px) 100vw, 176px"
										src={book.coverImage || "/placeholder.png"}
									/>
								</div>

								<div className="flex h-full grow flex-col py-3">
									<div>
										<h4 className="mb-1 font-bold text-2xl text-secondary leading-tight tracking-tight transition-colors group-hover:text-primary">
											{book.title}
										</h4>
										{book.author && (
											<div className="flex items-center gap-2 font-medium text-primary text-sm">
												<UserIcon size={14} />
												<span>{book.author}</span>
											</div>
										)}
										<p className="mt-3 line-clamp-2 text-muted-foreground text-sm tracking-tight">
											{book.description || ""}
										</p>
									</div>

									<div className="mt-auto grid grid-cols-2 gap-3">
										<BookMeta label="ISBN" value={book.isbn} />
										<BookMeta label="Publisher" value={book.publisher} />
										{book.author && (
											<BookMeta label="Author" value={book.author} />
										)}
										{book.language && (
											<BookMeta label="Language" value={book.language} />
										)}
									</div>
								</div>
							</div>
						</CarouselItem>
					))}
				</CarouselContent>

				{/* Mobile: static controls below slides */}
				<div className="mt-4 flex items-center justify-center gap-3 md:hidden">
					<CarouselPrevious className="static top-auto left-auto size-10 translate-x-0 translate-y-0" />
					<CarouselNext className="static top-auto right-auto size-10 translate-x-0 translate-y-0" />
				</div>

				{/* Desktop: absolute side controls */}
				<CarouselPrevious className="hidden md:inline-flex" />
				<CarouselNext className="hidden md:inline-flex" />
			</Carousel>
		</section>
	);
}

function BookMeta({ label, value }: { label: string; value: string }) {
	return (
		<div className="flex flex-col">
			<span className="mb-1 text-muted-foreground/80 text-xs">{label}</span>
			<span className="font-medium text-secondary text-xs">{value}</span>
		</div>
	);
}
