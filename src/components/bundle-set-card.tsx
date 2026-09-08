"use client";

import { useMemo, useSyncExternalStore } from "react";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Tag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CoverFlow, type CoverFlowItem } from "@/components/ui/coverflow";
import { Tooltip, TooltipPopup, TooltipTrigger } from "@/components/ui/tooltip";

import type { Bundle } from "@/domain/catalog";

interface BundleSetCardProps {
	bundle: Bundle;
}

function usePrefersReducedMotion() {
	return useSyncExternalStore(
		(onStoreChange) => {
			const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
			mq.addEventListener("change", onStoreChange);
			return () => mq.removeEventListener("change", onStoreChange);
		},
		() => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
		() => false
	);
}

function bundleToCoverFlowItems(bundle: Bundle): CoverFlowItem[] {
	if (bundle.books.length > 0) {
		return bundle.books.map((book) => ({
			id: book.id,
			image: book.image,
			title: book.title,
		}));
	}

	return [
		{
			id: bundle.id,
			image: bundle.coverImage,
			title: bundle.title,
		},
	];
}

export function BundleSetCard({ bundle }: BundleSetCardProps) {
	const router = useRouter();
	const prefersReducedMotion = usePrefersReducedMotion();
	const bundleHref = `/bundles/${bundle.id}`;

	const coverFlowItems = useMemo(
		() => bundleToCoverFlowItems(bundle),
		[bundle]
	);

	const initialIndex = useMemo(
		() => Math.max(0, coverFlowItems.length - 3),
		[coverFlowItems.length]
	);

	const stackImages = [
		bundle.books[2]?.image,
		bundle.books[1]?.image,
		bundle.coverImage,
	].filter(Boolean) as string[];

	const bookCountBadge = (
		<Tooltip>
			<TooltipTrigger
				render={
					<span className="absolute -top-3 -right-3 z-20 flex size-8 flex-col items-center justify-center rounded-full border-2 border-white bg-primary text-white shadow-md" />
				}
			>
				<span className="-translate-y-0.5 font-bold font-display text-sm leading-none">
					{bundle.books.length}
				</span>
			</TooltipTrigger>
			<TooltipPopup>{bundle.books.length} Books sets</TooltipPopup>
		</Tooltip>
	);

	return (
		<Link
			className="group relative flex cursor-pointer flex-col items-center gap-3 rounded-sm border bg-card p-6 shadow-sm transition-all duration-500 hover:border-gold sm:flex-row md:gap-10 md:p-9 lg:gap-12"
			href={bundleHref}
		>
			{/* Mobile: Cover Flow */}
			<div className="relative z-10 h-52 w-full shrink-0 gap-6 sm:hidden">
				{prefersReducedMotion ? (
					<div className="flex items-end justify-center gap-3">
						{coverFlowItems.map((item) => (
							<div
								className="relative aspect-4/5 w-20 shrink-0 overflow-hidden rounded-sm border border-stone-200 bg-white shadow-sm"
								key={item.id}
							>
								{item.image ? (
									<Image
										alt={item.title}
										className="object-cover"
										fill
										sizes="80px"
										src={item.image}
									/>
								) : (
									<div className="h-full w-full bg-muted" />
								)}
							</div>
						))}
					</div>
				) : (
					<CoverFlow
						centerGap={80}
						className="h-full"
						enableClickToSnap
						enableReflection={false}
						enableScroll={coverFlowItems.length > 1}
						initialIndex={initialIndex}
						itemHeight={144}
						items={coverFlowItems}
						itemWidth={112}
						onItemClick={() => router.push(bundleHref)}
						rotation={48}
						scrollThreshold={40}
						showCaption={false}
						stackSpacing={48}
					/>
				)}
				{bookCountBadge}
			</div>

			{/* Desktop: stacked covers */}
			<div className="relative mb-6 hidden aspect-4/5 w-32 shrink-0 sm:mb-0 sm:block md:w-48">
				{stackImages[0] && (
					<div className="absolute inset-0 -translate-x-3.75 -rotate-12 transform overflow-hidden rounded-sm border border-stone-100 bg-stone-200 shadow-md transition-transform duration-500 group-hover:-rotate-15">
						<Image
							alt=""
							className="object-cover opacity-60"
							fill
							sizes="128px"
							src={stackImages[0]}
						/>
					</div>
				)}

				{stackImages[1] && (
					<div className="absolute inset-0 translate-x-3.75 rotate-6 transform overflow-hidden rounded-sm border border-stone-200 bg-stone-100 shadow-lg transition-transform duration-500 group-hover:rotate-12">
						<Image
							alt=""
							className="object-cover opacity-80"
							fill
							sizes="128px"
							src={stackImages[1]}
						/>
					</div>
				)}
				<div className="absolute inset-0 rotate-0 transform overflow-hidden rounded-sm border border-stone-300 bg-white shadow-sm transition-transform duration-500 group-hover:-translate-y-2">
					{stackImages[2] || bundle.coverImage ? (
						<Image
							alt={bundle.title}
							className="object-cover"
							fill
							sizes="128px"
							src={stackImages[2] || bundle.coverImage}
						/>
					) : (
						<div className="h-full w-full bg-muted" />
					)}
				</div>
				{bookCountBadge}
			</div>

			<div className="pointer-events-auto relative z-10 flex h-full grow flex-col justify-between">
				<div>
					{bundle.tag && (
						<p className="mb-1 flex w-fit items-center gap-1.5 rounded bg-card px-1.5 py-1 font-medium text-primary text-xs uppercase">
							<Tag size={12} />
							{bundle.tag}
						</p>
					)}
					<h3 className="mb-2 font-semibold font-serif text-secondary text-xl transition-colors group-hover:text-primary sm:text-2xl">
						{bundle.title}
					</h3>
					<p className="mb-6 line-clamp-3 text-muted-foreground text-sm">
						{bundle.books.map((book) => book.title).join(", ")}
					</p>
				</div>
				<div className="flex items-center justify-between">
					<div>
						<span className="mr-2 font-medium text-muted-foreground/60 line-through">
							AED {bundle.originalPrice.toFixed(2)}
						</span>
						<span className="font-bold text-lg text-secondary">
							AED {bundle.price.toFixed(2)}
						</span>
					</div>
					<Button>Buy bundle</Button>
				</div>
			</div>
		</Link>
	);
}
