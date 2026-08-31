import Image from "next/image";
import Link from "next/link";

import { ArrowDown, Tag } from "lucide-react";

import { Badge } from "@/components/ui/badge";

import { CurrencyIcon } from "@/assets/icons/currency";

import type { BundlePresentation } from "@/domain/bundle";

import { BundlesCampaignActions } from "./bundles-campaign-actions";

interface BundleIndexCardProps {
	bundle: BundlePresentation;
	featuredSlug: string;
	featured?: boolean;
}

export function BundleIndexCard({
	bundle,
	featuredSlug,
	featured = false,
}: BundleIndexCardProps) {
	const savings = bundle.originalPrice - bundle.price;

	return (
		<article
			className={
				featured
					? "book-shadow flex flex-col overflow-hidden rounded-2xl border border-border bg-card md:col-span-2 md:flex-row"
					: "book-shadow flex flex-col overflow-hidden rounded-2xl border border-border bg-card"
			}
		>
			<div
				className={
					featured
						? "relative aspect-5/3 w-full md:aspect-auto md:min-h-[280px] md:w-1/2"
						: "relative aspect-5/3 w-full"
				}
			>
				<Image
					alt={bundle.name}
					className="object-cover"
					fill
					sizes={
						featured
							? "(max-width: 768px) 100vw, 50vw"
							: "(max-width: 768px) 100vw, 40vw"
					}
					src={bundle.coverImage}
				/>
			</div>

			<div
				className={
					featured
						? "flex flex-1 flex-col justify-between p-6 md:p-8"
						: "flex flex-1 flex-col justify-between p-5"
				}
			>
				<div>
					<div className="mb-3 flex flex-wrap items-center gap-2">
						<Badge size="sm" variant="success">
							Save AED {savings}
						</Badge>
						<Badge size="sm" variant="outline">
							Limited offer
						</Badge>
					</div>
					<h3
						className={
							featured
								? "font-bold font-display text-2xl text-secondary md:text-3xl"
								: "font-bold font-display text-secondary text-xl"
						}
					>
						{bundle.name}
					</h3>
					<p className="mt-2 line-clamp-2 text-muted-foreground">
						{bundle.tagline}
					</p>
					<p className="mt-3 flex items-center gap-1 text-muted-foreground text-sm">
						<Tag className="size-3.5 shrink-0" />
						{bundle.books.length} books in this set
					</p>
					<div className="mt-4 flex items-baseline gap-2">
						<span className="font-black font-display text-2xl text-primary">
							AED {bundle.price}
						</span>
						<span className="relative flex items-center gap-1 text-muted-foreground/60 text-sm">
							<CurrencyIcon className="size-3" />
							{bundle.originalPrice}
							<span className="absolute top-1/2 left-0 h-px w-full -translate-y-1/2 bg-muted-foreground/50" />
						</span>
					</div>
				</div>

				<div className="mt-6 flex flex-col gap-3">
					<BundlesCampaignActions
						bundle={bundle}
						buttonSize={featured ? "lg" : "default"}
						buyLabel="Buy the bundle now"
						featuredSlug={featuredSlug}
						variant="buy-bundle"
					/>
					<Link
						className="inline-flex items-center justify-center gap-1 font-medium text-primary text-sm hover:underline"
						href={`#bundle-${bundle.slug}`}
					>
						What&apos;s inside
						<ArrowDown className="size-3.5" />
					</Link>
				</div>
			</div>
		</article>
	);
}
