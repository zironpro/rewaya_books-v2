"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import { ArrowLeft, Layers, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
	useCreateCategoryMutation,
	useGetCategoriesQuery,
	useGetProductsQuery,
} from "@/types/graphql";

export function CategoryCreateView() {
	const router = useRouter();
	const queryClient = useQueryClient();
	const createCategoryMutation = useCreateCategoryMutation();
	const { data: categoriesData } = useGetCategoriesQuery();
	const categories = categoriesData?.categories || [];

	const { data: productsData } = useGetProductsQuery();
	const products = productsData?.products || [];

	const [name, setName] = React.useState("");
	const [slug, setSlug] = React.useState("");
	const [image, setImage] = React.useState("");
	const [status, setStatus] = React.useState("Active");
	const [selectedProducts, setSelectedProducts] = React.useState<string[]>([]);
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

	const handleSave = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!name) return;
		const catSlug = slug || name.toLowerCase().replace(/\s+/g, "-");

		try {
			await createCategoryMutation.mutateAsync({
				input: {
					name,
					slug: catSlug,
					count: selectedProducts.length,
					status: status,
					sort: categories.length + 1,
					image: image || null,
					products: selectedProducts,
				},
			});
			queryClient.invalidateQueries({ queryKey: ["GetCategories"] });
			router.push("/admin/catalog/categories");
			router.refresh();
		} catch (error) {
			console.error("Failed to save category:", error);
		}
	};

	return (
		<div className="space-y-6">
			<div className="flex flex-col justify-between gap-4 rounded-lg border border-slate-200/80 bg-white p-5 shadow-xs sm:flex-row sm:items-center dark:border-slate-800 dark:bg-slate-900">
				<div>
					<div className="flex items-center gap-2">
						<Layers className="h-5 w-5 text-primary" />
						<h1 className="font-extrabold text-slate-900 text-xl dark:text-white">
							Add Store Category
						</h1>
					</div>
					<p className="mt-1 text-slate-500 text-sm">
						Create a new category for storefront navigation.
					</p>
				</div>
				<Link href="/admin/catalog/categories">
					<Button className="h-10 gap-2 px-4 text-sm" variant="outline">
						<ArrowLeft className="h-4 w-4" /> Back to Categories
					</Button>
				</Link>
			</div>

			<form className="grid max-w-5xl grid-cols-1 gap-6 lg:grid-cols-3" onSubmit={handleSave}>
				<div className="space-y-6 rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm lg:col-span-2 dark:border-slate-800 dark:bg-slate-900">
					<div className="space-y-2">
						<label className="font-semibold text-slate-700 dark:text-slate-300">
							Category Name *
						</label>
						<Input
							className="h-10 text-sm"
							onChange={(e) => setName(e.target.value)}
							placeholder="e.g. Graphic Novels"
							required
							value={name}
						/>
					</div>

					<div className="space-y-2">
						<label className="font-semibold text-slate-700 dark:text-slate-300">
							URL Slug
						</label>
						<Input
							className="h-10 text-sm"
							onChange={(e) => setSlug(e.target.value)}
							placeholder="e.g. graphic-novels"
							value={slug}
						/>
					</div>

					<div className="space-y-2">
						<label className="font-semibold text-slate-700 dark:text-slate-300">
							Status
						</label>
						<select
							className="flex h-10 w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-900 dark:focus-visible:ring-ring/40"
							onChange={(e) => setStatus(e.target.value)}
							value={status}
						>
							<option value="Active">Active</option>
							<option value="Draft">Draft</option>
							<option value="Hidden">Hidden</option>
						</select>
					</div>

					<div className="space-y-2">
						<label className="font-semibold text-slate-700 dark:text-slate-300">
							Select Products
						</label>
						<div className="max-h-64 space-y-2 overflow-y-auto rounded-md border border-slate-200 p-2 dark:border-slate-800">
							{products.map((p: any) => (
								<label
									className="flex cursor-pointer items-center gap-3 rounded p-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800"
									key={p.id}
								>
									<input
										checked={selectedProducts.includes(p.id)}
										onChange={(e) => {
											if (e.target.checked)
												setSelectedProducts([...selectedProducts, p.id]);
											else
												setSelectedProducts(
													selectedProducts.filter((id) => id !== p.id)
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
							Category Image
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
							{image ? (
								<div className="relative mx-auto mt-4 aspect-video w-full max-w-[200px] overflow-hidden rounded-lg border border-slate-200 shadow-sm">
									<img
										alt="Category Preview"
										className="h-full w-full object-cover"
										src={image}
									/>
								</div>
							) : (
								<div className="mx-auto mt-4 flex aspect-video w-full max-w-[200px] flex-col items-center justify-center rounded-lg border border-slate-300 border-dashed bg-slate-50 text-slate-400 dark:border-slate-700 dark:bg-slate-800/50">
									<span className="text-sm">No image uploaded</span>
								</div>
							)}
						</div>
					</div>

					<div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
						<Button className="h-11 w-full gap-2" disabled={createCategoryMutation.isPending} type="submit">
							<Save className="h-4 w-4" /> 
							{createCategoryMutation.isPending ? "Creating..." : "Create Category"}
						</Button>
					</div>
				</div>
			</form>
		</div>
	);
}
