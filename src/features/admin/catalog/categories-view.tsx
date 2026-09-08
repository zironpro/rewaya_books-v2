"use client";

import * as React from "react";

import Link from "next/link";

import { Edit2, Layers, Plus, Search, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
	useDeleteCategoryMutation,
	useGetCategoriesQuery,
	useGetProductsQuery,
	useUpdateCategoryMutation,
} from "@/types/graphql";

const initialCategories = [
	{
		id: "CAT-01",
		name: "Islamic",
		slug: "islamic",
		count: 852,
		status: "Active",
		sort: 1,
	},
	{
		id: "CAT-02",
		name: "Fiction",
		slug: "fiction",
		count: 466,
		status: "Active",
		sort: 2,
	},
	{
		id: "CAT-03",
		name: "Today's Deals",
		slug: "todays-deals",
		count: 248,
		status: "Active",
		sort: 3,
	},
	{
		id: "CAT-04",
		name: "Best Sellers",
		slug: "best-sellers",
		count: 151,
		status: "Active",
		sort: 4,
	},
	{
		id: "CAT-05",
		name: "Children Books",
		slug: "children-books",
		count: 3009,
		status: "Active",
		sort: 5,
	},
	{
		id: "CAT-06",
		name: "Teen Fiction",
		slug: "teen-fiction",
		count: 62,
		status: "Active",
		sort: 6,
	},
	{
		id: "CAT-07",
		name: "Young Adults",
		slug: "young-adults",
		count: 11,
		status: "Active",
		sort: 7,
	},
	{
		id: "CAT-08",
		name: "Comics",
		slug: "comics",
		count: 20,
		status: "Active",
		sort: 8,
	},
	{
		id: "CAT-09",
		name: "Arabic",
		slug: "arabic-books",
		count: 1420,
		status: "Active",
		sort: 9,
	},
	{
		id: "CAT-10",
		name: "Biography",
		slug: "biography",
		count: 310,
		status: "Active",
		sort: 10,
	},
	{
		id: "CAT-11",
		name: "Business",
		slug: "business",
		count: 195,
		status: "Active",
		sort: 11,
	},
	{
		id: "CAT-12",
		name: "Dictionary",
		slug: "dictionary",
		count: 45,
		status: "Active",
		sort: 12,
	},
	{
		id: "CAT-13",
		name: "Education",
		slug: "education",
		count: 540,
		status: "Active",
		sort: 13,
	},
	{
		id: "CAT-14",
		name: "Non Fiction",
		slug: "non-fiction",
		count: 680,
		status: "Active",
		sort: 14,
	},
	{
		id: "CAT-15",
		name: "Poetry",
		slug: "poetry",
		count: 125,
		status: "Active",
		sort: 15,
	},
	{
		id: "CAT-16",
		name: "Pregnancy & Childcare",
		slug: "pregnancy-childcare",
		count: 88,
		status: "Active",
		sort: 16,
	},
	{
		id: "CAT-17",
		name: "Psychology",
		slug: "psychology",
		count: 210,
		status: "Active",
		sort: 17,
	},
	{
		id: "CAT-18",
		name: "Reference",
		slug: "reference",
		count: 160,
		status: "Active",
		sort: 18,
	},
	{
		id: "CAT-19",
		name: "Self Help",
		slug: "self-help",
		count: 390,
		status: "Active",
		sort: 19,
	},
	{
		id: "CAT-20",
		name: "3+ Age Group",
		slug: "3-plus",
		count: 410,
		status: "Active",
		sort: 20,
	},
	{
		id: "CAT-21",
		name: "5+ Age Group",
		slug: "5-plus",
		count: 530,
		status: "Active",
		sort: 21,
	},
	{
		id: "CAT-22",
		name: "Adult",
		slug: "adult",
		count: 890,
		status: "Active",
		sort: 22,
	},
];

export function CategoriesView() {
	const { data, isLoading, refetch } = useGetCategoriesQuery();
	const updateCategoryMutation = useUpdateCategoryMutation();
	const deleteCategoryMutation = useDeleteCategoryMutation();

	const { data: productsData } = useGetProductsQuery();
	const products = productsData?.products || [];

	const categories = data?.categories || [];

	const [search, setSearch] = React.useState("");

	const filtered = categories.filter(
		(c) =>
			c.name.toLowerCase().includes(search.toLowerCase()) ||
			c.slug.toLowerCase().includes(search.toLowerCase())
	);
	return (
		<div className="space-y-6">
			{/* Header Banner */}
			<div className="flex flex-col justify-between gap-4 rounded-lg border border-slate-200/80 bg-white p-5 shadow-xs sm:flex-row sm:items-center dark:border-slate-800 dark:bg-slate-900">
				<div>
					<div className="flex items-center gap-2">
						<Layers className="h-5 w-5 text-primary" />
						<h1 className="font-extrabold text-slate-900 text-xl dark:text-white">
							Categories & Genres Manager
						</h1>
					</div>
					<p className="mt-1 text-slate-500 text-sm">
						Manage storefront category slugs, sorting order, and item counts
						mapped from Rewaya catalog.
					</p>
				</div>

				<Link href="/admin/catalog/categories/new">
					<Button className="h-10 gap-2 px-4 font-semibold text-sm">
						<Plus className="h-4 w-4" />
						Add Category
					</Button>
				</Link>
			</div>

			{/* Search Bar */}
			<div className="rounded-lg border border-slate-200/80 bg-white p-3 shadow-xs dark:border-slate-800 dark:bg-slate-900">
				<div className="relative w-full sm:w-80">
					<Search className="absolute top-2.5 left-2.5 h-4 w-4 text-slate-400" />
					<Input
						className="h-9 border-none bg-slate-50 pl-8 text-sm dark:bg-slate-800"
						onChange={(e) => setSearch(e.target.value)}
						placeholder="Search category name or slug..."
						value={search}
					/>
				</div>
			</div>

			{/* Categories Grid */}
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{filtered.map((cat) => (
					<div
						className="flex items-center justify-between rounded-lg border border-slate-200/80 bg-white p-4 shadow-xs hover:border-primary/40 dark:border-slate-800 dark:bg-slate-900"
						key={cat.id}
					>
						<div className="flex items-center gap-3">
							{cat.image ? (
								<img
									alt={cat.name}
									className="h-9 w-9 shrink-0 rounded-lg border border-slate-200 object-cover dark:border-slate-800"
									src={cat.image}
								/>
							) : (
								<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary dark:bg-primary/20">
									<Layers className="h-5 w-5" />
								</div>
							)}
							<div>
								<div className="font-bold text-base text-slate-900 dark:text-white">
									{cat.name}
								</div>
								<div className="font-mono text-[11px] text-slate-500">
									slug: /{cat.slug}
								</div>
							</div>
						</div>
						<div className="flex items-center gap-3 text-right">
							<Badge className="text-[10px]" variant="secondary">
								{cat.count} titles
							</Badge>
							<Button
								asChild
								className="h-8 w-8 text-slate-500 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/30"
								size="icon"
								variant="ghost"
							>
								<Link href={`/admin/catalog/categories/${cat.slug}`}>
									<Edit2 className="h-4 w-4" />
								</Link>
							</Button>
							<Button
								className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950/30"
								disabled={deleteCategoryMutation.isPending}
								onClick={() => handleDelete(cat.id)}
								size="icon"
								variant="ghost"
							>
								<Trash2 className="h-4 w-4" />
							</Button>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
