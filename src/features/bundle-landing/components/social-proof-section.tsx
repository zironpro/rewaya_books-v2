import { Star } from "lucide-react";

import type { BundlePresentation } from "@/domain/bundle";

interface SocialProofSectionProps {
	bundle: BundlePresentation;
}

export function SocialProofSection({ bundle }: SocialProofSectionProps) {
	const reviews = bundle.reviews;

	if (reviews.length === 0) {
		return null;
	}

	const doubled = [...reviews, ...reviews];

	return (
		<section className="container px-4 py-14 md:py-16">
			<h2 className="font-display text-2xl text-secondary tracking-tight md:text-3xl">
				Readers are stacking it
			</h2>
			<p className="mt-2 text-muted-foreground">
				Early feedback from UAE customers who picked up curated bundles.
			</p>

			<div className="mt-8 md:hidden">
				<div className="-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto overscroll-x-contain px-4 pb-2">
					{reviews.map((r) => (
						<figure
							className="w-[min(85vw,360px)] shrink-0 snap-center rounded-lg border border-gold/15 bg-white/70 p-5 shadow-sm"
							key={r.id}
						>
							<div className="flex gap-0.5 text-gold">
								{Array.from({ length: r.rating }).map((_, i) => (
									<Star className="size-3.5 fill-current" key={Number(i)} />
								))}
							</div>
							<blockquote className="mt-3 text-(--bundle-ink) text-sm leading-relaxed">
								“{r.quote}”
							</blockquote>
							<figcaption className="mt-3 text-muted-foreground text-xs">
								{r.name} · {r.location}
							</figcaption>
						</figure>
					))}
				</div>
			</div>

			<div className="marquee-wrap mt-8 hidden md:block">
				<div className="marquee-track gap-6 py-3 pr-6">
					{doubled.map((r, idx) => (
						<figure
							className="w-[340px] shrink-0 rounded-lg border border-gold/15 bg-white/70 p-6 shadow-sm"
							key={`${r.id}-${Number(idx)}`}
						>
							<div className="flex gap-0.5 text-gold">
								{Array.from({ length: r.rating }).map((_, i) => (
									<Star className="size-4 fill-current" key={Number(i)} />
								))}
							</div>
							<blockquote className="mt-3 text-(--bundle-ink) text-sm leading-relaxed">
								“{r.quote}”
							</blockquote>
							<figcaption className="mt-4 text-muted-foreground text-xs">
								{r.name} · {r.location}
							</figcaption>
						</figure>
					))}
				</div>
			</div>
		</section>
	);
}
