"use client";

import * as React from "react";
import {
	ArrowUpRight,
	Image as ImageIcon,
	Plus,
	Sliders,
	Trash2,
} from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	useGetHeroBannersQuery,
	useCreateHeroBannerMutation,
	useDeleteHeroBannerMutation,
} from "@/types/graphql";

const initialBanners = [
	{
		id: "BNR-01",
		title: "Discover the Finest Arabic Literature",
		subtitle:
			"Explore over 12,000 authentic titles with free shipping across the UAE.",
		ctaLabel: "Shop Arabic Books",
		ctaHref: "/shop?category=arabic-books",
		sortOrder: 1,
		enabled: true,
	},
	{
		id: "BNR-02",
		title: "Exclusive Ramadan & Eid Gift Bundles",
		subtitle: "Save up to 30% on curated 3-book collector sets.",
		ctaLabel: "View Book Bundles",
		ctaHref: "/bundles",
		sortOrder: 2,
		enabled: true,
	},
	{
		id: "BNR-03",
		title: "New Releases for Young Readers & Teens",
		subtitle: "Inspiring children and young adult stories updated weekly.",
		ctaLabel: "Explore Children Books",
		ctaHref: "/shop?category=children-books",
		sortOrder: 3,
		enabled: true,
	},
];

export function HeroBannersView() {
	const { data, isLoading, refetch } = useGetHeroBannersQuery();
	const createBannerMutation = useCreateHeroBannerMutation();
	const deleteBannerMutation = useDeleteHeroBannerMutation();
	
	const banners = data?.heroBanners || [];

	const handleDelete = async (id: string) => {
		if (confirm("Are you sure you want to delete this banner?")) {
			try {
				await deleteBannerMutation.mutateAsync({ id });
				refetch();
			} catch (error) {
				console.error("Failed to delete banner:", error);
			}
		}
	};

	return (
		<div className="space-y-6">
			{/* Header Banner */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-lg border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
				<div>
					<div className="flex items-center gap-2">
						<ImageIcon className="h-5 w-5 text-primary" />
						<h1 className="font-extrabold text-xl text-slate-900 dark:text-white">
							Hero Banners Carousel Manager
						</h1>
					</div>
					<p className="text-sm text-slate-500 mt-1">
						Manage storefront homepage hero carousel slides (`HomeBanners`
						collection), CTAs, and ordering.
					</p>
				</div>

				<Link href="/admin/cms/banners/new">
					<Button className="gap-2 font-semibold text-sm h-10 px-4">
						<Plus className="h-4 w-4" />
						Add Banner Slide
					</Button>
				</Link>
			</div>

			{/* Banners Carousel List */}
			<div className="space-y-4">
				{banners.map((bnr) => (
					<div
						key={bnr.id}
						className="flex flex-col justify-between space-y-3 rounded-lg border border-slate-200/80 bg-white p-5 shadow-xs transition-all hover:border-primary/40 dark:border-slate-800 dark:bg-slate-900"
					>
						<div className="flex items-center justify-between">
							<Badge variant="default" className="text-[10px]">
								Slide #{bnr.sortOrder}
							</Badge>
							<div className="flex items-center gap-2">
								<span className="font-semibold text-sm text-primary">
									{bnr.id}
								</span>
								<Button
									variant="ghost"
									size="icon"
									onClick={() => handleDelete(bnr.id)}
									className="h-6 w-6 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/50"
								>
									<Trash2 className="h-3 w-3" />
								</Button>
							</div>
						</div>

						<div>
							<h3 className="font-extrabold text-xl text-slate-900 dark:text-white">
								{bnr.title}
							</h3>
							<p className="text-sm text-slate-500 mt-1">{bnr.subtitle}</p>
						</div>

						<div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-sm">
							<div className="flex items-center gap-2">
								<span className="text-slate-400">Button:</span>
								<Badge
									variant="outline"
									className="font-semibold text-[11px] gap-1"
								>
									{bnr.ctaLabel} <ArrowUpRight className="h-3 w-3" />
								</Badge>
								<span className="text-slate-400 font-mono text-[11px]">
									{bnr.ctaHref}
								</span>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
