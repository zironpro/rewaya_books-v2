import Link from "next/link";

import { ArrowRight } from "lucide-react";

import { BundleSetCard } from "@/components/bundle-set-card";
import { Button } from "@/components/ui/button";

import type { Bundle } from "@/domain/catalog";

interface RelatedBundlesSectionProps {
	bundles: Bundle[];
}

export function RelatedBundlesSection({ bundles }: RelatedBundlesSectionProps) {
	const featured = bundles.slice(0, 2);

	if (featured.length === 0) return null;

	return (
		<section className="border-gold/30 border-y bg-card py-14 md:py-16">
			<div className="container">
				<div className="mb-9 flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
					<div className="max-w-xl">
						<h2 className="font-display font-semibold text-2xl text-secondary tracking-tight md:text-3xl">
							You may also like
						</h2>
						<p className="mt-2 text-muted-foreground">
							Explore more ready-made stacks on the main bundles page.
						</p>
					</div>

					<Button
						className="w-full sm:w-auto"
						nativeButton={false}
						render={<Link href="/bundles" />}
						variant="ghost"
					>
						View All <ArrowRight />
					</Button>
				</div>

				<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
					{featured.map((bundle) => (
						<BundleSetCard bundle={bundle} key={bundle.id} />
					))}
				</div>
			</div>
		</section>
	);
}
