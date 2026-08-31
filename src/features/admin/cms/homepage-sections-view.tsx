"use client";

import * as React from "react";
import {
	Check,
	Eye,
	EyeOff,
	LayoutGrid,
	Sliders,
	ToggleLeft,
	ToggleRight,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	useGetHomepageSectionsQuery,
	useCreateHomepageSectionMutation,
	useDeleteHomepageSectionMutation,
} from "@/types/graphql";

const initialSections = [
	{
		key: "recommended",
		title: "Recommended For You",
		subtitle: "Handpicked top Arabic and International titles",
		categorySlug: "islamic",
		limit: 12,
		badge: "Staff Pick",
		sortOrder: 1,
		enabled: true,
	},
	{
		key: "todays-deals",
		title: "Today's Special Deals",
		subtitle: "Limited time discounted books with up to 50% off",
		categorySlug: "todays-deals",
		limit: 12,
		badge: "Flash Sale",
		sortOrder: 2,
		enabled: true,
	},
	{
		key: "new-sellers",
		title: "New Sellers & Trending",
		subtitle: "Fresh releases popular among readers this week",
		categorySlug: "teen-fiction",
		limit: 8,
		badge: "New Arrival",
		sortOrder: 3,
		enabled: true,
	},
	{
		key: "best-sellers",
		title: "Top Bestsellers",
		subtitle: "All-time favorite books across the GCC region",
		categorySlug: "best-sellers",
		limit: 16,
		badge: "Best Seller",
		sortOrder: 4,
		enabled: true,
	},
	{
		key: "children",
		title: "Children's Book Corner",
		subtitle: "Educational & storybooks for ages 3+ to 12",
		categorySlug: "children-books",
		limit: 12,
		badge: "Kids Favorite",
		sortOrder: 5,
		enabled: true,
	},
];

export function HomepageSectionsView() {
	const { data, isLoading, refetch } = useGetHomepageSectionsQuery();
	const createSectionMutation = useCreateHomepageSectionMutation();
	const deleteSectionMutation = useDeleteHomepageSectionMutation();
	
	const sections = data?.homepageSections || [];

	const toggleSection = async (id: string, enabled: boolean) => {
		// In a real app we'd have a toggle mutation, but for this Phase 1 we will just log it.
		// We'll need to add an update mutation later if we want to toggle.
		console.log("Toggle section", id, !enabled);
	};

	return (
		<div className="space-y-6">
			{/* Header Banner */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-lg border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
				<div>
					<div className="flex items-center gap-2">
						<Sliders className="h-5 w-5 text-primary" />
						<h1 className="font-extrabold text-xl text-slate-900 dark:text-white">
							Homepage CMS Section Manager
						</h1>
					</div>
					<p className="text-sm text-slate-500 mt-1">
						Configure dynamic category-driven sections on the storefront
						(`HomepageSections` schema).
					</p>
				</div>

				<Badge
					variant="outline"
					className="text-sm px-3 py-1 self-start sm:self-auto"
				>
					5 Configured Sections
				</Badge>
			</div>

			{/* Sections Table / Cards */}
			<div className="space-y-4">
				{sections.map((sec) => (
					<div
						key={sec.id}
						className={`flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-lg border p-5 transition-all bg-white dark:bg-slate-900 ${
							sec.enabled
								? "border-slate-200/80 dark:border-slate-800 shadow-xs"
								: "border-slate-200/50 bg-slate-50/50 opacity-60 dark:border-slate-800/50 dark:bg-slate-900/40"
						}`}
					>
						<div className="flex items-start gap-4">
							<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 font-extrabold text-primary dark:bg-primary/20 text-base">
								#{sec.sortOrder}
							</div>
							<div className="space-y-1">
								<div className="flex items-center gap-2">
									<h3 className="font-bold text-lg text-slate-900 dark:text-white">
										{sec.title}
									</h3>
									<Badge variant="secondary" className="text-[10px]">
										Key: {sec.key}
									</Badge>
									{sec.badge && (
										<Badge variant="default" className="text-[10px]">
											{sec.badge}
										</Badge>
									)}
								</div>
								<p className="text-sm text-slate-500">{sec.subtitle}</p>
								<div className="flex items-center gap-3 text-sm text-slate-400 font-mono pt-1">
									<span>
										Category Slug: <strong>/{sec.categorySlug}</strong>
									</span>
									<span>•</span>
									<span>
										Limit: <strong>{sec.limit} items</strong>
									</span>
								</div>
							</div>
						</div>

						<div className="flex items-center gap-3 self-end md:self-center">
							<Button
								size="sm"
								variant={sec.enabled ? "outline" : "secondary"}
								className="gap-2 text-sm h-9 px-4"
								onClick={() => toggleSection(sec.id, !!sec.enabled)}
							>
								{sec.enabled ? (
									<>
										<Eye className="h-4 w-4 text-emerald-500" />
										Visible on Store
									</>
								) : (
									<>
										<EyeOff className="h-4 w-4 text-slate-400" />
										Hidden
									</>
								)}
							</Button>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
