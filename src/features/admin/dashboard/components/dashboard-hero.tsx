"use client";

import Link from "next/link";

import { BookOpen, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";

export function DashboardHero() {
	return (
		<div className="relative flex flex-col justify-between gap-4 overflow-hidden rounded-lg bg-gradient-to-r from-primary via-primary/95 to-primary-dark p-4 text-white shadow-xl sm:p-6 md:flex-row md:items-center">
			<div className="z-10 space-y-1.5">
				<div className="flex items-center gap-2">
					<ShieldCheck className="h-4 w-4 shrink-0 text-emerald-300 sm:h-5 sm:w-5" />
					<span className="font-semibold text-[10px] text-white/80 uppercase tracking-wider sm:text-sm">
						Rewaya Admin Console
					</span>
				</div>
				<h1 className="font-extrabold text-xl tracking-tight sm:text-2xl md:text-3xl">
					Operations Control Center
				</h1>
				<p className="max-w-xl text-sm text-white/80 leading-relaxed sm:text-base">
					Monitor real-time bookstore sales, catalog inventory updates, and
					regional customer orders.
				</p>
			</div>
			<div className="z-10 flex w-full items-center gap-3 md:w-auto">
				<Link className="w-full md:w-auto" href="/catalog/books">
					<Button className="h-10 w-full gap-2 bg-white px-4 font-semibold text-primary text-sm shadow-md hover:bg-slate-100 md:w-auto">
						<BookOpen className="h-4 w-4" />
						Manage Books Catalog
					</Button>
				</Link>
			</div>
			{/* Background Decorative Pattern */}
			<div className="pointer-events-none absolute top-0 right-0 bottom-0 w-1/3 bg-grid-pattern opacity-10" />
		</div>
	);
}
