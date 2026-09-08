"use client";

import { Eye, EyeOff, Sliders } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
	useCreateHomepageSectionMutation,
	useDeleteHomepageSectionMutation,
	useGetHomepageSectionsQuery,
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
			<div className="flex flex-col justify-between gap-4 rounded-lg border border-slate-200/80 bg-white p-5 shadow-xs sm:flex-row sm:items-center dark:border-slate-800 dark:bg-slate-900">
				<div>
					<div className="flex items-center gap-2">
						<Sliders className="h-5 w-5 text-primary" />
						<h1 className="font-extrabold text-slate-900 text-xl dark:text-white">
							Homepage CMS Section Manager
						</h1>
					</div>
					<p className="mt-1 text-slate-500 text-sm">
						Configure dynamic category-driven sections on the storefront
						(`HomepageSections` schema).
					</p>
				</div>

				<Badge
					className="self-start px-3 py-1 text-sm sm:self-auto"
					variant="outline"
				>
					5 Configured Sections
				</Badge>
			</div>

			{/* Sections Table / Cards */}
			<div className="space-y-4">
				{sections.map((sec) => (
					<div
						className={`flex flex-col justify-between gap-4 rounded-lg border bg-white p-5 transition-all md:flex-row md:items-center dark:bg-slate-900 ${
							sec.enabled
								? "border-slate-200/80 shadow-xs dark:border-slate-800"
								: "border-slate-200/50 bg-slate-50/50 opacity-60 dark:border-slate-800/50 dark:bg-slate-900/40"
						}`}
						key={sec.id}
					>
						<div className="flex items-start gap-4">
							<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 font-extrabold text-base text-primary dark:bg-primary/20">
								#{sec.sortOrder}
							</div>
							<div className="space-y-1">
								<div className="flex items-center gap-2">
									<h3 className="font-bold text-lg text-slate-900 dark:text-white">
										{sec.title}
									</h3>
									<Badge className="text-[10px]" variant="secondary">
										Key: {sec.key}
									</Badge>
									{sec.badge && (
										<Badge className="text-[10px]" variant="default">
											{sec.badge}
										</Badge>
									)}
								</div>
								<p className="text-slate-500 text-sm">{sec.subtitle}</p>
								<div className="flex items-center gap-3 pt-1 font-mono text-slate-400 text-sm">
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
								className="h-9 gap-2 px-4 text-sm"
								onClick={() => toggleSection(sec.id, !!sec.enabled)}
								size="sm"
								variant={sec.enabled ? "outline" : "secondary"}
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
