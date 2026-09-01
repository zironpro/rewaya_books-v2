"use client";

import Link from "next/link";

import {
	ArrowUpRight,
	Image as ImageIcon,
	Plus,
	Sliders,
	Trash2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
	useGetPopupsQuery,
	useCreatePopupMutation,
	useDeletePopupMutation,
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

export function PopupsView() {
	const { data, isLoading, refetch } = useGetPopupsQuery();
	const createPopupMutation = useCreatePopupMutation();
	const deletePopupMutation = useDeletePopupMutation();

	const popups = data?.popups || [];

	const handleDelete = async (id: string) => {
		if (confirm("Are you sure you want to delete this popup?")) {
			try {
				await deletePopupMutation.mutateAsync({ id });
				refetch();
			} catch (error) {
				console.error("Failed to delete popup:", error);
			}
		}
	};

	return (
		<div className="space-y-6">
			{/* Header Banner */}
			<div className="flex flex-col justify-between gap-4 rounded-lg border border-slate-200/80 bg-white p-5 shadow-xs sm:flex-row sm:items-center dark:border-slate-800 dark:bg-slate-900">
				<div>
					<div className="flex items-center gap-2">
						<ImageIcon className="h-5 w-5 text-primary" />
						<h1 className="font-extrabold text-slate-900 text-xl dark:text-white">
							Popup Messages Manager
						</h1>
					</div>
					<p className="mt-1 text-slate-500 text-sm">
						Manage global welcome popups for the storefront.
					</p>
				</div>

				<Link href="/admin/cms/popups/new">
					<Button className="h-10 gap-2 px-4 font-semibold text-sm">
						<Plus className="h-4 w-4" />
						Add Popup
					</Button>
				</Link>
			</div>

			{/* Banners Carousel List */}
			<div className="space-y-4">
				{popups.map((popup) => (
					<div
						className="flex flex-col justify-between space-y-3 rounded-lg border border-slate-200/80 bg-white p-5 shadow-xs transition-all hover:border-primary/40 dark:border-slate-800 dark:bg-slate-900"
						key={popup.id}
					>
						<div className="flex items-center justify-between">
							<Badge className="text-[10px]" variant="default">
								Delay: {popup.delaySeconds || 5}s
							</Badge>
							<div className="flex items-center gap-2">
								<span className="font-semibold text-primary text-sm">
									{popup.id}
								</span>
								<Link href={`/admin/cms/popups/${popup.id}`}>
									<Button
										className="h-6 w-6 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800"
										size="icon"
										variant="ghost"
									>
										<Sliders className="h-3 w-3" />
									</Button>
								</Link>
								<Button
									className="h-6 w-6 text-red-500 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950/50"
									onClick={() => handleDelete(bnr.id)}
									size="icon"
									variant="ghost"
								>
									<Trash2 className="h-3 w-3" />
								</Button>
							</div>
						</div>

						<div>
							<h3 className="font-extrabold text-slate-900 text-xl dark:text-white">
								{popup.title}
							</h3>
							<p className="mt-1 text-slate-500 text-sm">{popup.description}</p>
						</div>

						<div className="flex items-center justify-between border-slate-100 border-t pt-3 text-sm dark:border-slate-800">
							<div className="flex items-center gap-2">
								<span className="text-slate-400">Button:</span>
								<Badge
									className="gap-1 font-semibold text-[11px]"
									variant="outline"
								>
									{popup.ctaLabel} <ArrowUpRight className="h-3 w-3" />
								</Badge>
								<span className="font-mono text-[11px] text-slate-400">
									{popup.ctaHref}
								</span>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
