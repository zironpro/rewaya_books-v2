import type { BundlePresentation } from "@/domain/bundle";

interface OverviewSectionProps {
	bundle: BundlePresentation;
}

export function OverviewSection({ bundle }: OverviewSectionProps) {
	return (
		<section className="py-14 md:py-20">
			<div className="mx-auto max-w-6xl px-4 sm:px-6">
				<div className="grid gap-10 md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] md:items-start">
					<div>
						<h2 className="font-bold font-display text-secondary text-xl tracking-tight sm:text-2xl md:text-3xl">
							Why this shelf works
						</h2>
						<p className="mt-4 text-base text-muted-foreground leading-relaxed md:text-lg">
							{bundle.longDescription}
						</p>
					</div>
					<ul className="space-y-4 rounded-md border border-gold/20 bg-card p-4 text-(--bundle-ink) shadow-md sm:p-6">
						<li className="flex gap-3">
							<span className="mt-0.5 font-display text-gold">✦</span>
							<span>
								<strong className="font-semibold">Biography & context</strong>:
								anchor your reading in the life of the Prophet with{" "}
								<em className="not-italic">The Sealed Nectar</em>.
							</span>
						</li>
						<li className="flex gap-3">
							<span className="mt-0.5 font-display text-gold">✦</span>
							<span>
								<strong className="font-semibold">Daily worship</strong>:
								portable duas with Fortress of the Muslim for mornings, travel,
								and quiet moments.
							</span>
						</li>
						<li className="flex gap-3">
							<span className="mt-0.5 font-display text-gold">✦</span>
							<span>
								<strong className="font-semibold">Heart & habit</strong>: pair
								spiritual reflection with small, repeatable routines you can
								actually keep.
							</span>
						</li>
					</ul>
				</div>
			</div>
		</section>
	);
}
