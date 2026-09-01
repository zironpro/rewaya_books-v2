"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Image as ImageIcon, Save } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUpdatePopupMutation, useGetPopupsQuery } from "@/types/graphql";

export function PopupEditView({ popupId }: { popupId: string }) {
	const router = useRouter();
	const queryClient = useQueryClient();
	const updatePopupMutation = useUpdatePopupMutation();
	const { data, isLoading } = useGetPopupsQuery();
	
	const popup = data?.popups.find((b) => b.id === popupId);

	const [title, setTitle] = React.useState("");
	const [description, setDescription] = React.useState("");
	const [ctaLabel, setCtaLabel] = React.useState("");
	const [ctaHref, setCtaHref] = React.useState("");
	const [delaySeconds, setDelaySeconds] = React.useState("5");
	const [image, setImage] = React.useState("");
	const [isUploading, setIsUploading] = React.useState(false);

	React.useEffect(() => {
		if (popup) {
			setTitle(popup.title || "");
			setDescription(popup.description || "");
			setCtaLabel(popup.ctaLabel || "");
			setCtaHref(popup.ctaHref || "");
			setDelaySeconds(popup.delaySeconds?.toString() || "5");
			setImage(popup.image || "");
		}
	}, [popup]);

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
			await updatePopupMutation.mutateAsync({
				id: popupId,
				input: {
					title,
					description,
					ctaLabel,
					ctaHref,
					image,
					delaySeconds: parseInt(delaySeconds) || 5,
					enabled: popup?.enabled !== false,
				},
			});
			queryClient.invalidateQueries({ queryKey: ["GetPopups"] });
			router.push("/admin/cms/popups");
			router.refresh();
		} catch (error) {
			console.error("Failed to update popup:", error);
		}
	};

	if (isLoading) return <div>Loading...</div>;
	if (!popup) return <div>Popup not found</div>;

	return (
		<div className="space-y-6">
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-lg border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
				<div>
					<div className="flex items-center gap-2">
						<ImageIcon className="h-5 w-5 text-primary" />
						<h1 className="font-extrabold text-slate-900 text-xl dark:text-white">
							Edit Popup Message
						</h1>
					</div>
					<p className="mt-1 text-slate-500 text-sm">
						Update the welcome popup for the storefront.
					</p>
				</div>
				<Link href="/admin/cms/popups">
					<Button className="h-10 gap-2 px-4 text-sm" variant="outline">
						<ArrowLeft className="h-4 w-4" /> Back to Popups
					</Button>
				</Link>
			</div>

			<div className="max-w-2xl space-y-6 rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
				<div className="space-y-1">
					<label className="font-semibold text-slate-700 dark:text-slate-300">
						Popup Headline *
					</label>
					<Input
						required
						placeholder="e.g. Welcome to our Store!"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						className="h-10 text-sm"
					/>
				</div>

				<div className="space-y-1">
					<label className="font-semibold text-slate-700 dark:text-slate-300">
						Description
					</label>
					<Input
						placeholder="e.g. Get 10% off your first order."
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						className="h-10 text-sm"
					/>
				</div>

				<div className="space-y-1">
					<label className="font-semibold text-slate-700 dark:text-slate-300">
						Delay Seconds
					</label>
					<Input
						type="number"
						placeholder="5"
						value={delaySeconds}
						onChange={(e) => setDelaySeconds(e.target.value)}
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
						Popup Image (Optional)
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

				<div className="flex justify-end pt-4">
					<Button className="h-10 gap-2 px-6" onClick={handleSave} type="button">
						<Save className="h-4 w-4" /> Update Popup
					</Button>
				</div>
			</div>
		</div>
	);
}
