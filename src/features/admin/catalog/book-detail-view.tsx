"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
	ArrowLeft,
	BookOpen,
	Image as ImageIcon,
	Package,
	CheckCircle,
	Edit,
	Save,
	X,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useGetProductBySlugQuery, useUpdateProductMutation, useGetCategoriesQuery } from "@/types/graphql";
import Image from "next/image";

export function BookDetailView() {
	const params = useParams();
	const router = useRouter();
	const queryClient = useQueryClient();
	const slug = params.slug as string;

	const { data, isLoading, refetch } = useGetProductBySlugQuery({ slug });
	const { data: categoriesData } = useGetCategoriesQuery();
	const updateProductMutation = useUpdateProductMutation();
	const book = data?.productBySlug;
	const categories = categoriesData?.categories || [];

	const [isEditing, setIsEditing] = useState(false);
	const [isUploading, setIsUploading] = useState(false);

	// Form states
	const [editTitle, setEditTitle] = useState("");
	const [editAuthor, setEditAuthor] = useState("");
	const [editIsbn, setEditIsbn] = useState("");
	const [editCategory, setEditCategory] = useState("Fiction");
	const [editPrice, setEditPrice] = useState("120");
	const [editStock, setEditStock] = useState("50");
	const [editLanguage, setEditLanguage] = useState("English");
	const [editRibbon, setEditRibbon] = useState("");
	const [editDescription, setEditDescription] = useState("");
	const [editPublisher, setEditPublisher] = useState("");
	const [editCoverImage, setEditCoverImage] = useState("");

	useEffect(() => {
		if (book && !isEditing) {
			setEditTitle(book.title || "");
			setEditAuthor(book.author || "");
			setEditIsbn(book.isbn || "");
			setEditCategory(book.categoryId || categories.find((c: any) => c.name === book.categoryName)?.id || "");
			setEditPrice(book.price ? book.price.toString() : "0");
			setEditStock(book.stock ? book.stock.toString() : "0");
			setEditLanguage(book.language || "English");
			setEditRibbon(book.ribbon || "");
			setEditDescription(book.description || "");
			setEditPublisher(book.publisher || "");
			setEditCoverImage(book.coverImage || "");
		}
	}, [book, isEditing]);

	if (isLoading) {
		return (
			<div className="flex h-64 items-center justify-center">
				<div className="text-slate-500">Loading book details...</div>
			</div>
		);
	}

	if (!book) {
		return (
			<div className="flex flex-col items-center justify-center space-y-4 py-16 text-center">
				<Package className="h-16 w-16 text-slate-300" />
				<div>
					<h2 className="font-bold text-slate-900 text-xl dark:text-white">
						Book not found
					</h2>
					<p className="text-slate-500">
						The book you are looking for does not exist or has been removed.
					</p>
				</div>
				<Button onClick={() => router.push("/admin/catalog")} variant="outline">
					<ArrowLeft className="mr-2 h-4 w-4" /> Back to Catalog
				</Button>
			</div>
		);
	}

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
				setEditCoverImage(data.url);
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

	const handleSave = async () => {
		const priceNum = parseFloat(editPrice) || 0;
		const stockNum = parseInt(editStock) || 0;
		
		const selectedCat = categories.find((c: any) => c.id === editCategory);

		try {
			await updateProductMutation.mutateAsync({
				id: book.id,
				input: {
					title: editTitle,
					slug: book.slug,
					author: editAuthor,
					isbn: editIsbn,
					categoryId: selectedCat?.id,
					categorySlug: selectedCat?.slug,
					categoryName: selectedCat?.name || book.categoryName,
					price: priceNum,
					originalPrice: 0,
					stock: stockNum,
					language: editLanguage,
					ribbon: editRibbon,
					description: editDescription,
					publisher: editPublisher,
					coverImage: editCoverImage,
				},
			});
			queryClient.invalidateQueries({ queryKey: ["GetProducts"] });
			queryClient.invalidateQueries({ queryKey: ["GetProductBySlug"] });
			setIsEditing(false);
			refetch();
		} catch (error) {
			console.error("Error updating book:", error);
			alert("Failed to update book.");
		}
	};

	return (
		<div className="space-y-6">
			{/* Page Header */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
				<div className="flex items-center gap-4">
					<Button
						onClick={() => router.push("/admin/catalog")}
						size="icon"
						variant="ghost"
					>
						<ArrowLeft className="h-5 w-5" />
					</Button>
					<div>
						<h1 className="flex items-center gap-2 font-bold text-2xl text-slate-900 dark:text-white">
							{isEditing ? "Edit Book" : book.title}
							{!isEditing && (
								book.stock && book.stock > 0 ? (
									<Badge className="ml-2 font-semibold" variant="success">
										<CheckCircle className="mr-1 h-3 w-3" /> In Stock
									</Badge>
								) : (
									<Badge className="ml-2 font-semibold bg-red-100 text-red-700 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400">
										Out of Stock
									</Badge>
								)
							)}
						</h1>
						{!isEditing && (
							<p className="mt-1 flex items-center gap-1.5 text-slate-500 text-sm">
								<BookOpen className="h-4 w-4" /> By {book.author || "Unknown Author"}
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
							<Button
								onClick={handleSave}
								disabled={updateProductMutation.isPending}
								className="gap-2"
							>
								<Save className="h-4 w-4" />
								{updateProductMutation.isPending ? "Saving..." : "Save Changes"}
							</Button>
						</>
					) : (
						<Button
							onClick={() => setIsEditing(true)}
							className="gap-2"
						>
							<Edit className="h-4 w-4" /> Edit Book
						</Button>
					)}
				</div>
			</div>

			<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
				{/* Left Column: Detailed Info */}
				<div className="space-y-6 lg:col-span-2">
					<div className="rounded-lg border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
						<h2 className="mb-4 font-bold text-lg text-slate-900 dark:text-white">
							Book Information
						</h2>
						
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
							<div className="space-y-1">
								<label className="text-xs font-semibold uppercase text-slate-400">Title</label>
								{isEditing ? (
									<Input value={editTitle} onChange={e => setEditTitle(e.target.value)} />
								) : (
									<div className="font-medium text-slate-900 dark:text-white">{book.title}</div>
								)}
							</div>
							
							<div className="space-y-1">
								<label className="text-xs font-semibold uppercase text-slate-400">Author</label>
								{isEditing ? (
									<Input value={editAuthor} onChange={e => setEditAuthor(e.target.value)} />
								) : (
									<div className="font-medium text-slate-900 dark:text-white">{book.author || "N/A"}</div>
								)}
							</div>
							
							<div className="space-y-1">
								<label className="text-xs font-semibold uppercase text-slate-400">Price (AED)</label>
								{isEditing ? (
									<Input type="number" value={editPrice} onChange={e => setEditPrice(e.target.value)} />
								) : (
									<div className="font-medium text-slate-900 dark:text-white">{book.price.toFixed(2)}</div>
								)}
							</div>
							
							{isEditing && (
								<div className="space-y-1">
									<label className="text-xs font-semibold uppercase text-slate-400">Stock</label>
									<Input type="number" value={editStock} onChange={e => setEditStock(e.target.value)} />
								</div>
							)}
							
							<div className="space-y-1">
								<label className="text-xs font-semibold uppercase text-slate-400">ISBN</label>
								{isEditing ? (
									<Input value={editIsbn} onChange={e => setEditIsbn(e.target.value)} />
								) : (
									<div className="font-medium text-slate-900 dark:text-white">{book.isbn || "N/A"}</div>
								)}
							</div>

							<div className="space-y-1">
								<label className="text-xs font-semibold uppercase text-slate-400">Publisher</label>
								{isEditing ? (
									<Input value={editPublisher} onChange={e => setEditPublisher(e.target.value)} />
								) : (
									<div className="font-medium text-slate-900 dark:text-white">{book.publisher || "N/A"}</div>
								)}
							</div>
							
							<div className="space-y-1">
								<label className="text-xs font-semibold uppercase text-slate-400">Category</label>
								{isEditing ? (
									<select
										value={editCategory}
										onChange={(e) => setEditCategory(e.target.value)}
										className="w-full h-9 rounded-lg border border-input bg-background px-2.5 text-sm focus:ring-1 focus:ring-primary"
									>
										<option value="">Select Category</option>
										{categories.map((cat: any) => (
											<option key={cat.id} value={cat.id}>
												{cat.name}
											</option>
										))}
									</select>
								) : (
									<div className="font-medium text-slate-900 dark:text-white">{book.categoryName || "N/A"}</div>
								)}
							</div>

							<div className="space-y-1">
								<label className="text-xs font-semibold uppercase text-slate-400">Language</label>
								{isEditing ? (
									<select
										value={editLanguage}
										onChange={(e) => setEditLanguage(e.target.value)}
										className="w-full h-9 rounded-lg border border-input bg-background px-2.5 text-sm focus:ring-1 focus:ring-primary"
									>
										<option value="English">English</option>
										<option value="Arabic">Arabic</option>
										<option value="Bilingual">Bilingual</option>
									</select>
								) : (
									<div className="font-medium text-slate-900 dark:text-white">{book.language || "N/A"}</div>
								)}
							</div>
							


							<div className="space-y-1">
								<label className="text-xs font-semibold uppercase text-slate-400">Ribbon/Badge</label>
								{isEditing ? (
									<Input value={editRibbon} onChange={e => setEditRibbon(e.target.value)} />
								) : (
									<div className="font-medium text-slate-900 dark:text-white">
										{book.ribbon ? <Badge variant="secondary">{book.ribbon}</Badge> : "None"}
									</div>
								)}
							</div>
						</div>
					</div>

					<div className="rounded-lg border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
						<h2 className="mb-4 font-bold text-lg text-slate-900 dark:text-white">
							Description
						</h2>
						{isEditing ? (
							<textarea
								value={editDescription}
								onChange={(e) => setEditDescription(e.target.value)}
								className="w-full min-h-[150px] rounded-lg border border-input bg-background p-3 text-sm focus:ring-1 focus:ring-primary"
							/>
						) : (
							<p className="text-slate-600 dark:text-slate-400 whitespace-pre-wrap">
								{book.description || "No description provided."}
							</p>
						)}
					</div>
				</div>

				{/* Right Column: Image & Status */}
				<div className="space-y-6">
					{/* Cover Image */}
					<div className="rounded-lg border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
						<h2 className="mb-4 font-bold text-lg text-slate-900 dark:text-white">
							Cover Image
						</h2>
						<div className="flex flex-col items-center justify-center space-y-4">
							{isEditing ? (
								<div className="w-full">
									<Input
										type="file"
										accept="image/*"
										onChange={handleImageUpload}
										disabled={isUploading}
										className="w-full cursor-pointer file:mr-4 file:rounded-full file:border-0 file:bg-primary/10 file:px-4 file:py-1 file:text-xs file:font-semibold file:text-primary hover:file:bg-primary/20"
									/>
									{isUploading && (
										<div className="mt-2 text-xs text-slate-500 animate-pulse">
											Uploading...
										</div>
									)}
								</div>
							) : null}

							{editCoverImage || book.coverImage ? (
								<Image
									src={isEditing ? editCoverImage : book.coverImage || ""}
									alt={book.title}
									width={300}
									height={450}
									className="rounded-md object-cover shadow-sm"
								/>
							) : (
								<div className="flex h-[300px] w-full flex-col items-center justify-center rounded-md bg-slate-50 text-slate-400 dark:bg-slate-800/50">
									<ImageIcon className="h-10 w-10 mb-2" />
									<span>No cover image</span>
								</div>
							)}
						</div>
					</div>
					
					{/* Key Metrics */}
					{!isEditing && (
						<div className="rounded-lg border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
							<h2 className="mb-4 font-bold text-lg text-slate-900 dark:text-white">
								Availability
							</h2>
							<div className="space-y-3">
								<div className="flex justify-between border-b border-slate-100 pb-2 text-sm dark:border-slate-800">
									<span className="text-slate-500">Current Stock</span>
									<span className="font-medium text-slate-900 dark:text-white">
										{book.stock || 0} units
									</span>
								</div>
								<div className="flex justify-between border-b border-slate-100 pb-2 text-sm dark:border-slate-800">
									<span className="text-slate-500">Category</span>
									<span className="font-medium text-slate-900 dark:text-white">
										{book.categoryName || "Uncategorized"}
									</span>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
