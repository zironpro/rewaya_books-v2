"use client";

import type { BundlePresentation } from "@/domain/bundle";

import { BundleCheckoutCta } from "./bundle-checkout-cta";
import { CountdownTimer } from "./countdown-timer";

interface CtaSectionProps {
	bundle: BundlePresentation;
}

export function CtaSection({
	bundle,
}: CtaSectionProps & { productVariantId?: string | null }) {
	return (
		<section
			className="relative overflow-hidden border-white/10 border-t bg-secondary py-16 text-(--bundle-cream) md:py-24"
			id="checkout"
		>
			<div
				aria-hidden
				className="pointer-events-none absolute inset-0 opacity-[0.07]"
				style={{
					backgroundImage:
						"repeating-linear-gradient(-135deg, transparent, transparent 3px, rgba(255,255,255,0.65) 3px, rgba(255,255,255,0.65) 4px)",
				}}
			/>

			<div className="relative z-1 mx-auto max-w-3xl px-4 text-center sm:px-6">
				<p className="font-medium text-gold text-xs uppercase tracking-[0.25em]">
					Checkout
				</p>
				<h2 className="mt-3 font-display text-2xl tracking-tight sm:text-3xl md:text-4xl">
					Bring home {bundle.name}
				</h2>
				<p className="mt-4 text-base text-white/75 leading-relaxed">
					{bundle.description} Use the same Rewaya cart and delivery you already
					use on the main store.
				</p>
				<div className="mx-auto mt-6 mb-4 flex max-w-xs justify-center">
					<CountdownTimer slug={bundle.slug} variant="dark" />
				</div>
				<BundleCheckoutCta
					bundle={bundle}
					label="Get your bundle now"
					mode="checkout"
					size="lg"
				/>
				<p className="mt-4 text-white/55 text-xs">
					AED {bundle.price} · List AED {bundle.originalPrice} · Save AED{" "}
					{bundle.savingsAmount}
				</p>
			</div>
		</section>
	);
}
