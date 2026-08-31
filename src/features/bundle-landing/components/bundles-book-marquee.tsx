"use client";

import * as React from "react";

import { CoverFlow, type CoverFlowItem } from "@/components/ui/coverflow";

import type { BundleBookSlide } from "../lib/bundlesIndexData";
import { BookSlideCard } from "./ui/book-slide-card";

interface BundlesBookMarqueeProps {
	slides: BundleBookSlide[];
}

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

function slidesToCoverFlowItems(slides: BundleBookSlide[]): CoverFlowItem[] {
	return slides.map((slide) => ({
		id: slide.id,
		image: slide.image,
		title: slide.title,
		subtitle: slide.bundleTitle,
	}));
}

export function BundlesBookMarquee({ slides }: BundlesBookMarqueeProps) {
	const prefersReducedMotion = usePrefersReducedMotion();

	const coverFlowItems = React.useMemo(
		() => slidesToCoverFlowItems(slides),
		[slides]
	);

	const initialIndex = React.useMemo(
		() => Math.floor(slides.length / 2),
		[slides.length]
	);

	if (slides.length === 0) return null;

	return (
		<section
			aria-label="Books included in our bundles"
			className="border-border/60 border-y bg-muted/50 py-10 md:py-12"
		>
			<div className="mb-6 text-center">
				<p className="font-medium text-primary text-xs uppercase tracking-[0.2em]">
					Inside every bundle
				</p>
				<h2 className="mt-1 font-bold font-display text-2xl text-secondary md:text-3xl">
					Every title you bring home
				</h2>
			</div>

			{prefersReducedMotion ? (
				<div className="flex flex-wrap justify-center gap-4">
					{slides.map((slide) => (
						<BookSlideCard key={slide.id} slide={slide} />
					))}
				</div>
			) : (
				<div className="relative mx-auto h-[min(520px,75vh)] w-full">
					<CoverFlow
						centerGap={240}
						enableReflection={false}
						initialIndex={initialIndex}
						itemHeight={340}
						items={coverFlowItems}
						itemWidth={280}
						rotation={60}
						scrollThreshold={60}
						stackSpacing={140}
					/>
				</div>
			)}
		</section>
	);
}
