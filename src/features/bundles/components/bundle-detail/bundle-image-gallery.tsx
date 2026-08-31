"use client";

import * as React from "react";

import Image from "next/image";

import Autoplay from "embla-carousel-autoplay";

import {
	Carousel,
	type CarouselApi,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";

import type { Bundle } from "@/domain/catalog";
import { cn } from "@/lib/utils";

interface BundleImageGalleryProps {
	bundle: Bundle;
}

const thumbCarouselOpts = {
	containScroll: "keepSnaps" as const,
	dragFree: true,
	align: "start" as const,
};

const AUTOPLAY_DELAY_MS = 5000;

const mainCarouselOpts = {
	loop: true,
};

function usePrefersReducedMotion() {
	return React.useSyncExternalStore(
		(onStoreChange) => {
			const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
			mq.addEventListener("change", onStoreChange);
			return () => mq.removeEventListener("change", onStoreChange);
		},
		() => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
		() => false
	);
}

function useGallerySync(
	mainApi: CarouselApi | undefined,
	thumbApis: (CarouselApi | undefined)[]
) {
	const [selectedIndex, setSelectedIndex] = React.useState(0);

	const onSelect = React.useCallback(() => {
		if (!mainApi) return;
		const index = mainApi.selectedScrollSnap();
		setSelectedIndex(index);
		for (const thumbApi of thumbApis) {
			thumbApi?.scrollTo(index);
		}
	}, [mainApi, thumbApis]);

	React.useEffect(() => {
		if (!mainApi) return;
		onSelect();
		mainApi.on("reInit", onSelect);
		mainApi.on("select", onSelect);

		return () => {
			mainApi.off("reInit", onSelect);
			mainApi.off("select", onSelect);
		};
	}, [mainApi, onSelect]);

	const onThumbClick = React.useCallback(
		(index: number) => {
			if (!mainApi) return;
			mainApi.scrollTo(index);
		},
		[mainApi]
	);

	return { selectedIndex, onThumbClick };
}

interface ThumbnailCarouselProps {
	images: { src: string; alt: string }[];
	orientation: "horizontal" | "vertical";
	selectedIndex: number;
	onThumbClick: (index: number) => void;
	setApi: (api: CarouselApi) => void;
	className?: string;
}

function ThumbnailCarousel({
	images,
	orientation,
	selectedIndex,
	onThumbClick,
	setApi,
	className,
}: ThumbnailCarouselProps) {
	const isVertical = orientation === "vertical";

	return (
		<Carousel
			className={cn(
				"w-full",
				isVertical && "h-full **:data-[slot=carousel-content]:h-full",
				className
			)}
			opts={thumbCarouselOpts}
			orientation={orientation}
			setApi={setApi}
		>
			<CarouselContent className={cn(isVertical ? "-mt-1 flex-col" : "-ml-1")}>
				{images.map((image, index) => (
					<CarouselItem
						className={cn("basis-auto", isVertical ? "pt-1" : "pl-1")}
						key={`${image.src}-${image.alt}`}
					>
						<button
							aria-current={selectedIndex === index ? "true" : undefined}
							aria-label={`View image ${index + 1} of ${images.length}`}
							className={cn(
								"relative overflow-hidden rounded-lg border-2 transition-all",
								isVertical ? "size-14" : "size-12",
								selectedIndex === index
									? "border-primary"
									: "border-stone-100 hover:border-primary/40"
							)}
							onClick={() => onThumbClick(index)}
							type="button"
						>
							<Image
								alt={image.alt}
								className="object-cover"
								fill
								sizes={isVertical ? "56px" : "48px"}
								src={image.src}
							/>
						</button>
					</CarouselItem>
				))}
			</CarouselContent>
		</Carousel>
	);
}

export function BundleImageGallery({ bundle }: BundleImageGalleryProps) {
	const prefersReducedMotion = usePrefersReducedMotion();
	const autoplayPlugin = React.useRef(
		Autoplay({
			delay: AUTOPLAY_DELAY_MS,
			playOnInit: false,
			stopOnInteraction: true,
			stopOnMouseEnter: true,
		})
	);

	const [mainApi, setMainApi] = React.useState<CarouselApi>();
	const [mobileThumbsApi, setMobileThumbsApi] = React.useState<CarouselApi>();
	const [desktopThumbsApi, setDesktopThumbsApi] = React.useState<CarouselApi>();

	const galleryImages = React.useMemo(
		() => {
			const images = [];
			if (bundle.coverImage) {
				images.push({ src: bundle.coverImage, alt: bundle.title });
			}
			
			(bundle.books || []).forEach((book: any) => {
				const img = book.coverImage || book.image;
				if (img) {
					images.push({ src: img, alt: book.title });
				}
			});
			
			return images;
		},
		[bundle.books, bundle.coverImage, bundle.title]
	);

	const thumbApis = React.useMemo(
		() => [mobileThumbsApi, desktopThumbsApi],
		[mobileThumbsApi, desktopThumbsApi]
	);

	const { selectedIndex, onThumbClick: scrollToSlide } = useGallerySync(
		mainApi,
		thumbApis
	);

	React.useEffect(() => {
		if (!mainApi) return;
		const autoplay = mainApi.plugins()?.autoplay;
		if (!autoplay) return;

		if (prefersReducedMotion) {
			autoplay.stop();
		} else {
			autoplay.play();
		}
	}, [mainApi, prefersReducedMotion]);

	const onThumbClick = React.useCallback(
		(index: number) => {
			scrollToSlide(index);
			mainApi?.plugins()?.autoplay?.reset();
		},
		[scrollToSlide, mainApi]
	);

	const navButtonClass =
		"top-1/2 size-9 -translate-y-1/2 border-0 bg-white/90 shadow-md backdrop-blur-sm hover:bg-white disabled:opacity-40";

	return (
		<div className="lg:sticky lg:top-28">
			{/* Mobile: horizontal thumbnail strip (Embla) */}
			<div className="mb-3 md:hidden">
				<ThumbnailCarousel
					images={galleryImages}
					onThumbClick={onThumbClick}
					orientation="horizontal"
					selectedIndex={selectedIndex}
					setApi={setMobileThumbsApi}
				/>
			</div>

			<div className="grid gap-4 md:grid-cols-[3.5rem_minmax(0,1fr)] md:items-stretch">
				{/* Desktop: vertical thumbnail strip (Embla) */}
				<div className="hidden min-h-0 md:block">
					<ThumbnailCarousel
						className="h-full"
						images={galleryImages}
						onThumbClick={onThumbClick}
						orientation="vertical"
						selectedIndex={selectedIndex}
						setApi={setDesktopThumbsApi}
					/>
				</div>

				{/* Main gallery */}
				<div className="relative min-w-0">
					<Carousel
						className="w-full"
						opts={mainCarouselOpts}
						plugins={[autoplayPlugin.current]}
						setApi={setMainApi}
					>
						<div className="relative aspect-4/5 overflow-hidden rounded-md">
							<CarouselContent className="ml-0">
								{galleryImages.map((image, index) => (
									<CarouselItem
										className="basis-full pl-0"
										key={`${image.src}-${image.alt}`}
									>
										<div className="group relative aspect-4/5 w-full overflow-hidden bg-card">
											<Image
												alt={image.alt}
												className="object-contain transition-transform duration-300 group-hover:scale-105"
												fill
												priority={index === 0}
												sizes="(max-width: 1024px) 100vw, 400px"
												src={image.src}
											/>
										</div>
									</CarouselItem>
								))}
							</CarouselContent>

							<CarouselPrevious
								className={cn(navButtonClass, "left-2 md:left-3")}
								size="icon-sm"
								variant="outline"
							/>
							<CarouselNext
								className={cn(navButtonClass, "right-2 md:right-3")}
								size="icon-sm"
								variant="outline"
							/>
						</div>
					</Carousel>
				</div>
			</div>
		</div>
	);
}
