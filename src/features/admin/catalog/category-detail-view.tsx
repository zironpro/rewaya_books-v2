"use client";

import React, { useEffect, useState } from "react";

import { useParams, useRouter } from "next/navigation";

import { useQueryClient } from "@tanstack/react-query";
import {
	ArrowDown,
	ArrowLeft,
	ArrowUp,
	CheckCircle,
	Image as ImageIcon,
	Layers,
	Save,
	X,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
	useGetCategoriesQuery,
	useGetProductsQuery,
	useUpdateCategoryMutation,
} from "@/types/graphql";

export function CategoryDetailView() {
	const params = useParams();
	const router = useRouter();
	const queryClient = useQueryClient();
	const slug = params.slug as string;

	const { data, isLoading, refetch } = useGetCategoriesQuery();
	const { data: productsData } = useGetProductsQuery();
	const updateCategoryMutation = useUpdateCategoryMutation();

	const categories = data?.categories || [];
	const category = categories.find((c: any) => c.slug === slug);
	const allProducts = productsData?.products || [];

	const [isEditing, setIsEditing] = useState(false);
	const [editName, setEditName] = useState("");
	const [editSlug, setEditSlug] = useState("");
	const [editStatus, setEditStatus] = useState("");
	const [editSort, setEditSort] = useState(0);
	const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
	const [productSearch, setProductSearch] = useState("");
	const [editImage, setEditImage] = useState("");
	const [isUploading, setIsUploading] = useState(false);

	// Drag and Drop States
	const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
	const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

	useEffect(() => {
		if (category && !isEditing) {
			setEditName(category.name);
			setEditSlug(category.slug);
			setEditStatus(category.status);
			setEditSort(category.sort);
			setSelectedProducts(category.products?.map((p: any) => p.id) || []);
			setEditImage(category.image || "");
		}
	}, [category, isEditing]);

	if (!category) {
		return (
			<div className="flex h-64 items-center justify-center">
				<div className="text-slate-500">Loading category details...</div>
			</div>
		);
	}

	const handleSave = async () => {
		if (!editName) {
			alert("Name is required.");
			return;
		}

		try {
			await updateCategoryMutation.mutateAsync({
				id: category.id,
				input: {
					name: editName,
					slug: editSlug,
					status: editStatus,
					sort: editSort,
					image: editImage,
					products: selectedProducts,
				},
			});
			queryClient.invalidateQueries({ queryKey: ["GetCategories"] });
			setIsEditing(false);
			refetch();
		} catch (error) {
			console.error("Failed to update category:", error);
			alert("Failed to update category.");
		}
	};

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
				setEditImage(data.url);
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

	return (
		<div className="space-y-6">
			{/* Page Header */}
			<div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
				<div className="flex items-center gap-4">
					<Button
						onClick={() => router.push("/admin/catalog/categories")}
						size="icon"
						variant="ghost"
					>
						<ArrowLeft className="h-5 w-5" />
					</Button>
					<div>
						<h1 className="flex items-center gap-2 font-bold text-2xl text-slate-900 dark:text-white">
							{isEditing ? "Edit Category" : category.name}
							{!isEditing && (
								<Badge
									className="ml-2 font-semibold"
									variant={
										category.status === "Active" ? "success" : "secondary"
									}
								>
									{category.status === "Active" && (
										<CheckCircle className="mr-1 h-3 w-3" />
									)}{" "}
									{category.status}
								</Badge>
							)}
						</h1>
						{!isEditing && (
							<p className="mt-1 flex items-center gap-1.5 text-slate-500 text-sm">
								<Layers className="h-4 w-4" /> Slug: /{category.slug}
							</p>
						)}
					</div>
				</div>

				<div className="flex items-center gap-2 self-start sm:self-auto">
					{isEditing ? (
						<>
							<Button
								className="gap-2"
								onClick={() => setIsEditing(false)}
								variant="outline"
							>
								<X className="h-4 w-4" /> Cancel
							</Button>
							<Button className="gap-2" onClick={handleSave}>
								<Save className="h-4 w-4" /> Save Changes
							</Button>
						</>
					) : (
						<Button className="gap-2" onClick={() => setIsEditing(true)}>
							Edit Category
						</Button>
					)}
				</div>
			</div>

			<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
				{/* Main Details */}
				<div className="space-y-6 lg:col-span-2">
					<div className="rounded-lg border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
						<h2 className="mb-4 font-bold text-lg text-slate-900 dark:text-white">
							Category Information
						</h2>
						{isEditing ? (
							<div className="space-y-4">
								<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
									<div className="space-y-1">
										<label className="font-semibold text-slate-700 text-sm dark:text-slate-300">
											Name
										</label>
										<Input
											onChange={(e) => setEditName(e.target.value)}
											value={editName}
										/>
									</div>
									<div className="space-y-1">
										<label className="font-semibold text-slate-700 text-sm dark:text-slate-300">
											URL Slug
										</label>
										<Input
											onChange={(e) => setEditSlug(e.target.value)}
											value={editSlug}
										/>
									</div>
								</div>

								<div className="space-y-1">
									<label className="font-semibold text-slate-700 text-sm dark:text-slate-300">
										Description
									</label>
									<textarea
										className="min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
										placeholder="Optional description for the category..."
									/>
								</div>
							</div>
						) : (
							<div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
								<div>
									<div className="text-slate-500 text-sm">Category Name</div>
									<div className="mt-1 font-medium text-slate-900 dark:text-white">
										{category.name}
									</div>
								</div>
								<div>
									<div className="text-slate-500 text-sm">URL Slug</div>
									<div className="mt-1 font-medium text-slate-900 dark:text-white">
										/{category.slug}
									</div>
								</div>
								<div>
									<div className="text-slate-500 text-sm">Products Count</div>
									<div className="mt-1 font-medium text-slate-900 dark:text-white">
										{category.count} items
									</div>
								</div>
							</div>
						)}
					</div>

					{/* Products List */}
					<div className="rounded-lg border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
						<h2 className="mb-4 font-bold text-lg text-slate-900 dark:text-white">
							Products in Category
						</h2>
						{isEditing ? (
							<div className="space-y-6">
								<div>
									<div className="mb-2 font-semibold text-slate-700 text-sm dark:text-slate-300">
										Selected Products (Drag or use arrows to reorder)
									</div>
									<div className="max-h-64 space-y-2 overflow-y-auto rounded-md border border-slate-200 p-2 dark:border-slate-800">
										{selectedProducts.map((productId, index) => {
											const p = allProducts.find(
												(p: any) => p.id === productId
											);
											if (!p) return null;

											const isDragging = draggedIndex === index;
											const isDragOver =
												dragOverIndex === index && draggedIndex !== index;

											return (
												<div
													className={`flex cursor-move items-center gap-3 rounded-md border p-2 transition-all ${
														isDragging
															? "border-primary border-dashed bg-primary/5 opacity-30"
															: isDragOver
																? "border-x-transparent border-t-2 border-t-primary border-b-transparent bg-primary/10 shadow-md"
																: "border-slate-100 bg-slate-50 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:bg-slate-800"
													}`}
													draggable
													key={p.id}
													onDragEnd={() => {
														setDraggedIndex(null);
														setDragOverIndex(null);
													}}
													onDragLeave={() => {
														if (dragOverIndex === index) setDragOverIndex(null);
													}}
													onDragOver={(e) => {
														e.preventDefault();
														setDragOverIndex(index);
														e.dataTransfer.dropEffect = "move";
													}}
													onDragStart={(e) => {
														setDraggedIndex(index);
														e.dataTransfer.setData(
															"text/plain",
															index.toString()
														);
														e.dataTransfer.effectAllowed = "move";
													}}
													onDrop={(e) => {
														e.preventDefault();
														if (draggedIndex !== null) {
															const newArr = [...selectedProducts];
															const [removed] = newArr.splice(draggedIndex, 1);
															newArr.splice(index, 0, removed);
															setSelectedProducts(newArr);
														}
														setDraggedIndex(null);
														setDragOverIndex(null);
													}}
												>
													<div className="mr-2 flex flex-col gap-1">
														<button
															className="text-slate-400 hover:text-primary disabled:opacity-30"
															disabled={index === 0}
															onClick={() => {
																if (index > 0) {
																	const newArr = [...selectedProducts];
																	[newArr[index - 1], newArr[index]] = [
																		newArr[index],
																		newArr[index - 1],
																	];
																	setSelectedProducts(newArr);
																}
															}}
															type="button"
														>
															<ArrowUp className="h-4 w-4" />
														</button>
														<button
															className="text-slate-400 hover:text-primary disabled:opacity-30"
															disabled={index === selectedProducts.length - 1}
															onClick={() => {
																if (index < selectedProducts.length - 1) {
																	const newArr = [...selectedProducts];
																	[newArr[index + 1], newArr[index]] = [
																		newArr[index],
																		newArr[index + 1],
																	];
																	setSelectedProducts(newArr);
																}
															}}
															type="button"
														>
															<ArrowDown className="h-4 w-4" />
														</button>
													</div>
													{p.coverImage && (
														<img
															alt={p.title}
															className="pointer-events-none h-10 w-8 rounded object-cover shadow-sm"
															src={p.coverImage}
														/>
													)}
													<span className="pointer-events-none flex-1 truncate font-medium text-sm">
														{p.title}
													</span>
													<button
														className="z-10 font-medium text-red-500 text-sm hover:text-red-700"
														onClick={() =>
															setSelectedProducts(
																selectedProducts.filter((id) => id !== p.id)
															)
														}
														type="button"
													>
														Remove
													</button>
												</div>
											);
										})}
										{selectedProducts.length === 0 && (
											<div className="py-2 text-center text-slate-500 text-sm">
												No products selected.
											</div>
										)}
									</div>
								</div>

								<div>
									<div className="mb-2 flex items-center justify-between font-semibold text-slate-700 text-sm dark:text-slate-300">
										<span>Add Products</span>
										<Input
											className="h-8 w-1/2 text-xs"
											onChange={(e) => setProductSearch(e.target.value)}
											placeholder="Search by title..."
											value={productSearch}
										/>
									</div>
									<div className="max-h-48 space-y-2 overflow-y-auto rounded-md border border-slate-200 p-2 dark:border-slate-800">
										{allProducts
											.filter((p: any) => !selectedProducts.includes(p.id))
											.filter((p: any) =>
												p.title
													.toLowerCase()
													.includes(productSearch.toLowerCase())
											)
											.slice(0, 50)
											.map((p: any) => (
												<label
													className="flex cursor-pointer items-center gap-3 rounded p-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800"
													key={p.id}
												>
													<input
														checked={false}
														onChange={(e) => {
															if (e.target.checked) {
																setSelectedProducts([
																	...selectedProducts,
																	p.id,
																]);
															}
														}}
														type="checkbox"
													/>
													{p.coverImage && (
														<img
															alt={p.title}
															className="h-10 w-8 rounded object-cover shadow-sm"
															src={p.coverImage}
														/>
													)}
													<span className="truncate font-medium">
														{p.title}
													</span>
												</label>
											))}
										{allProducts
											.filter((p: any) => !selectedProducts.includes(p.id))
											.filter((p: any) =>
												p.title
													.toLowerCase()
													.includes(productSearch.toLowerCase())
											).length === 0 && (
											<div className="py-2 text-center text-slate-500 text-sm">
												No unselected products found.
											</div>
										)}
									</div>
								</div>
							</div>
						) : (
							<div className="max-h-64 space-y-3 overflow-y-auto pr-2">
								{category.products?.map((cp: any) => {
									const p =
										allProducts.find((ap: any) => ap.id === cp.id) || cp;
									return (
										<div
											className="flex items-center gap-3 rounded-md border border-slate-100 p-2 dark:border-slate-800"
											key={p.id}
										>
											{p.coverImage && (
												<img
													alt={p.title}
													className="h-12 w-8 rounded object-cover shadow-sm"
													src={p.coverImage}
												/>
											)}
											<div>
												<div className="font-semibold text-slate-900 text-sm dark:text-white">
													{p.title}
												</div>
												<div className="text-slate-500 text-xs">
													{p.author || "Unknown"}
												</div>
											</div>
										</div>
									);
								})}
								{(!category.products || category.products.length === 0) && (
									<div className="py-4 text-center text-slate-500 text-sm">
										No products in this category yet.
									</div>
								)}
							</div>
						)}
					</div>
				</div>

				{/* Sidebar */}
				<div className="space-y-6">
					<div className="rounded-lg border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
						<h2 className="mb-4 font-bold text-lg text-slate-900 dark:text-white">
							Status & Sorting
						</h2>
						{isEditing ? (
							<div className="space-y-4">
								<div className="space-y-1">
									<label className="font-semibold text-slate-700 text-sm dark:text-slate-300">
										Status
									</label>
									<select
										className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
										onChange={(e) => setEditStatus(e.target.value)}
										value={editStatus}
									>
										<option value="Active">Active</option>
										<option value="Draft">Draft</option>
										<option value="Hidden">Hidden</option>
									</select>
								</div>
								<div className="space-y-1">
									<label className="font-semibold text-slate-700 text-sm dark:text-slate-300">
										Sort Order
									</label>
									<Input
										onChange={(e) => setEditSort(Number(e.target.value))}
										type="number"
										value={editSort}
									/>
								</div>
							</div>
						) : (
							<div className="space-y-4">
								<div className="flex items-center justify-between border-slate-100 border-b pb-3 dark:border-slate-800">
									<div className="text-slate-500 text-sm">Status</div>
									<Badge
										variant={
											category.status === "Active" ? "success" : "secondary"
										}
									>
										{category.status}
									</Badge>
								</div>
								<div className="flex items-center justify-between pb-1">
									<div className="text-slate-500 text-sm">Sort Priority</div>
									<div className="font-bold text-slate-900 dark:text-white">
										#{category.sort}
									</div>
								</div>
							</div>
						)}
					</div>

					<div className="rounded-lg border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
						<h2 className="mb-4 font-bold text-lg text-slate-900 dark:text-white">
							Media
						</h2>
						<div className="relative flex min-h-[160px] flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-slate-200 border-dashed bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900/50">
							{isEditing ? (
								<>
									{editImage ? (
										<img
											alt={editName}
											className="h-full max-h-48 w-full object-contain"
											src={editImage}
										/>
									) : (
										<>
											<ImageIcon className="mb-2 h-8 w-8 text-slate-400" />
											<p className="text-center text-slate-500 text-sm">
												Click to upload category cover image
											</p>
										</>
									)}
									<input
										accept="image/*"
										className="absolute inset-0 cursor-pointer opacity-0"
										disabled={isUploading}
										onChange={handleImageUpload}
										type="file"
									/>
									{isUploading && (
										<div className="absolute inset-0 flex items-center justify-center bg-black/20 font-medium text-sm text-white">
											Uploading...
										</div>
									)}
								</>
							) : category.image ? (
								<img
									alt={category.name}
									className="h-full max-h-48 w-full object-contain"
									src={category.image}
								/>
							) : (
								<>
									<ImageIcon className="mb-2 h-8 w-8 text-slate-400" />
									<p className="text-center text-slate-500 text-sm">
										No image uploaded
									</p>
								</>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
