"use client";

import { useEffect, useRef, useState } from "react";

import Image from "next/image";
import Link from "next/link";

import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";

import { BANNERS as FALLBACK_BANNERS } from "../data/banners";

interface HeroCarouselProps {
	banners?: any[];
}

export function HeroCarousel({ banners = [] }: HeroCarouselProps) {
	const slides =
		banners.length > 0
			? banners.map((b) => ({
					title: b.title,
					subtitle: b.subtitle ?? "",
					cta: b.ctaLabel ?? "Shop now",
					href: b.ctaHref ?? "/shop",
					image: b.image,
				}))
			: FALLBACK_BANNERS.map((b) => ({
					title: b.title,
					subtitle: b.subtitle,
					cta: b.cta,
					href: b.href,
					image: b.image,
				}));

	const [current, setCurrent] = useState(0);
	const [isInteracting, setIsInteracting] = useState(false);
	const interactionTimeout = useRef<number | null>(null);

	useEffect(() => {
		if (slides.length <= 1 || isInteracting) return;
		const timer = window.setInterval(() => {
			setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
		}, 5000);
		return () => window.clearInterval(timer);
	}, [slides.length, isInteracting]);

	useEffect(() => {
		return () => {
			if (interactionTimeout.current) {
				window.clearTimeout(interactionTimeout.current);
			}
		};
	}, []);

	const pauseInteraction = () => {
		if (interactionTimeout.current) {
			window.clearTimeout(interactionTimeout.current);
		}
		setIsInteracting(true);
		interactionTimeout.current = window.setTimeout(() => {
			setIsInteracting(false);
		}, 4000);
	};

	if (slides.length === 0) return null;

	const next = () => {
		pauseInteraction();
		setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
	};

	const prev = () => {
		pauseInteraction();
		setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
	};

	const slide = slides[current];

	return (
		<div className="relative h-[35vh] w-full overflow-hidden bg-card sm:h-[70vh] md:h-[calc(100vh-113px)]">
			<AnimatePresence mode="wait">
				<motion.div
					animate={{ opacity: 1 }}
					className="absolute inset-0 size-full overflow-hidden"
					exit={{ opacity: 0 }}
					initial={{ opacity: 0 }}
					key={current}
					transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
				>
					<div className="absolute inset-0">
						<Image
							alt={slide.title}
							className="object-cover"
							fill
							priority={current === 0}
							sizes="100vw"
							src={slide.image}
						/>
						<div className="absolute inset-0 bg-black/20 backdrop-brightness-80" />
					</div>

					<div className="container relative mx-auto flex h-full flex-col items-center justify-center text-center text-card">
						<h1 className="sr-only">
							Al Rewaya Book world: Your Premier Bookstore
						</h1>
						<motion.span
							animate={{ opacity: 1, y: 0 }}
							className="text-balance font-light text-sm sm:text-base md:text-xl"
							initial={{ opacity: 0, y: 20 }}
							transition={{ delay: 0.1 }}
						>
							{slide.subtitle}
						</motion.span>
						<motion.h2
							animate={{ opacity: 1, y: 0 }}
							className="mb-4 font-black font-serif text-4xl uppercase leading-none sm:text-5xl md:mb-8 md:text-8xl"
							initial={{ opacity: 0, y: 30 }}
							transition={{ delay: 0.2 }}
						>
							{slide.title.split(" ").map((word: string, i: number) => (
								<span
									className={i % 2 !== 0 ? "font-normal italic" : ""}
									key={Number(i + 1)}
								>
									{word}{" "}
								</span>
							))}
						</motion.h2>
						<motion.div
							animate={{ opacity: 1, y: 0 }}
							initial={{ opacity: 0, y: 20 }}
							transition={{ delay: 0.3 }}
						>
							<Button
								className="md:hover:px-6"
								data-track="banner"
								nativeButton={false}
								render={<Link href={slide.href} />}
								size="lg"
							>
								{slide.cta} <ArrowRight className="ml-2" size={16} />
							</Button>
						</motion.div>
					</div>
				</motion.div>
			</AnimatePresence>

			{slides.length > 1 && (
				<>
					<div className="absolute right-4 bottom-4 z-10 flex gap-2 md:right-20 md:bottom-10">
						<Button
							aria-label="Previous slide"
							className="bg-transparent border-white/30 text-white transition duration-300 hover:bg-white/20 hover:text-white focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
							onClick={() => {
								pauseInteraction();
								prev();
							}}
							size="icon-lg"
							type="button"
							variant="outline"
						>
							<ChevronLeft size={24} />
						</Button>
						<Button
							aria-label="Next slide"
							className="bg-transparent border-white/30 text-white transition duration-300 hover:bg-white/20 hover:text-white focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
							onClick={() => {
								pauseInteraction();
								next();
							}}
							size="icon-lg"
							type="button"
							variant="outline"
						>
							<ChevronRight size={24} />
						</Button>
					</div>

					<div
						className="absolute bottom-4 left-4 z-10 flex gap-1 md:bottom-10 md:left-20"
						onBlurCapture={() => setIsInteracting(false)}
						onFocusCapture={() => setIsInteracting(true)}
						onPointerEnter={() => setIsInteracting(true)}
						onPointerLeave={() => setIsInteracting(false)}
					>
						{slides.map((_, i) => (
							<button
								aria-current={current === i ? "true" : undefined}
								aria-label={`Go to slide ${i + 1}`}
								className={cn(
									"relative h-1.5 cursor-pointer rounded-full backdrop-blur-sm transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
									current === i
										? "w-12 bg-primary"
										: "w-6 bg-card/30 hover:w-8 hover:bg-card/60"
								)}
								key={Number(i + 1)}
								onClick={() => {
									pauseInteraction();
									setCurrent(i);
								}}
							/>
						))}
					</div>
				</>
			)}
		</div>
	);
}
