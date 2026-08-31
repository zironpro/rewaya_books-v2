"use client";

import { useState } from "react";

import { SlidersHorizontal } from "lucide-react";

import Breadcrumbs from "@/components/layout/Breadcrumbs";
import { MobileFilterDrawer } from "@/components/layout/mobile-filter-drawer";
import { Button } from "@/components/ui/button";

import { BundleCard } from "@/features/bundles/components/bundle-card";
import { BundlesFilter } from "@/features/bundles/components/bundles-filter";
import { BundlesSortSelect } from "@/features/bundles/components/bundles-sort-select";
import type { Bundle } from "@/lib/catalog/types";

interface BundlesViewProps {
	bundles: Bundle[];
}

export const BundlesView = ({ bundles }: BundlesViewProps) => {
	const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

	return (
		<>
			<main className="min-h-screen grow pt-4 pb-28 md:pb-16">
				<section className="container mb-12">
					<Breadcrumbs className="mb-8" items={[{ label: "Bundles" }]} />
					<div className="text-center">
						<span className="mb-6 block font-bold text-primary text-sm">
							Curated Collections
						</span>
						<h1 className="mb-8 font-bold font-serif text-4xl text-primary sm:text-5xl md:text-6xl lg:text-7xl">
							The{" "}
							<span className="font-normal text-secondary italic">
								Bundles.
							</span>
						</h1>
					</div>
				</section>

				<section className="container mb-8 flex gap-4 lg:hidden">
					<Button
						className="h-12 flex-1 border-stone-100 font-bold text-sm"
						onClick={() => setIsMobileFilterOpen(true)}
						variant="outline"
					>
						<SlidersHorizontal className="mr-2" size={14} /> Filter & Sort
					</Button>
				</section>

				<section className="container mb-32">
					<div className="flex flex-col gap-16 lg:flex-row">
						<aside className="scrollbar-thin sticky top-32 hidden h-fit max-h-[calc(100vh-160px)] w-64 shrink-0 space-y-12 overflow-y-auto pr-4 lg:block">
							<BundlesFilter bundles={bundles} />
						</aside>

						<div className="grow">
							<div className="mb-12 hidden items-center justify-between border-stone-100 border-b pb-4 lg:flex">
								<p className="font-bold text-primary text-sm">
									Showing {bundles.length} Curations
								</p>
								<div className="flex items-center gap-6">
									<span className="shrink-0 font-bold text-sm text-stone-400">
										Sort by:
									</span>
									<BundlesSortSelect />
								</div>
							</div>

							<div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
								{bundles.map((bundle) => (
									<BundleCard key={bundle.id} {...bundle} />
								))}
							</div>
						</div>
					</div>
				</section>
			</main>

			<MobileFilterDrawer
				onOpenChange={setIsMobileFilterOpen}
				open={isMobileFilterOpen}
			>
				<div className="space-y-12">
					<div>
						<h3 className="mb-4 border-stone-100 border-b pb-4 font-bold text-primary text-sm">
							Sort by
						</h3>
						<BundlesSortSelect />
					</div>
					<BundlesFilter
						bundles={bundles}
						onApply={() => setIsMobileFilterOpen(false)}
						showApplyButton
					/>
				</div>
			</MobileFilterDrawer>
		</>
	);
};
