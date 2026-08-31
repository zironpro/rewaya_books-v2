"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Image as ImageIcon, Save } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateHeroBannerMutation, useGetHeroBannersQuery } from "@/types/graphql";

export function HeroBannerCreateView() {
	const router = useRouter();
	const queryClient = useQueryClient();
	const createBannerMutation = useCreateHeroBannerMutation();
	const { data } = useGetHeroBannersQuery();
	const banners = data?.heroBanners || [];

	const [title, setTitle] = React.useState("");
	const [subtitle, setSubtitle] = React.useState("");
	const [ctaLabel, setCtaLabel] = React.useState("Shop Collection");
	const [ctaHref, setCtaHref] = React.useState("/shop");

	const handleAdd = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!title) return;

		try {
			await createBannerMutation.mutateAsync({
				input: {
					title,
					subtitle: subtitle || "Special featured banner on Rewaya storefront.",
					ctaLabel,
					ctaHref,
					sortOrder: banners.length + 1,
					enabled: true,
				},
			});
			queryClient.invalidateQueries({ queryKey: ["GetHeroBanners"] });
			router.push("/admin/cms/banners");
			router.refresh();
		} catch (error) {
			console.error("Failed to create banner:", error);
		}
	};

	return (
		<div className="space-y-6">
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-lg border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
				<div>
					<div className="flex items-center gap-2">
						<ImageIcon className="h-5 w-5 text-primary" />
						<h1 className="font-extrabold text-xl text-slate-900 dark:text-white">
							Add Hero Banner
						</h1>
					</div>
					<p className="text-sm text-slate-500 mt-1">
						Create a new promotional hero slide for the storefront homepage.
					</p>
				</div>
				<Link href="/admin/cms/banners">
					<Button className="h-10 gap-2 px-4 text-sm" variant="outline">
						<ArrowLeft className="h-4 w-4" /> Back to Banners
					</Button>
				</Link>
			</div>

			<form className="max-w-2xl space-y-6 rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900" onSubmit={handleAdd}>
				<div className="space-y-1">
					<label className="font-semibold text-slate-700 dark:text-slate-300">
						Banner Headline *
					</label>
					<Input
						required
						placeholder="e.g. Summer Reading Festival 2026"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						className="h-10 text-sm"
					/>
				</div>

				<div className="space-y-1">
					<label className="font-semibold text-slate-700 dark:text-slate-300">
						Subheadline / Description
					</label>
					<Input
						placeholder="e.g. Up to 40% off selected bestsellers."
						value={subtitle}
						onChange={(e) => setSubtitle(e.target.value)}
						className="h-10 text-sm"
					/>
				</div>

				<div className="grid grid-cols-2 gap-4">
					<div className="space-y-1">
						<label className="font-semibold text-slate-700 dark:text-slate-300">
							CTA Button Label
						</label>
						<Input
							value={ctaLabel}
							onChange={(e) => setCtaLabel(e.target.value)}
							className="h-10 text-sm"
						/>
					</div>
					<div className="space-y-1">
						<label className="font-semibold text-slate-700 dark:text-slate-300">
							Target URL Href
						</label>
						<Input
							value={ctaHref}
							onChange={(e) => setCtaHref(e.target.value)}
							className="h-10 text-sm"
						/>
					</div>
				</div>

				<div className="pt-4 flex justify-end">
					<Button type="submit" className="gap-2 h-10 px-6">
						<Save className="h-4 w-4" /> Save Banner Slide
					</Button>
				</div>
			</form>
		</div>
	);
}
