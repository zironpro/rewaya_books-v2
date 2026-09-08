"use client";

import React, { useEffect, useState } from "react";

import { useParams, useRouter } from "next/navigation";

import { useQueryClient } from "@tanstack/react-query";
import {
	ArrowDown,
	ArrowLeft,
	ArrowUp,
	Image as ImageIcon,
	Package,
	Save,
	X,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
	useGetBundlesQuery,
	useGetProductsQuery,
	useUpdateBundleMutation,
} from "@/types/graphql";

export function BundleDetailView() {
	const params = useParams();
	const router = useRouter();
	const queryClient = useQueryClient();
	const slug = params.slug as string;

	const { data, isLoading, refetch } = useGetBundlesQuery();
	const { data: productsData } = useGetProductsQuery();
	const updateBundleMutation = useUpdateBundleMutation();

	const bundles = data?.bundles || [];
	const bundle = bundles.find((b: any) => b.slug === slug);
	const allProducts = productsData?.products || [];

	const [isEditing, setIsEditing] = useState(false);
	const [editTitle, setEditTitle] = useState("");
	const [editSlug, setEditSlug] = useState("");
	const [editPrice, setEditPrice] = useState<number>(0);
	const [editOriginalPrice, setEditOriginalPrice] = useState<number>(0);
	const [editDescription, setEditDescription] = useState("");
	const [selectedBooks, setSelectedBooks] = useState<string[]>([]);
	const [productSearch, setProductSearch] = useState("");
	const [editImage, setEditImage] = useState("");
	const [isUploading, setIsUploading] = useState(false);
	const [editIsFeatured, setEditIsFeatured] = useState(false);

	// Drag and Drop States
	const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
	const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

	useEffect(() => {
		if (bundle && !isEditing) {
			setEditTitle(bundle.title);
			setEditSlug(bundle.slug);
			setEditPrice(bundle.price);
			setEditOriginalPrice(bundle.originalPrice || 0);
			setEditDescription(bundle.description || "");
			setSelectedBooks(bundle.books?.map((p: any) => p.id) || []);
			setEditImage(bundle.coverImage || "");
			setEditIsFeatured(bundle.isFeatured || false);
		}
	}, [bundle, isEditing]);

	if (!bundle) {
		return (
			<div className="flex h-64 items-center justify-center">
				<div className="text-slate-500">Loading bundle details...</div>
			</div>
		);
	}

	const handleSave = async () => {
		if (!editTitle) {
			alert("Title is required.");
			return;
		}

		try {
			await updateBundleMutation.mutateAsync({
				id: bundle.id,
				input: {
					title: editTitle,
					slug: editSlug,
					price: Number(editPrice),
					originalPrice: Number(editOriginalPrice),
					description: editDescription,
					coverImage: editImage,
					isFeatured: editIsFeatured,
					books: selectedBooks,
				},
			});
			queryClient.invalidateQueries({ queryKey: ["GetBundles"] });
			setIsEditing(false);
			refetch();
		} catch (error) {
			console.error("Failed to update bundle:", error);
			alert("Failed to update bundle.");
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
						onClick={() => router.push("/admin/bundles")}
						size="icon"
						variant="ghost"
					>
						<ArrowLeft className="h-5 w-5" />
					</Button>
					<div>
						<h1 className="flex items-center gap-2 font-bold text-2xl text-slate-900 dark:text-white">
							{isEditing ? "Edit Bundle" : bundle.title}
						</h1>
						{!isEditing && (
							<p className="mt-1 flex items-center gap-1.5 text-slate-500 text-sm">
								<Package className="h-4 w-4" /> Slug: /{bundle.slug}
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
							Edit Bundle
						</Button>
					)}
				</div>
			</div>

			<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
				{/* Main Details */}
				<div className="space-y-6 lg:col-span-2">
					<div className="rounded-lg border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
						<h2 className="mb-4 font-bold text-lg text-slate-900 dark:text-white">
							Bundle Information
						</h2>
						{isEditing ? (
							<div className="space-y-4">
								<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
									<div className="space-y-1">
										<label className="font-semibold text-slate-700 text-sm dark:text-slate-300">
											Title
										</label>
										<Input
											onChange={(e) => setEditTitle(e.target.value)}
											value={editTitle}
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
									<div className="space-y-1">
										<label className="font-semibold text-slate-700 text-sm dark:text-slate-300">
											Price (AED)
										</label>
										<Input
											onChange={(e) => setEditPrice(Number(e.target.value))}
											type="number"
											value={editPrice}
										/>
									</div>
									<div className="space-y-1">
										<label className="font-semibold text-slate-700 text-sm dark:text-slate-300">
											Original Price (AED)
										</label>
										<Input
											onChange={(e) =>
												setEditOriginalPrice(Number(e.target.value))
											}
											type="number"
											value={editOriginalPrice}
										/>
									</div>
								</div>

								<div className="space-y-1">
									<label className="font-semibold text-slate-700 text-sm dark:text-slate-300">
										Description
									</label>
									<textarea
										className="min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
										onChange={(e) => setEditDescription(e.target.value)}
										placeholder="Optional description for the bundle..."
										value={editDescription}
									/>
								</div>
							</div>
						) : (
							<div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
								<div>
									<div className="text-slate-500 text-sm">Bundle Title</div>
									<div className="mt-1 font-medium text-slate-900 dark:text-white">
										{bundle.title}
									</div>
								</div>
								<div>
									<div className="text-slate-500 text-sm">URL Slug</div>
									<div className="mt-1 font-medium text-slate-900 dark:text-white">
										/{bundle.slug}
									</div>
								</div>
								<div>
									<div className="text-slate-500 text-sm">Price</div>
									<div className="mt-1 font-medium text-slate-900 dark:text-white">
										{bundle.price} AED
									</div>
								</div>
								{bundle.originalPrice && (
									<div>
										<div className="text-slate-500 text-sm">Original Price</div>
										<div className="mt-1 font-medium text-slate-900 line-through dark:text-white">
											{bundle.originalPrice} AED
										</div>
									</div>
								)}
								<div className="sm:col-span-2">
									<div className="text-slate-500 text-sm">Description</div>
									<div className="mt-1 whitespace-pre-wrap font-medium text-slate-900 dark:text-white">
										{bundle.description || "No description provided."}
									</div>
								</div>
							</div>
						)}
					</div>

					{/* Books List */}
					<div className="rounded-lg border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
						<h2 className="mb-4 font-bold text-lg text-slate-900 dark:text-white">
							Books in Bundle
						</h2>
						{isEditing ? (
							<div className="space-y-6">
								<div>
									<div className="mb-2 font-semibold text-slate-700 text-sm dark:text-slate-300">
										Selected Books (Drag or use arrows to reorder)
									</div>
									<div className="max-h-64 space-y-2 overflow-y-auto rounded-md border border-slate-200 p-2 dark:border-slate-800">
										{selectedBooks.map((productId, index) => {
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
															const newArr = [...selectedBooks];
															const [removed] = newArr.splice(draggedIndex, 1);
															newArr.splice(index, 0, removed);
															setSelectedBooks(newArr);
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
																	const newArr = [...selectedBooks];
																	[newArr[index - 1], newArr[index]] = [
																		newArr[index],
																		newArr[index - 1],
																	];
																	setSelectedBooks(newArr);
																}
															}}
															type="button"
														>
															<ArrowUp className="h-4 w-4" />
														</button>
														<button
															className="text-slate-400 hover:text-primary disabled:opacity-30"
															disabled={index === selectedBooks.length - 1}
															onClick={() => {
																if (index < selectedBooks.length - 1) {
																	const newArr = [...selectedBooks];
																	[newArr[index + 1], newArr[index]] = [
																		newArr[index],
																		newArr[index + 1],
																	];
																	setSelectedBooks(newArr);
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
															setSelectedBooks(
																selectedBooks.filter((id) => id !== p.id)
															)
														}
														type="button"
													>
														Remove
													</button>
												</div>
											);
										})}
										{selectedBooks.length === 0 && (
											<div className="py-2 text-center text-slate-500 text-sm">
												No books selected.
											</div>
										)}
									</div>
								</div>

								<div>
									<div className="mb-2 flex items-center justify-between font-semibold text-slate-700 text-sm dark:text-slate-300">
										<span>Add Books</span>
										<Input
											className="h-8 w-1/2 text-xs"
											onChange={(e) => setProductSearch(e.target.value)}
											placeholder="Search by title..."
											value={productSearch}
										/>
									</div>
									<div className="max-h-48 space-y-2 overflow-y-auto rounded-md border border-slate-200 p-2 dark:border-slate-800">
										{allProducts
											.filter((p: any) => !selectedBooks.includes(p.id))
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
																setSelectedBooks([...selectedBooks, p.id]);
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
											.filter((p: any) => !selectedBooks.includes(p.id))
											.filter((p: any) =>
												p.title
													.toLowerCase()
													.includes(productSearch.toLowerCase())
											).length === 0 && (
											<div className="py-2 text-center text-slate-500 text-sm">
												No unselected books found.
											</div>
										)}
									</div>
								</div>
							</div>
						) : (
							<div className="max-h-64 space-y-3 overflow-y-auto pr-2">
								{bundle.books?.map((cp: any) => {
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
								{(!bundle.books || bundle.books.length === 0) && (
									<div className="py-4 text-center text-slate-500 text-sm">
										No books in this bundle yet.
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
							Options
						</h2>
						{isEditing ? (
							<div className="space-y-4">
								<label className="flex cursor-pointer items-center gap-3">
									<input
										checked={editIsFeatured}
										className="h-4 w-4 rounded border-slate-300 text-primary"
										onChange={(e) => setEditIsFeatured(e.target.checked)}
										type="checkbox"
									/>
									<span className="font-semibold text-slate-700 text-sm dark:text-slate-300">
										Is Featured
									</span>
								</label>
							</div>
						) : (
							<div className="space-y-4">
								<div className="flex items-center justify-between pb-1">
									<div className="text-slate-500 text-sm">Featured</div>
									<Badge variant={bundle.isFeatured ? "success" : "secondary"}>
										{bundle.isFeatured ? "Yes" : "No"}
									</Badge>
								</div>
							</div>
						)}
					</div>

					<div className="rounded-lg border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
						<h2 className="mb-4 font-bold text-lg text-slate-900 dark:text-white">
							Bundle Cover
						</h2>
						<div className="relative flex min-h-[160px] flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-slate-200 border-dashed bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900/50">
							{isEditing ? (
								<>
									{editImage ? (
										<img
											alt={editTitle}
											className="h-full max-h-48 w-full object-contain"
											src={editImage}
										/>
									) : (
										<>
											<ImageIcon className="mb-2 h-8 w-8 text-slate-400" />
											<p className="text-center text-slate-500 text-sm">
												Click to upload bundle cover image
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
							) : bundle.coverImage ? (
								<img
									alt={bundle.title}
									className="h-full max-h-48 w-full object-contain"
									src={bundle.coverImage}
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
