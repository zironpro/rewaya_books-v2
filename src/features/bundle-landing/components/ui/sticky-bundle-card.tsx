import Image from "next/image";
import Link from "next/link";

import { ArrowUpRight, BookOpen } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import { CurrencyIcon } from "@/assets/icons/currency";

import { BundlePresentation } from "@/domain/bundle";
import { cn } from "@/lib/utils";

import { BundlesCampaignActions } from "../bundles-campaign-actions";

export function StickyBundleCard({
	bundle,
	featuredSlug,
}: {
	bundle: BundlePresentation;
	featuredSlug: string;
}) {
	const stackCovers = bundle.books
		.slice(0, 3)
		.map((b) => b.coverUrl)
		.reverse();

	return (
		<aside
			className={cn("lg:sticky lg:top-24 lg:w-[min(100%,36rem)] lg:shrink-0")}
		>
			<div className="lg:sticky lg:top-28">
				<article className="overflow-hidden rounded-2xl bg-card shadow-md">
					<div className="relative aspect-5/3 overflow-hidden">
						<Image
							alt={bundle.name}
							className="object-cover"
							fill
							priority={false}
							sizes="576px"
							src={bundle.coverImage}
						/>
						<div className="absolute inset-0 bg-linear-to-t from-card via-card/20 to-transparent" />
						{stackCovers.length > 0 && (
							<div className="absolute right-4 bottom-3 flex items-end">
								{stackCovers.map((src, i) => (
									<div
										className="relative -ml-3 aspect-4/5 w-16 overflow-hidden rounded-sm border border-background shadow-sm first:ml-0"
										key={src}
										style={{
											transform: `rotate(${(i - 1) * 8}deg) translateY(${i * -1}px)`,
											zIndex: i + 1,
										}}
									>
										<Image
											alt=""
											className="object-cover"
											fill
											sizes="64px"
											src={src}
										/>
									</div>
								))}
							</div>
						)}
					</div>

					<div className="relative -mt-6 space-y-4 px-5 pb-5">
						<div>
							<Badge size="sm" variant="success">
								Save AED {bundle.savingsAmount}
							</Badge>
							<h2 className="mt-2 font-bold font-display text-secondary text-xl leading-tight md:text-2xl">
								{bundle.name}
							</h2>
							<p className="mt-1 line-clamp-2 text-muted-foreground text-sm">
								{bundle.tagline}
							</p>
						</div>

						<p className="line-clamp-3 text-muted-foreground text-xs leading-relaxed">
							{bundle.description}
						</p>

						<Separator />

						<div className="flex items-end justify-between gap-3">
							<div>
								<p className="text-[0.65rem] text-muted-foreground uppercase tracking-wider">
									Bundle price
								</p>
								<div className="mt-0.5 flex items-baseline gap-2">
									<span className="font-black font-display text-2xl text-primary">
										AED {bundle.price}
									</span>
									<span className="relative flex items-center gap-0.5 text-muted-foreground/70 text-sm">
										<CurrencyIcon className="size-3" />
										{bundle.originalPrice}
										<span className="absolute top-1/2 left-0 h-px w-full -translate-y-1/2 bg-muted-foreground/50" />
									</span>
								</div>
							</div>
							<div className="flex shrink-0 flex-col items-center gap-0.5 rounded-lg border border-border bg-muted/40 px-2.5 py-1.5">
								<BookOpen aria-hidden className="size-3.5 text-primary" />
								<span className="font-bold text-secondary text-xs leading-none">
									{bundle.books.length}
								</span>
								<span className="text-[0.6rem] text-muted-foreground uppercase">
									books
								</span>
							</div>
						</div>

						<div className="flex flex-col gap-2">
							<BundlesCampaignActions
								bundle={bundle}
								buttonSize="default"
								buyLabel={`Get ${bundle.name}`}
								featuredSlug={featuredSlug}
								variant="buy-bundle"
							/>
							<Link
								className="inline-flex items-center justify-center gap-1 font-medium text-primary text-xs hover:underline"
								href={`/bundles/${bundle.slug}`}
							>
								Full bundle page
								<ArrowUpRight className="size-3" />
							</Link>
						</div>
					</div>
				</article>
			</div>
		</aside>
	);
}
