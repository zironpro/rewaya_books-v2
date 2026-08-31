"use client";

import Link from "next/link";
import { BookOpen, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";

export function DashboardHero() {
	return (
		<div className="relative overflow-hidden flex flex-col justify-between gap-4 rounded-lg bg-gradient-to-r from-primary via-primary/95 to-primary-dark p-4 sm:p-6 text-white shadow-xl md:flex-row md:items-center">
			<div className="space-y-1.5 z-10">
				<div className="flex items-center gap-2">
					<ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-300 shrink-0" />
					<span className="font-semibold text-white/80 text-[10px] sm:text-sm uppercase tracking-wider">
						Rewaya Admin Console
					</span>
				</div>
				<h1 className="font-extrabold text-xl sm:text-2xl md:text-3xl tracking-tight">
					Operations Control Center
				</h1>
				<p className="max-w-xl text-white/80 text-sm sm:text-base leading-relaxed">
					Monitor real-time bookstore sales, catalog inventory updates, and
					regional customer orders.
				</p>
			</div>
			<div className="flex items-center gap-3 z-10 w-full md:w-auto">
				<Link href="/catalog/books" className="w-full md:w-auto">
					<Button className="w-full md:w-auto gap-2 font-semibold text-sm bg-white text-primary hover:bg-slate-100 shadow-md h-10 px-4">
						<BookOpen className="h-4 w-4" />
						Manage Books Catalog
					</Button>
				</Link>
			</div>
			{/* Background Decorative Pattern */}
			<div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-grid-pattern pointer-events-none" />
		</div>
	);
}
