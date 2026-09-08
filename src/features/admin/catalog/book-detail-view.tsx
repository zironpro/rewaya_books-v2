"use client";

import React, { useEffect, useState } from "react";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

import { useQueryClient } from "@tanstack/react-query";
import {
	ArrowLeft,
	BookOpen,
	CheckCircle,
	Edit,
	Image as ImageIcon,
	Package,
	Save,
	X,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
	useGetCategoriesQuery,
	useGetProductBySlugQuery,
	useUpdateProductMutation,
} from "@/types/graphql";

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
			setEditCategory(
				book.categoryId ||
					categories.find((c: any) => c.name === book.categoryName)?.id ||
					""
			);
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
		const priceNum = Number.parseFloat(editPrice) || 0;
		const stockNum = Number.parseInt(editStock) || 0;

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
			<div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
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
							{!isEditing &&
								(book.stock && book.stock > 0 ? (
									<Badge className="ml-2 font-semibold" variant="success">
										<CheckCircle className="mr-1 h-3 w-3" /> In Stock
									</Badge>
								) : (
									<Badge className="ml-2 bg-red-100 font-semibold text-red-700 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400">
										Out of Stock
									</Badge>
								))}
						</h1>
						{!isEditing && (
							<p className="mt-1 flex items-center gap-1.5 text-slate-500 text-sm">
								<BookOpen className="h-4 w-4" /> By{" "}
								{book.author || "Unknown Author"}
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
							<Button
								className="gap-2"
								disabled={updateProductMutation.isPending}
								onClick={handleSave}
							>
								<Save className="h-4 w-4" />
								{updateProductMutation.isPending ? "Saving..." : "Save Changes"}
							</Button>
						</>
					) : (
						<Button className="gap-2" onClick={() => setIsEditing(true)}>
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

						<div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
							<div className="space-y-1">
								<label className="font-semibold text-slate-400 text-xs uppercase">
									Title
								</label>
								{isEditing ? (
									<Input
										onChange={(e) => setEditTitle(e.target.value)}
										value={editTitle}
									/>
								) : (
									<div className="font-medium text-slate-900 dark:text-white">
										{book.title}
									</div>
								)}
							</div>

							<div className="space-y-1">
								<label className="font-semibold text-slate-400 text-xs uppercase">
									Author
								</label>
								{isEditing ? (
									<Input
										onChange={(e) => setEditAuthor(e.target.value)}
										value={editAuthor}
									/>
								) : (
									<div className="font-medium text-slate-900 dark:text-white">
										{book.author || "N/A"}
									</div>
								)}
							</div>

							<div className="space-y-1">
								<label className="font-semibold text-slate-400 text-xs uppercase">
									Price (AED)
								</label>
								{isEditing ? (
									<Input
										onChange={(e) => setEditPrice(e.target.value)}
										type="number"
										value={editPrice}
									/>
								) : (
									<div className="font-medium text-slate-900 dark:text-white">
										{book.price.toFixed(2)}
									</div>
								)}
							</div>

							{isEditing && (
								<div className="space-y-1">
									<label className="font-semibold text-slate-400 text-xs uppercase">
										Stock
									</label>
									<Input
										onChange={(e) => setEditStock(e.target.value)}
										type="number"
										value={editStock}
									/>
								</div>
							)}

							<div className="space-y-1">
								<label className="font-semibold text-slate-400 text-xs uppercase">
									ISBN
								</label>
								{isEditing ? (
									<Input
										onChange={(e) => setEditIsbn(e.target.value)}
										value={editIsbn}
									/>
								) : (
									<div className="font-medium text-slate-900 dark:text-white">
										{book.isbn || "N/A"}
									</div>
								)}
							</div>

							<div className="space-y-1">
								<label className="font-semibold text-slate-400 text-xs uppercase">
									Publisher
								</label>
								{isEditing ? (
									<Input
										onChange={(e) => setEditPublisher(e.target.value)}
										value={editPublisher}
									/>
								) : (
									<div className="font-medium text-slate-900 dark:text-white">
										{book.publisher || "N/A"}
									</div>
								)}
							</div>

							<div className="space-y-1">
								<label className="font-semibold text-slate-400 text-xs uppercase">
									Category
								</label>
								{isEditing ? (
									<select
										className="h-9 w-full rounded-lg border border-input bg-background px-2.5 text-sm focus:ring-1 focus:ring-primary"
										onChange={(e) => setEditCategory(e.target.value)}
										value={editCategory}
									>
										<option value="">Select Category</option>
										{categories.map((cat: any) => (
											<option key={cat.id} value={cat.id}>
												{cat.name}
											</option>
										))}
									</select>
								) : (
									<div className="font-medium text-slate-900 dark:text-white">
										{book.categoryName || "N/A"}
									</div>
								)}
							</div>

							<div className="space-y-1">
								<label className="font-semibold text-slate-400 text-xs uppercase">
									Language
								</label>
								{isEditing ? (
									<select
										className="h-9 w-full rounded-lg border border-input bg-background px-2.5 text-sm focus:ring-1 focus:ring-primary"
										onChange={(e) => setEditLanguage(e.target.value)}
										value={editLanguage}
									>
										<option value="English">English</option>
										<option value="Arabic">Arabic</option>
										<option value="Bilingual">Bilingual</option>
									</select>
								) : (
									<div className="font-medium text-slate-900 dark:text-white">
										{book.language || "N/A"}
									</div>
								)}
							</div>

							<div className="space-y-1">
								<label className="font-semibold text-slate-400 text-xs uppercase">
									Ribbon/Badge
								</label>
								{isEditing ? (
									<Input
										onChange={(e) => setEditRibbon(e.target.value)}
										value={editRibbon}
									/>
								) : (
									<div className="font-medium text-slate-900 dark:text-white">
										{book.ribbon ? (
											<Badge variant="secondary">{book.ribbon}</Badge>
										) : (
											"None"
										)}
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
								className="min-h-[150px] w-full rounded-lg border border-input bg-background p-3 text-sm focus:ring-1 focus:ring-primary"
								onChange={(e) => setEditDescription(e.target.value)}
								value={editDescription}
							/>
						) : (
							<p className="whitespace-pre-wrap text-slate-600 dark:text-slate-400">
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
										accept="image/*"
										className="w-full cursor-pointer file:mr-4 file:rounded-full file:border-0 file:bg-primary/10 file:px-4 file:py-1 file:font-semibold file:text-primary file:text-xs hover:file:bg-primary/20"
										disabled={isUploading}
										onChange={handleImageUpload}
										type="file"
									/>
									{isUploading && (
										<div className="mt-2 animate-pulse text-slate-500 text-xs">
											Uploading...
										</div>
									)}
								</div>
							) : null}

							{editCoverImage || book.coverImage ? (
								<Image
									alt={book.title}
									className="rounded-md object-cover shadow-sm"
									height={450}
									src={isEditing ? editCoverImage : book.coverImage || ""}
									width={300}
								/>
							) : (
								<div className="flex h-[300px] w-full flex-col items-center justify-center rounded-md bg-slate-50 text-slate-400 dark:bg-slate-800/50">
									<ImageIcon className="mb-2 h-10 w-10" />
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
								<div className="flex justify-between border-slate-100 border-b pb-2 text-sm dark:border-slate-800">
									<span className="text-slate-500">Current Stock</span>
									<span className="font-medium text-slate-900 dark:text-white">
										{book.stock || 0} units
									</span>
								</div>
								<div className="flex justify-between border-slate-100 border-b pb-2 text-sm dark:border-slate-800">
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
