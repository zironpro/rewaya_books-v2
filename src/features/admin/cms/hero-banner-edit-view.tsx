"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Image as ImageIcon, Save } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUpdateHeroBannerMutation, useGetHeroBannersQuery } from "@/types/graphql";

export function HeroBannerEditView({ bannerId }: { bannerId: string }) {
	const router = useRouter();
	const queryClient = useQueryClient();
	const updateBannerMutation = useUpdateHeroBannerMutation();
	const { data, isLoading } = useGetHeroBannersQuery();
	
	const banner = data?.heroBanners.find((b) => b.id === bannerId);

	const [title, setTitle] = React.useState("");
	const [subtitle, setSubtitle] = React.useState("");
	const [ctaLabel, setCtaLabel] = React.useState("");
	const [ctaHref, setCtaHref] = React.useState("");
	const [image, setImage] = React.useState("");
	const [isUploading, setIsUploading] = React.useState(false);

	React.useEffect(() => {
		if (banner) {
			setTitle(banner.title || "");
			setSubtitle(banner.subtitle || "");
			setCtaLabel(banner.ctaLabel || "");
			setCtaHref(banner.ctaHref || "");
			setImage(banner.image || "");
		}
	}, [banner]);

	const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		setIsUploading(true);
		const formData = new FormData();
		formData.append("file", file);

		try {
			const res = await fetch("/api/upload", {
				method: "POST",
				body: formData,
			});
			const data = await res.json();
			if (data.url) {
				setImage(data.url);
			} else {
				alert(data.error || "Upload failed");
			}
		} catch (error) {
			console.error("Upload error", error);
			alert("Upload failed");
		} finally {
			setIsUploading(false);
		}
	};

	const handleSave = async (e: React.MouseEvent) => {
		e.preventDefault();
		if (!title) return;

		try {
			await updateBannerMutation.mutateAsync({
				id: bannerId,
				input: {
					title,
					subtitle,
					ctaLabel,
					ctaHref,
					image,
					sortOrder: banner?.sortOrder || 1,
					enabled: banner?.enabled !== false,
				},
			});
			queryClient.invalidateQueries({ queryKey: ["GetHeroBanners"] });
			router.push("/admin/cms/banners");
			router.refresh();
		} catch (error) {
			console.error("Failed to update banner:", error);
		}
	};

	if (isLoading) return <div>Loading...</div>;
	if (!banner) return <div>Banner not found</div>;

	return (
		<div className="space-y-6">
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-lg border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
				<div>
					<div className="flex items-center gap-2">
						<ImageIcon className="h-5 w-5 text-primary" />
						<h1 className="font-extrabold text-xl text-slate-900 dark:text-white">
							Edit Hero Banner
						</h1>
					</div>
					<p className="text-sm text-slate-500 mt-1">
						Update the promotional hero slide for the storefront homepage.
					</p>
				</div>
				<Link href="/admin/cms/banners">
					<Button className="h-10 gap-2 px-4 text-sm" variant="outline">
						<ArrowLeft className="h-4 w-4" /> Back to Banners
					</Button>
				</Link>
			</div>

			<div className="max-w-2xl space-y-6 rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
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

				<div className="space-y-2">
					<label className="font-semibold text-slate-700 dark:text-slate-300">
						Banner Image
					</label>
					<div className="relative flex h-48 w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800">
						<input
							type="file"
							accept="image/*"
							className="absolute inset-0 z-10 cursor-pointer opacity-0"
							onChange={handleImageUpload}
							disabled={isUploading}
						/>
						{isUploading ? (
							<div className="flex flex-col items-center justify-center text-slate-500">
								<span className="text-sm">Uploading...</span>
							</div>
						) : image ? (
							<img
								src={image}
								alt="Banner preview"
								className="h-full w-full object-contain p-2"
							/>
						) : (
							<div className="flex flex-col items-center justify-center text-slate-500">
								<ImageIcon className="mb-2 h-8 w-8 text-slate-400" />
								<span className="text-sm">Click to upload banner image</span>
							</div>
						)}
					</div>
				</div>

				<div className="pt-4 flex justify-end">
					<Button type="button" onClick={handleSave} className="gap-2 h-10 px-6">
						<Save className="h-4 w-4" /> Update Banner Slide
					</Button>
				</div>
			</div>
		</div>
	);
}
