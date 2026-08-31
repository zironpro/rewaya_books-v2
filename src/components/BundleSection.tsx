import Link from "next/link";

import { ArrowRight } from "lucide-react";

import type { Bundle } from "@/domain/catalog";

import { BundleSetCard } from "./bundle-set-card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

interface BundleSectionProps {
	bundles: Bundle[];
}

export function BundleSection({ bundles }: BundleSectionProps) {
	const featured = bundles.slice(0, 2);

	if (featured.length === 0) return null;

	return (
		<section className="relative mb-16 overflow-hidden border-y bg-card py-16">
			<div className="container relative z-10 mx-auto">
				<div className="mb-9 flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
					<div className="max-w-xl">
						<Badge variant="secondary">Special Campaigns</Badge>
						<h2 className="font-bold font-serif text-4xl text-secondary leading-tight md:text-5xl">
							Curated{" "}
							<span className="font-normal text-primary italic">Sets.</span>
						</h2>
					</div>

					<Button
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
