"use client";

import * as React from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Package, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useCreateBundleMutation, useGetProductsQuery } from "@/types/graphql";

export function BundleCreateView() {
	const router = useRouter();
	const queryClient = useQueryClient();
	const createBundleMutation = useCreateBundleMutation();
	const { data: productsData } = useGetProductsQuery();
	const products = productsData?.products || [];

	const [title, setTitle] = React.useState("");
	const [price, setPrice] = React.useState("220");
	const [originalPrice, setOriginalPrice] = React.useState("300");
	const [description, setDescription] = React.useState("");
	const [coverImage, setCoverImage] = React.useState("");
	const [selectedBooks, setSelectedBooks] = React.useState<string[]>([]);
	const [isUploading, setIsUploading] = React.useState(false);

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
				setCoverImage(data.url);
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

	const handleSaveBundle = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!title) return;

		const p = Number.parseFloat(price) || 0;
		const orig = Number.parseFloat(originalPrice) || 0;
		const bdlSlug = title.toLowerCase().replace(/\s+/g, "-");

		try {
			await createBundleMutation.mutateAsync({
				input: {
					title,
					slug: bdlSlug,
					price: p,
					originalPrice: orig,
					description,
					coverImage: coverImage || null,
					isFeatured: true,
					books: selectedBooks,
				},
			});
			queryClient.invalidateQueries({ queryKey: ["GetBundles"] });
			router.push("/admin/bundles");
			router.refresh();
		} catch (error) {
			console.error("Failed to save bundle", error);
		}
	};

	return (
		<div className="space-y-6">
			<div className="flex flex-col justify-between gap-4 rounded-lg border border-slate-200/80 bg-white p-5 shadow-xs sm:flex-row sm:items-center dark:border-slate-800 dark:bg-slate-900">
				<div>
					<div className="flex items-center gap-2">
						<Package className="h-5 w-5 text-primary" />
						<h1 className="font-extrabold text-slate-900 text-xl dark:text-white">
							Create Marketing Bundle
						</h1>
					</div>
					<p className="mt-1 text-slate-500 text-sm">
						Combine multiple catalog books into a discounted marketing bundle.
					</p>
				</div>
				<Link href="/admin/bundles">
					<Button className="h-10 gap-2 px-4 text-sm" variant="outline">
						<ArrowLeft className="h-4 w-4" /> Back to Bundles
					</Button>
				</Link>
			</div>

			<form
				className="grid max-w-5xl grid-cols-1 gap-6 lg:grid-cols-3"
				onSubmit={handleSaveBundle}
			>
				<div className="space-y-6 rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm lg:col-span-2 dark:border-slate-800 dark:bg-slate-900">
					<div className="space-y-2">
						<label className="font-semibold text-slate-700 dark:text-slate-300">
							Bundle Title *
						</label>
						<Input
							className="h-10 text-sm"
							onChange={(e) => setTitle(e.target.value)}
							placeholder="e.g. Ramadan Special Reading Collection"
							required
							value={title}
						/>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<label className="font-semibold text-slate-700 dark:text-slate-300">
								Bundle Price (AED)
							</label>
							<Input
								className="h-10 text-sm"
								onChange={(e) => setPrice(e.target.value)}
								type="number"
								value={price}
							/>
						</div>
						<div className="space-y-2">
							<label className="font-semibold text-slate-700 dark:text-slate-300">
								Original Price (AED)
							</label>
							<Input
								className="h-10 text-sm"
								onChange={(e) => setOriginalPrice(e.target.value)}
								type="number"
								value={originalPrice}
							/>
						</div>
					</div>

					<div className="space-y-2">
						<label className="font-semibold text-slate-700 dark:text-slate-300">
							Description
						</label>
						<Input
							className="h-10 text-sm"
							onChange={(e) => setDescription(e.target.value)}
							placeholder="Bundle description"
							value={description}
						/>
					</div>

					<div className="space-y-2">
						<label className="font-semibold text-slate-700 dark:text-slate-300">
							Select Books
						</label>
						<div className="max-h-64 space-y-2 overflow-y-auto rounded-md border border-slate-200 p-2 dark:border-slate-800">
							{products.map((p: any) => (
								<label
									className="flex cursor-pointer items-center gap-3 rounded p-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800"
									key={p.id}
								>
									<input
										checked={selectedBooks.includes(p.id)}
										onChange={(e) => {
											if (e.target.checked)
												setSelectedBooks([...selectedBooks, p.id]);
											else
												setSelectedBooks(
													selectedBooks.filter((id) => id !== p.id)
												);
										}}
										type="checkbox"
									/>
									{p.coverImage && (
										<img
											className="h-12 w-8 rounded object-cover shadow-sm"
											src={p.coverImage}
										/>
									)}
									<span className="truncate font-medium">{p.title}</span>
								</label>
							))}
						</div>
					</div>
				</div>

				<div className="space-y-6 lg:col-span-1">
					<div className="space-y-4 rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
						<h2 className="font-bold text-lg text-slate-900 dark:text-white">
							Bundle Cover Image
						</h2>
						<div className="space-y-3">
							<Input
								accept="image/*"
								className="h-10 w-full cursor-pointer text-sm file:mr-4 file:rounded-full file:border-0 file:bg-primary/10 file:px-4 file:py-1 file:font-semibold file:text-primary file:text-xs hover:file:bg-primary/20"
								disabled={isUploading}
								onChange={handleImageUpload}
								type="file"
							/>
							{isUploading && (
								<div className="animate-pulse text-slate-500 text-xs">
									Uploading...
								</div>
							)}
							{coverImage ? (
								<div className="relative mt-4 overflow-hidden rounded-lg border border-slate-200 shadow-sm">
									<img
										alt="Preview"
										className="aspect-square h-full w-full object-cover"
										src={coverImage}
									/>
								</div>
							) : (
								<div className="mx-auto mt-4 flex aspect-square w-full max-w-[200px] flex-col items-center justify-center rounded-lg border border-slate-300 border-dashed bg-slate-50 text-slate-400 dark:border-slate-700 dark:bg-slate-800/50">
									<span className="text-sm">No image uploaded</span>
								</div>
							)}
						</div>
					</div>

					<div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
						<Button
							className="h-11 w-full gap-2"
							disabled={createBundleMutation.isPending}
							type="submit"
						>
							<Save className="h-4 w-4" />
							{createBundleMutation.isPending
								? "Creating..."
								: "Save & Publish Bundle"}
						</Button>
					</div>
				</div>
			</form>
		</div>
	);
}
