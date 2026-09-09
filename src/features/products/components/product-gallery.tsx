"use client";

import { useCallback, useEffect, useState } from "react";

import Image from "next/image";

import {
	Carousel,
	type CarouselApi,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";

import { WishlistToggleButton } from "@/features/wishlist/components/wishlist-toggle-button";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
	title: string;
	image: string;
	images?: string[];
	productId?: string;
	className?: string;
}

export function ProductGallery({
	title,
	image,
	images,
	productId,
	className,
}: ProductGalleryProps) {
	const galleryImages =
		images?.length && images.length > 0
			? [...new Set([image, ...images])].filter(Boolean)
			: [image].filter(Boolean);

	const finalImages =
		galleryImages.length > 0
			? (galleryImages as string[])
			: [];
	const hasMultiple = finalImages.length > 1;
	const [api, setApi] = useState<CarouselApi>();
	const [selectedIndex, setSelectedIndex] = useState(0);

	const onSelect = useCallback(() => {
		if (!api) return;
		setSelectedIndex(api.selectedScrollSnap());
	}, [api]);

	useEffect(() => {
		if (!api) return;
		onSelect();
		api.on("select", onSelect);
		return () => {
			api.off("select", onSelect);
		};
	}, [api, onSelect]);

	if (!hasMultiple) {
		return (
			<div className={cn("space-y-3", className)}>
				<div className="group relative aspect-4/5 overflow-hidden rounded-xl border bg-card flex items-center justify-center bg-muted/10">
					{finalImages[0] ? (
						<Image
							alt={title}
							className="object-contain transition-transform duration-700 group-hover:scale-[1.02]"
							fill
							priority
							sizes="(max-width: 1024px) 100vw, 38vw"
							src={finalImages[0]}
						/>
					) : (
						<span className="text-muted-foreground/50 text-sm font-medium">No Image</span>
					)}
					<WishlistToggleButton
						className="absolute top-4 right-4 z-10 size-11 rounded-full border bg-background/90 shadow-sm backdrop-blur-sm hover:bg-background"
						productId={productId?.toString()}
						size="md"
					/>
				</div>
			</div>
		);
	}

	return (
		<div className={cn("space-y-3", className)}>
			<Carousel
				className="w-full"
				opts={{ align: "start", loop: hasMultiple }}
				setApi={setApi}
			>
				<div className="relative">
					<CarouselContent className="-ml-2">
						{finalImages.map((src, index) => (
							<CarouselItem className="basis-full pl-2" key={src}>
								<div className="group relative aspect-4/5 overflow-hidden rounded-xl border bg-card">
									<Image
										alt={`${title} — image ${index + 1}`}
										className="object-contain transition-transform duration-700 group-hover:scale-[1.02]"
										fill
										priority={index === 0}
										sizes="(max-width: 1024px) 100vw, 38vw"
										src={src}
									/>
								</div>
							</CarouselItem>
						))}
					</CarouselContent>

					<WishlistToggleButton
						className="absolute top-4 right-4 z-10 size-11 rounded-full border border-border/60 bg-background/90 shadow-sm backdrop-blur-sm hover:bg-background"
						productId={productId?.toString()}
						size="md"
					/>

					<CarouselPrevious
						className="top-1/2 left-3 size-9 -translate-y-1/2 border-border/80 bg-background/90 shadow-sm backdrop-blur-sm hover:bg-background"
						variant="outline"
					/>
					<CarouselNext
						className="top-1/2 right-3 size-9 -translate-y-1/2 border-border/80 bg-background/90 shadow-sm backdrop-blur-sm hover:bg-background"
						variant="outline"
					/>
				</div>

				<div
					aria-label="Product image thumbnails"
					className="mt-3 flex gap-2 overflow-x-auto pb-1"
					role="tablist"
				>
					{finalImages.map((src, index) => (
						<button
							aria-label={`View image ${index + 1}`}
							aria-selected={selectedIndex === index}
							className={cn(
								"relative aspect-3/4 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-colors",
								selectedIndex === index
									? "border-primary ring-2 ring-primary/20"
									: "border-border hover:border-primary/40"
							)}
							key={`thumb-${src}`}
							onClick={() => api?.scrollTo(index)}
							role="tab"
							type="button"
						>
							<Image
								alt=""
								className="object-cover"
								fill
								sizes="64px"
								src={src}
							/>
						</button>
					))}
				</div>
			</Carousel>
		</div>
	);
}
