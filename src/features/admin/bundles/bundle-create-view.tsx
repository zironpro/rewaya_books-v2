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

		const p = parseFloat(price) || 0;
		const orig = parseFloat(originalPrice) || 0;
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
				}
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
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-lg border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
				<div>
					<div className="flex items-center gap-2">
						<Package className="h-5 w-5 text-primary" />
						<h1 className="font-extrabold text-xl text-slate-900 dark:text-white">
							Create Marketing Bundle
						</h1>
					</div>
					<p className="text-sm text-slate-500 mt-1">
						Combine multiple catalog books into a discounted marketing bundle.
					</p>
				</div>
				<Link href="/admin/bundles">
					<Button className="h-10 gap-2 px-4 text-sm" variant="outline">
						<ArrowLeft className="h-4 w-4" /> Back to Bundles
					</Button>
				</Link>
			</div>

			<form className="grid max-w-5xl grid-cols-1 gap-6 lg:grid-cols-3" onSubmit={handleSaveBundle}>
				<div className="space-y-6 rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm lg:col-span-2 dark:border-slate-800 dark:bg-slate-900">
					<div className="space-y-2">
						<label className="font-semibold text-slate-700 dark:text-slate-300">
							Bundle Title *
						</label>
						<Input
							required
							placeholder="e.g. Ramadan Special Reading Collection"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							className="h-10 text-sm"
						/>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<label className="font-semibold text-slate-700 dark:text-slate-300">
								Bundle Price (AED)
							</label>
							<Input
								type="number"
								value={price}
								onChange={(e) => setPrice(e.target.value)}
								className="h-10 text-sm"
							/>
						</div>
						<div className="space-y-2">
							<label className="font-semibold text-slate-700 dark:text-slate-300">
								Original Price (AED)
							</label>
							<Input
								type="number"
								value={originalPrice}
								onChange={(e) => setOriginalPrice(e.target.value)}
								className="h-10 text-sm"
							/>
						</div>
					</div>

					<div className="space-y-2">
						<label className="font-semibold text-slate-700 dark:text-slate-300">
							Description
						</label>
						<Input
							placeholder="Bundle description"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							className="h-10 text-sm"
						/>
					</div>

					<div className="space-y-2">
						<label className="font-semibold text-slate-700 dark:text-slate-300">
							Select Books
						</label>
						<div className="max-h-64 overflow-y-auto border border-slate-200 dark:border-slate-800 rounded-md p-2 space-y-2">
							{products.map((p: any) => (
								<label key={p.id} className="flex items-center gap-3 text-sm cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 p-2 rounded">
									<input 
										type="checkbox" 
										checked={selectedBooks.includes(p.id)}
										onChange={(e) => {
											if (e.target.checked) setSelectedBooks([...selectedBooks, p.id]);
											else setSelectedBooks(selectedBooks.filter(id => id !== p.id));
										}}
									/>
									{p.coverImage && <img src={p.coverImage} className="w-8 h-12 object-cover rounded shadow-sm" />}
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
								type="file"
								accept="image/*"
								onChange={handleImageUpload}
								disabled={isUploading}
								className="h-10 text-sm w-full file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
							/>
							{isUploading && <div className="text-xs text-slate-500 animate-pulse">Uploading...</div>}
							{coverImage ? (
								<div className="mt-4 relative overflow-hidden rounded-lg border border-slate-200 shadow-sm">
									<img src={coverImage} alt="Preview" className="object-cover w-full h-full aspect-square" />
								</div>
							) : (
								<div className="mx-auto mt-4 flex aspect-square w-full max-w-[200px] flex-col items-center justify-center rounded-lg border border-slate-300 border-dashed bg-slate-50 text-slate-400 dark:border-slate-700 dark:bg-slate-800/50">
									<span className="text-sm">No image uploaded</span>
								</div>
							)}
						</div>
					</div>

					<div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
						<Button className="h-11 w-full gap-2" type="submit" disabled={createBundleMutation.isPending}>
							<Save className="h-4 w-4" /> 
							{createBundleMutation.isPending ? "Creating..." : "Save & Publish Bundle"}
						</Button>
					</div>
				</div>
			</form>
		</div>
	);
}
