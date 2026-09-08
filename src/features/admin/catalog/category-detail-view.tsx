"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import {
	ChevronRight,
	MoreHorizontal,
	Move,
	UploadCloud,
	X,
	Search
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
		if (category) {
			setEditName(category.name || "");
			setEditSlug(category.slug || "");
			setEditStatus(category.status || "");
			setEditSort(category.sort || 0);
			setSelectedProducts(category.products?.map((p: any) => p.id) || []);
			setEditImage(category.image || "");
		}
	}, [category]);

	if (!category && !isLoading) {
		return (
			<div className="flex h-64 items-center justify-center">
				<div className="text-slate-500">Category not found...</div>
			</div>
		);
	}

	if (isLoading) {
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
			refetch();
			alert("Category updated successfully.");
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
		<div className="min-h-screen bg-slate-50">
			{/* Hero Background */}
			<div className="relative h-[300px] w-full overflow-hidden bg-slate-800">
				{editImage ? (
					<>
						<img
							src={editImage}
							alt=""
							className="absolute inset-0 h-full w-full object-cover blur-3xl opacity-50 scale-110"
						/>
						<div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/60" />
					</>
				) : (
					<div className="absolute inset-0 bg-gradient-to-tr from-orange-500/80 to-pink-500/80" />
				)}

				<div className="relative z-10 mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
					{/* Header Actions */}
					<div className="flex items-start justify-between">
						<div>
							<div className="flex items-center text-sm text-white/80 font-medium">
								<button 
                                    type="button"
									onClick={() => router.push("/admin/catalog/categories")}
									className="hover:text-white transition-colors"
								>
									Categories
								</button>
								<ChevronRight className="mx-1 h-4 w-4" />
								<span className="text-white">{category.name}</span>
							</div>
							<h1 className="mt-4 text-4xl font-bold text-white tracking-tight">
								{category.name}
							</h1>
						</div>

						<div className="flex items-center gap-3">
							<Button
								variant="outline"
								size="icon"
								className="rounded-full bg-white/10 border-white/20 text-white hover:bg-white/20"
							>
								<MoreHorizontal className="h-5 w-5" />
							</Button>
							<Button
								variant="outline"
								onClick={() => router.push("/admin/catalog/categories")}
								className="rounded-full bg-transparent border-white/30 text-white hover:bg-white/10 hover:text-white"
							>
								Cancel
							</Button>
							<Button
								onClick={handleSave}
								className="rounded-full bg-white text-blue-600 hover:bg-white/90 shadow-lg"
							>
								Save
							</Button>
						</div>
					</div>
				</div>
			</div>

			{/* Main Content Layout */}
			<div className="relative z-20 mx-auto max-w-7xl px-4 -mt-32 pb-24 sm:px-6 lg:px-8">
				<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
					
					{/* Left Panel: Products */}
					<div className="lg:col-span-2">
						<div className="rounded-xl bg-white shadow-sm ring-1 ring-slate-900/5 overflow-hidden">
							<div className="flex items-center justify-between border-b border-slate-100 p-6">
								<h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
									Products in category
									<span className="text-slate-400 font-normal">{selectedProducts.length}</span>
								</h2>
								<Dialog>
									<DialogTrigger asChild>
										<Button variant="ghost" className="text-blue-500 font-medium hover:text-blue-600 hover:bg-blue-50">
											+ Add Products
										</Button>
									</DialogTrigger>
									<DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
										<DialogHeader>
											<DialogTitle>Add Products to Category</DialogTitle>
										</DialogHeader>
										<div className="relative mt-2">
											<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
											<Input 
												className="pl-9" 
												placeholder="Search products..." 
												value={productSearch}
												onChange={(e) => setProductSearch(e.target.value)}
											/>
										</div>
										<div className="flex-1 overflow-y-auto mt-4 pr-2 space-y-2">
											{allProducts
												.filter((p: any) => !selectedProducts.includes(p.id))
												.filter((p: any) =>
													p.title.toLowerCase().includes(productSearch.toLowerCase())
												)
												.slice(0, 50)
												.map((p: any) => (
													<label
														key={p.id}
														className="flex cursor-pointer items-center gap-4 rounded-lg p-3 hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200"
													>
														<input
															type="checkbox"
															checked={false}
															onChange={(e) => {
																if (e.target.checked) {
																	setSelectedProducts([...selectedProducts, p.id]);
																}
															}}
															className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
														/>
														{p.coverImage ? (
															<img
																src={p.coverImage}
																alt={p.title}
																className="h-12 w-10 rounded object-cover shadow-sm"
															/>
														) : (
															<div className="h-12 w-10 rounded bg-slate-100 flex items-center justify-center">
																<ImageIcon className="h-4 w-4 text-slate-300" />
															</div>
														)}
														<span className="font-medium text-slate-700">{p.title}</span>
													</label>
												))}
										</div>
									</DialogContent>
								</Dialog>
							</div>

							<div className="p-6">
								<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
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
												onDragEnd={() => {
													setDraggedIndex(null);
													setDragOverIndex(null);
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
												className={`group relative rounded-xl border bg-white overflow-hidden transition-all duration-200 cursor-grab active:cursor-grabbing ${
													isDragging ? "opacity-30 scale-95" : ""
												} ${
													isDragOver ? "ring-2 ring-blue-500 ring-offset-2 scale-105" : "hover:shadow-md hover:-translate-y-1 border-slate-100"
												}`}
											>
												{/* Index Badge */}
												<div className="absolute top-2 left-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-black/40 text-xs font-medium text-white backdrop-blur-md">
													{index + 1}
												</div>

												{/* Delete Button */}
												<button
													type="button"
													onClick={() =>
														setSelectedProducts(
															selectedProducts.filter((id) => id !== p.id)
														)
													}
													className="absolute top-2 right-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-black/40 text-white opacity-0 backdrop-blur-md transition-opacity hover:bg-red-500 group-hover:opacity-100"
												>
													<X className="h-3 w-3" />
												</button>

												{/* Drag Handle Overlay */}
												<div className="absolute inset-x-0 top-0 h-40 bg-black/20 opacity-0 transition-opacity flex items-center justify-center group-hover:opacity-100 z-0">
													<Move className="h-8 w-8 text-white drop-shadow-md" />
												</div>

												<div className="aspect-[3/4] w-full bg-slate-100 relative">
													{p.coverImage && (
														<img
															src={p.coverImage}
															alt={p.title}
															className="h-full w-full object-cover"
														/>
													)}
												</div>
												<div className="p-3">
													<h3 className="line-clamp-2 text-sm font-medium text-slate-800 leading-snug">
														{p.title}
													</h3>
												</div>
											</div>
										);
									})}

									{selectedProducts.length === 0 && (
										<div className="col-span-full py-12 text-center text-slate-500">
											<div className="mx-auto h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
												<UploadCloud className="h-6 w-6 text-slate-400" />
											</div>
											<p className="font-medium text-slate-700">No products in this category</p>
											<p className="text-sm mt-1">Click "+ Add Products" to populate this category.</p>
										</div>
									)}
								</div>
							</div>
						</div>
					</div>

					{/* Right Panel: Category Info */}
					<div className="lg:col-span-1 space-y-6">
						<div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-900/5">
							<h2 className="mb-6 text-xl font-bold text-slate-800">Category info</h2>
							
							<div className="space-y-6">
								<div className="space-y-2">
									<label className="text-sm font-medium text-slate-700">Category name</label>
									<Input
										value={editName}
										onChange={(e) => setEditName(e.target.value)}
										className="bg-slate-50 border-slate-200 focus:bg-white"
									/>
								</div>

								<div className="space-y-2">
									<label className="text-sm font-medium text-slate-700">URL Slug</label>
									<Input
										value={editSlug}
										onChange={(e) => setEditSlug(e.target.value)}
										className="bg-slate-50 border-slate-200 focus:bg-white"
									/>
								</div>

								<div className="space-y-2">
									<label className="text-sm font-medium text-slate-700">Status</label>
									<Select value={editStatus} onValueChange={setEditStatus}>
										<SelectTrigger className="bg-slate-50 border-slate-200 focus:bg-white">
											<SelectValue placeholder="Select status" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="Active">Active</SelectItem>
											<SelectItem value="Draft">Draft</SelectItem>
											<SelectItem value="Archived">Archived</SelectItem>
										</SelectContent>
									</Select>
								</div>

								<div className="space-y-2 pt-2">
									<label className="text-sm font-medium text-slate-700">Category image</label>
									<div className="relative mt-2 overflow-hidden rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 transition-colors hover:bg-slate-100">
										{editImage ? (
											<div className="relative group">
												<img
													src={editImage}
													alt="Category"
													className="w-full h-40 object-cover"
												/>
												<div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
													<label className="cursor-pointer rounded-full bg-white/20 p-3 backdrop-blur-md hover:bg-white/30 transition-colors text-white">
														<UploadCloud className="h-6 w-6" />
														<input
															type="file"
															className="hidden"
															accept="image/*"
															onChange={handleImageUpload}
															disabled={isUploading}
														/>
													</label>
												</div>
											</div>
										) : (
											<label className="flex h-40 cursor-pointer flex-col items-center justify-center">
												<UploadCloud className="mb-2 h-8 w-8 text-slate-400" />
												<span className="text-sm font-medium text-slate-600">
													{isUploading ? "Uploading..." : "Click to upload image"}
												</span>
												<input
													type="file"
													className="hidden"
													accept="image/*"
													onChange={handleImageUpload}
													disabled={isUploading}
												/>
											</label>
										)}
									</div>
								</div>

							</div>
						</div>
					</div>

				</div>
			</div>
		</div>
	);
}
