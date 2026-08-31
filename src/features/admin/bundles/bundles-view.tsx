"use client";

import * as React from "react";
import Link from "next/link";
import {
	Calendar,
	CheckCircle2,
	Package,
	Plus,
	Sparkles,
	Tag,
	Trash2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	useGetBundlesQuery,
	useCreateBundleMutation,
	useUpdateBundleMutation,
	useGetProductsQuery,
	useDeleteProductMutation,
} from "@/types/graphql";

const initialBundles = [
	{
		id: "BDL-01",
		title: "Arabic Classics Box Set (3-Book Pack)",
		slug: "arabic-classics-box-set",
		price: 350.0,
		originalPrice: 480.0,
		savings: "27% OFF",
		includedBooks: [
			"The Palace of Dreams",
			"Desert Tales Vol. 2",
			"Arabic Poetry Collection 2026",
		],
		offerWindow: "2026-08-01 to 2026-08-31",
		stock: 25,
		status: "Active Campaign",
	},
	{
		id: "BDL-02",
		title: "Children Bedtime Stories Bundle (Age 3-7)",
		slug: "children-bedtime-stories-bundle",
		price: 199.0,
		originalPrice: 280.0,
		savings: "29% OFF",
		includedBooks: [
			"Children Arabic Fables 3+",
			"Adventures in Bagdad",
			"The Little Falcon",
		],
		offerWindow: "2026-08-05 to 2026-09-15",
		stock: 60,
		status: "Active Campaign",
	},
	{
		id: "BDL-03",
		title: "Enterprise Commerce & Business Mastery",
		slug: "business-mastery-pack",
		price: 290.0,
		originalPrice: 380.0,
		savings: "23% OFF",
		includedBooks: [
			"Psychology of Success",
			"Modern Dubai Business",
			"Leadership Principles",
		],
		offerWindow: "2026-07-01 to 2026-08-15",
		stock: 8,
		status: "Limited Stock",
	},
];

export function BundlesView() {
	const { data, isLoading, refetch } = useGetBundlesQuery();

	const updateBundleMutation = useUpdateBundleMutation();
	const deleteProductMutation = useDeleteProductMutation();
	
	const { data: productsData } = useGetProductsQuery();
	const products = productsData?.products || [];

	const bundles = data?.bundles || [];



	const handleDelete = async (id: string) => {
		if (window.confirm("Are you sure you want to delete this bundle?")) {
			try {
				await deleteProductMutation.mutateAsync({ id });
				refetch();
			} catch (error) {
				console.error("Failed to delete bundle:", error);
				alert("Failed to delete bundle");
			}
		}
	};

	return (
		<div className="space-y-6">
			{/* Header Banner */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-lg border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
				<div>
					<div className="flex items-center gap-2">
						<Package className="h-5 w-5 text-primary" />
						<h1 className="font-extrabold text-xl text-slate-900 dark:text-white">
							Marketing Book Bundles
						</h1>
					</div>
					<p className="text-sm text-slate-500 mt-1">
						Configure CMS Book Bundles (`BookBundles`), discount SKUs,
						strikethrough prices, and included titles list.
					</p>
				</div>

				<Link href="/admin/bundles/new">
					<Button className="gap-2 font-semibold text-sm h-10 px-4">
						<Plus className="h-4 w-4" />
						Create Book Bundle
					</Button>
				</Link>
			</div>

			{/* Bundles List Grid */}
			<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
				{bundles.map((bdl) => (
					<div
						key={bdl.id}
						className="flex flex-col justify-between space-y-4 rounded-lg border border-slate-200/80 bg-white p-5 shadow-xs transition-all hover:border-primary/40 dark:border-slate-800 dark:bg-slate-900"
					>
						<div className="space-y-3">
							<div className="flex items-center justify-between">
								<Badge variant="success" className="text-[10px] gap-1">
									<Sparkles className="h-3 w-3" />
									{bdl.originalPrice && bdl.originalPrice > bdl.price 
										? `${Math.round(((bdl.originalPrice - bdl.price) / bdl.originalPrice) * 100)}% OFF` 
										: "Special Offer"}
								</Badge>
								<span className="font-semibold text-sm text-primary">
									{bdl.id || bdl.slug}
								</span>
								<div className="flex gap-1 items-center">
									<Button variant="ghost" size="sm" asChild>
										<Link href={`/admin/bundles/${bdl.slug}`}>
											Edit
										</Link>
									</Button>
									<Button
										variant="ghost"
										size="sm"
										className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 px-2"
										onClick={() => handleDelete(bdl.id)}
										disabled={deleteProductMutation.isPending}
									>
										<Trash2 className="h-4 w-4" />
									</Button>
								</div>
							</div>

							<div>
								<h3 className="font-bold text-lg text-slate-900 dark:text-white">
									{bdl.title}
								</h3>
								<p className="text-[11px] text-slate-500 font-mono">
									/{bdl.slug}
								</p>
							</div>

							{/* Price AED Badge */}
							<div className="flex items-baseline gap-2">
								<span className="font-extrabold text-2xl text-slate-900 dark:text-white">
									AED {bdl.price.toFixed(2)}
								</span>
								<span className="text-sm text-slate-400 line-through font-semibold">
									AED {bdl.originalPrice?.toFixed(2) || "N/A"}
								</span>
							</div>

							{/* Included Books List */}
							<div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
								<div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
									Included Titles ({bdl.books?.length || 0}):
								</div>
								<ul className="space-y-1">
									{bdl.books?.map((item: any, idx: number) => (
										<li
											key={idx}
											className="flex items-center gap-1.5 text-sm text-slate-700 dark:text-slate-300"
										>
											<CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
											<span className="truncate">{item.title}</span>
										</li>
									))}
								</ul>
							</div>
						</div>

						<div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-sm text-slate-500">
							<div className="flex items-center gap-1">
								<Calendar className="h-3.5 w-3.5 text-slate-400" />
								<span>Ongoing Offer</span>
							</div>
							<Badge variant="outline" className="text-[10px]">
								{bdl.isFeatured ? "Featured" : "Standard"}
							</Badge>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
