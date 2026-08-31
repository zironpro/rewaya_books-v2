"use client";

import Image from "next/image";

import { Badge } from "@/components/ui/badge";

import { CurrencyIcon } from "@/assets/icons/currency";

import type { BundlePresentation } from "@/domain/bundle";

import { BundleCheckoutCta } from "./bundle-checkout-cta";
import { CountdownTimer } from "./countdown-timer";
import { BookMosaic } from "./ui/book-mosic";

interface HeroSectionProps {
	bundle: BundlePresentation;
}

export function HeroSection({
	bundle,
}: HeroSectionProps & { productVariantId?: string | null }) {
	return (
		<section
			className="relative overflow-hidden sm:min-h-[calc(100svh-(--spacing(16)))]"
			id="bundle-hero"
		>
			<div className="absolute inset-0 bg-[radial-gradient(100%_50%_at_50%_0%,oklch(from_var(--color-gold)_l_c_h/0.25)_0,var(--color-background)_50%,var(--color-background)_100%)] bg-white" />
			<div className="container relative flex flex-col items-center gap-8 px-4 pt-9 pb-12 sm:justify-center sm:pt-10 md:gap-12 md:px-8 md:pt-16 md:pb-20">
				<BookMosaic books={bundle.books} />
				<div className="relative z-10 flex w-full max-w-3xl flex-col-reverse items-center rounded-lg text-center sm:flex-col sm:justify-center md:px-8">
					<div>
						<CountdownTimer slug={bundle.slug} />
						<h1 className="mt-3 text-balance font-bold font-display text-[clamp(2rem,5vw,3.25rem)] text-secondary leading-[1.08] tracking-tight">
							{bundle.name}
						</h1>
						<p className="mx-auto mt-2 max-w-2xl text-base text-muted-foreground leading-relaxed sm:text-lg">
							{bundle.tagline}
						</p>
						<div className="mx-auto mt-4 mb-6 flex w-fit flex-col items-center gap-2 sm:flex-row sm:gap-4">
							<span className="font-extrabold text-3xl text-primary">
								AED {bundle.price}
							</span>
							<div className="flex items-center gap-2">
								<span className="relative flex items-center gap-1 text-muted-foreground/60 text-sm">
									<CurrencyIcon className="size-3" /> {bundle.originalPrice}
									<span className="absolute top-1/2 left-1/2 h-px w-[115%] -translate-x-1/2 -translate-y-1/2 bg-muted-foreground/60" />
								</span>
								<Badge size="sm" variant="success">
									Save{" "}
									<span className="font-bold">AED {bundle.savingsAmount}</span>
								</Badge>
							</div>
						</div>
						<BundleCheckoutCta
							bundle={bundle}
							className="mx-auto w-fit"
							label="Get your bundle now"
							mode="checkout"
							size="lg"
						/>
					</div>

					<div className="relative order-1 mb-6 aspect-5/3 w-full max-w-2xl overflow-hidden rounded-md border border-card/10 shadow-md sm:order-0 sm:mt-10 sm:mb-0">
						<Image
							alt="Bundle Hero"
							className="object-cover"
							fill
							src={bundle.coverImage}
						/>
					</div>
				</div>
			</div>
		</section>
	);
}
