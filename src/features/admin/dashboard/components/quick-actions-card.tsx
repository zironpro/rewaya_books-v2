"use client";

import Link from "next/link";

import { ArrowUpRight, BookOpen, Package, ShoppingBag } from "lucide-react";

export function QuickActionsCard() {
	return (
		<div className="space-y-4 rounded-lg border border-slate-200/80 bg-white p-4 shadow-xs sm:p-6 dark:border-slate-800 dark:bg-slate-900">
			<h2 className="font-bold text-base text-slate-900 sm:text-lg dark:text-white">
				Admin Quick Actions
			</h2>
			<div className="space-y-3">
				<Link
					className="group flex items-center justify-between rounded-lg border border-slate-200 p-3.5 transition-all hover:border-primary/50 hover:bg-primary/5 dark:border-slate-800"
					href="/catalog/books"
				>
					<div className="flex items-center gap-3 overflow-hidden">
						<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
							<BookOpen className="h-5 w-5" />
						</div>
						<div className="truncate">
							<div className="truncate font-semibold text-base">
								Books Catalog
							</div>
							<div className="truncate text-slate-500 text-sm">
								12,680 titles active
							</div>
						</div>
					</div>
					<ArrowUpRight className="h-4 w-4 shrink-0 text-slate-400 transition-colors group-hover:text-primary" />
				</Link>

				<Link
					className="group flex items-center justify-between rounded-lg border border-slate-200 p-3.5 transition-all hover:border-primary/50 hover:bg-primary/5 dark:border-slate-800"
					href="/bundles"
				>
					<div className="flex items-center gap-3 overflow-hidden">
						<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
							<Package className="h-5 w-5" />
						</div>
						<div className="truncate">
							<div className="truncate font-semibold text-base">
								Book Bundles
							</div>
							<div className="truncate text-slate-500 text-sm">
								Manage offer packages
							</div>
						</div>
					</div>
					<ArrowUpRight className="h-4 w-4 shrink-0 text-slate-400 transition-colors group-hover:text-primary" />
				</Link>

				<Link
					className="group flex items-center justify-between rounded-lg border border-slate-200 p-3.5 transition-all hover:border-primary/50 hover:bg-primary/5 dark:border-slate-800"
					href="/orders"
				>
					<div className="flex items-center gap-3 overflow-hidden">
						<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
							<ShoppingBag className="h-5 w-5" />
						</div>
						<div className="truncate">
							<div className="truncate font-semibold text-base">
								Customer Orders
							</div>
							<div className="truncate text-slate-500 text-sm">
								1,420 orders processed
							</div>
						</div>
					</div>
					<ArrowUpRight className="h-4 w-4 shrink-0 text-slate-400 transition-colors group-hover:text-primary" />
				</Link>
			</div>
		</div>
	);
}
