"use client";

import Link from "next/link";
import { ArrowUpRight, BookOpen, Package, ShoppingBag } from "lucide-react";

import { Badge } from "@/components/ui/badge";

export function QuickActionsCard() {
	return (
		<div className="space-y-4 rounded-lg border border-slate-200/80 bg-white p-4 sm:p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
			<h2 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">
				Admin Quick Actions
			</h2>
			<div className="space-y-3">
				<Link
					className="group flex items-center justify-between rounded-lg border border-slate-200 p-3.5 transition-all hover:border-primary/50 hover:bg-primary/5 dark:border-slate-800"
					href="/catalog/books"
				>
					<div className="flex items-center gap-3 overflow-hidden">
						<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
							<BookOpen className="h-5 w-5" />
						</div>
						<div className="truncate">
							<div className="font-semibold text-base truncate">
								Books Catalog
							</div>
							<div className="text-slate-500 text-sm truncate">
								12,680 titles active
							</div>
						</div>
					</div>
					<ArrowUpRight className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-primary transition-colors" />
				</Link>

				<Link
					className="group flex items-center justify-between rounded-lg border border-slate-200 p-3.5 transition-all hover:border-primary/50 hover:bg-primary/5 dark:border-slate-800"
					href="/bundles"
				>
					<div className="flex items-center gap-3 overflow-hidden">
						<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
							<Package className="h-5 w-5" />
						</div>
						<div className="truncate">
							<div className="font-semibold text-base truncate">
								Book Bundles
							</div>
							<div className="text-slate-500 text-sm truncate">
								Manage offer packages
							</div>
						</div>
					</div>
					<ArrowUpRight className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-primary transition-colors" />
				</Link>

				<Link
					className="group flex items-center justify-between rounded-lg border border-slate-200 p-3.5 transition-all hover:border-primary/50 hover:bg-primary/5 dark:border-slate-800"
					href="/orders"
				>
					<div className="flex items-center gap-3 overflow-hidden">
						<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
							<ShoppingBag className="h-5 w-5" />
						</div>
						<div className="truncate">
							<div className="font-semibold text-base truncate">
								Customer Orders
							</div>
							<div className="text-slate-500 text-sm truncate">
								1,420 orders processed
							</div>
						</div>
					</div>
					<ArrowUpRight className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-primary transition-colors" />
				</Link>
			</div>
		</div>
	);
}
