"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Layers, Image as ImageIcon, Save, X, CheckCircle, ArrowUp, ArrowDown } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGetCategoriesQuery, useGetProductsQuery, useUpdateCategoryMutation } from "@/types/graphql";

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
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
								<Badge className="ml-2 font-semibold" variant={category.status === "Active" ? "success" : "secondary"}>
									{category.status === "Active" && <CheckCircle className="mr-1 h-3 w-3" />} {category.status}
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
								variant="outline"
								onClick={() => setIsEditing(false)}
								className="gap-2"
							>
								<X className="h-4 w-4" /> Cancel
							</Button>
							<Button onClick={handleSave} className="gap-2">
								<Save className="h-4 w-4" /> Save Changes
							</Button>
						</>
					) : (
						<Button onClick={() => setIsEditing(true)} className="gap-2">
							Edit Category
						</Button>
					)}
				</div>
			</div>

			<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
				{/* Main Details */}
				<div className="lg:col-span-2 space-y-6">
					<div className="rounded-lg border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
						<h2 className="mb-4 font-bold text-lg text-slate-900 dark:text-white">
							Category Information
						</h2>
						{isEditing ? (
							<div className="space-y-4">
								<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
									<div className="space-y-1">
										<label className="font-semibold text-slate-700 text-sm dark:text-slate-300">Name</label>
										<Input value={editName} onChange={(e) => setEditName(e.target.value)} />
									</div>
									<div className="space-y-1">
										<label className="font-semibold text-slate-700 text-sm dark:text-slate-300">URL Slug</label>
										<Input value={editSlug} onChange={(e) => setEditSlug(e.target.value)} />
									</div>
								</div>
								
								<div className="space-y-1">
									<label className="font-semibold text-slate-700 text-sm dark:text-slate-300">Description</label>
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
									<div className="font-medium text-slate-900 dark:text-white mt-1">{category.name}</div>
								</div>
								<div>
									<div className="text-slate-500 text-sm">URL Slug</div>
									<div className="font-medium text-slate-900 dark:text-white mt-1">/{category.slug}</div>
								</div>
								<div>
									<div className="text-slate-500 text-sm">Products Count</div>
									<div className="font-medium text-slate-900 dark:text-white mt-1">{category.count} items</div>
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
									<div className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
										Selected Products (Drag or use arrows to reorder)
									</div>
									<div className="max-h-64 space-y-2 overflow-y-auto rounded-md border border-slate-200 p-2 dark:border-slate-800">
										{selectedProducts.map((productId, index) => {
											const p = allProducts.find((p: any) => p.id === productId);
											if (!p) return null;
											
											const isDragging = draggedIndex === index;
											const isDragOver = dragOverIndex === index && draggedIndex !== index;
											
											return (
												<div 
													key={p.id} 
													draggable
													onDragStart={(e) => {
														setDraggedIndex(index);
														e.dataTransfer.setData("text/plain", index.toString());
														e.dataTransfer.effectAllowed = "move";
													}}
													onDragOver={(e) => {
														e.preventDefault();
														setDragOverIndex(index);
														e.dataTransfer.dropEffect = "move";
													}}
													onDragLeave={() => {
														if (dragOverIndex === index) setDragOverIndex(null);
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
													onDragEnd={() => {
														setDraggedIndex(null);
														setDragOverIndex(null);
													}}
													className={`flex cursor-move items-center gap-3 rounded-md border p-2 transition-all ${
														isDragging
															? "opacity-30 border-dashed border-primary bg-primary/5"
															: isDragOver
																? "border-t-2 border-t-primary bg-primary/10 shadow-md border-x-transparent border-b-transparent"
																: "border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800"
													}`}
												>
													<div className="flex flex-col gap-1 mr-2">
														<button
															type="button"
															onClick={() => {
																if (index > 0) {
																	const newArr = [...selectedProducts];
																	[newArr[index - 1], newArr[index]] = [newArr[index], newArr[index - 1]];
																	setSelectedProducts(newArr);
																}
															}}
															className="text-slate-400 hover:text-primary disabled:opacity-30"
															disabled={index === 0}
														>
															<ArrowUp className="h-4 w-4" />
														</button>
														<button
															type="button"
															onClick={() => {
																if (index < selectedProducts.length - 1) {
																	const newArr = [...selectedProducts];
																	[newArr[index + 1], newArr[index]] = [newArr[index], newArr[index + 1]];
																	setSelectedProducts(newArr);
																}
															}}
															className="text-slate-400 hover:text-primary disabled:opacity-30"
															disabled={index === selectedProducts.length - 1}
														>
															<ArrowDown className="h-4 w-4" />
														</button>
													</div>
													{p.coverImage && (
														<img className="h-10 w-8 rounded object-cover shadow-sm pointer-events-none" src={p.coverImage} alt={p.title} />
													)}
													<span className="truncate font-medium flex-1 text-sm pointer-events-none">{p.title}</span>
													<button
														type="button"
														onClick={() => setSelectedProducts(selectedProducts.filter((id) => id !== p.id))}
														className="text-red-500 hover:text-red-700 text-sm font-medium z-10"
													>
														Remove
													</button>
												</div>
											);
										})}
										{selectedProducts.length === 0 && (
											<div className="text-slate-500 text-sm py-2 text-center">No products selected.</div>
										)}
									</div>
								</div>

								<div>
									<div className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 flex justify-between items-center">
										<span>Add Products</span>
										<Input
											placeholder="Search by title..."
											value={productSearch}
											onChange={(e) => setProductSearch(e.target.value)}
											className="h-8 text-xs w-1/2"
										/>
									</div>
									<div className="max-h-48 space-y-2 overflow-y-auto rounded-md border border-slate-200 p-2 dark:border-slate-800">
										{allProducts
											.filter((p: any) => !selectedProducts.includes(p.id))
											.filter((p: any) => p.title.toLowerCase().includes(productSearch.toLowerCase()))
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
																setSelectedProducts([...selectedProducts, p.id]);
															}
														}}
														type="checkbox"
													/>
													{p.coverImage && (
														<img className="h-10 w-8 rounded object-cover shadow-sm" src={p.coverImage} alt={p.title} />
													)}
													<span className="truncate font-medium">{p.title}</span>
												</label>
											))}
										{allProducts
											.filter((p: any) => !selectedProducts.includes(p.id))
											.filter((p: any) => p.title.toLowerCase().includes(productSearch.toLowerCase())).length === 0 && (
											<div className="text-slate-500 text-sm py-2 text-center">No unselected products found.</div>
										)}
									</div>
								</div>
							</div>
						) : (
							<div className="max-h-64 space-y-3 overflow-y-auto pr-2">
								{category.products?.map((cp: any) => {
									const p = allProducts.find((ap: any) => ap.id === cp.id) || cp;
									return (
										<div key={p.id} className="flex items-center gap-3 rounded-md border border-slate-100 p-2 dark:border-slate-800">
											{p.coverImage && (
												<img className="h-12 w-8 rounded object-cover shadow-sm" src={p.coverImage} alt={p.title} />
											)}
											<div>
												<div className="font-semibold text-slate-900 dark:text-white text-sm">{p.title}</div>
												<div className="text-xs text-slate-500">{p.author || "Unknown"}</div>
											</div>
										</div>
									);
								})}
								{(!category.products || category.products.length === 0) && (
									<div className="text-slate-500 text-sm py-4 text-center">No products in this category yet.</div>
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
									<label className="font-semibold text-slate-700 text-sm dark:text-slate-300">Status</label>
									<select
										value={editStatus}
										onChange={(e) => setEditStatus(e.target.value)}
										className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
									>
										<option value="Active">Active</option>
										<option value="Draft">Draft</option>
										<option value="Hidden">Hidden</option>
									</select>
								</div>
								<div className="space-y-1">
									<label className="font-semibold text-slate-700 text-sm dark:text-slate-300">Sort Order</label>
									<Input type="number" value={editSort} onChange={(e) => setEditSort(Number(e.target.value))} />
								</div>
							</div>
						) : (
							<div className="space-y-4">
								<div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
									<div className="text-slate-500 text-sm">Status</div>
									<Badge variant={category.status === "Active" ? "success" : "secondary"}>
										{category.status}
									</Badge>
								</div>
								<div className="flex items-center justify-between pb-1">
									<div className="text-slate-500 text-sm">Sort Priority</div>
									<div className="font-bold text-slate-900 dark:text-white">#{category.sort}</div>
								</div>
							</div>
						)}
					</div>

					<div className="rounded-lg border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
						<h2 className="mb-4 font-bold text-lg text-slate-900 dark:text-white">
							Media
						</h2>
						<div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900/50 relative overflow-hidden min-h-[160px]">
							{isEditing ? (
								<>
									{editImage ? (
										<img src={editImage} alt={editName} className="h-full w-full object-contain max-h-48" />
									) : (
										<>
											<ImageIcon className="mb-2 h-8 w-8 text-slate-400" />
											<p className="text-slate-500 text-sm text-center">
												Click to upload category cover image
											</p>
										</>
									)}
									<input type="file" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" disabled={isUploading} />
									{isUploading && <div className="absolute inset-0 bg-black/20 flex items-center justify-center text-white text-sm font-medium">Uploading...</div>}
								</>
							) : (
								category.image ? (
									<img src={category.image} alt={category.name} className="h-full w-full object-contain max-h-48" />
								) : (
									<>
										<ImageIcon className="mb-2 h-8 w-8 text-slate-400" />
										<p className="text-slate-500 text-sm text-center">
											No image uploaded
										</p>
									</>
								)
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
