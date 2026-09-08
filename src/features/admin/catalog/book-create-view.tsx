"use client";

import * as React from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import { ArrowLeft, BookOpen, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
	useCreateProductMutation,
	useGetCategoriesQuery,
} from "@/types/graphql";

export function BookCreateView() {
	const router = useRouter();
	const queryClient = useQueryClient();
	const createProductMutation = useCreateProductMutation();
	const { data: categoriesData } = useGetCategoriesQuery();
	const categories = categoriesData?.categories || [];

	const [newTitle, setNewTitle] = React.useState("");
	const [newAuthor, setNewAuthor] = React.useState("");
	const [newIsbn, setNewIsbn] = React.useState("");
	const [newCategoryIds, setNewCategoryIds] = React.useState<string[]>([]);
	const [newPrice, setNewPrice] = React.useState("120");
	const [newStock, setNewStock] = React.useState("50");
	const [newLanguage, setNewLanguage] = React.useState("English");
	const [newRibbon, setNewRibbon] = React.useState("");
	const [newDescription, setNewDescription] = React.useState("");
	const [newPublisher, setNewPublisher] = React.useState("");
	const [newCoverImage, setNewCoverImage] = React.useState("");
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
				setNewCoverImage(data.url);
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

	const handleAddBook = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!newTitle) return;

		const priceNum = Number.parseFloat(newPrice) || 0;
		const stockNum = Number.parseInt(newStock) || 0;

		const selectedCats = categories.filter((c: any) => newCategoryIds.includes(c.id));

		try {
			await createProductMutation.mutateAsync({
				input: {
					title: newTitle,
					slug:
						newTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-") +
						"-" +
						Date.now(),
					author: newAuthor,
					isbn: newIsbn,
					categoryIds: selectedCats.map((c: any) => c.id),
					categoryId: selectedCats.length > 0 ? selectedCats[0].id : undefined,
					categorySlug: selectedCats.length > 0 ? selectedCats[0].slug : undefined,
					categoryName: selectedCats.length > 0 ? selectedCats[0].name : undefined,
					price: priceNum,
					originalPrice: 0,
					stock: stockNum,
					language: newLanguage,
					ribbon: newRibbon,
					description: newDescription,
					publisher: newPublisher,
					coverImage: newCoverImage,
				},
			});
			queryClient.invalidateQueries({ queryKey: ["GetProducts"] });
			router.push("/admin/catalog/books");
			router.refresh();
		} catch (error) {
			console.error("Failed to create book", error);
		}
	};

	return (
		<div className="space-y-6">
			<div className="flex flex-col justify-between gap-4 rounded-lg border border-slate-200/80 bg-white p-5 shadow-xs sm:flex-row sm:items-center dark:border-slate-800 dark:bg-slate-900">
				<div>
					<div className="flex items-center gap-2">
						<BookOpen className="h-5 w-5 text-primary" />
						<h1 className="font-extrabold text-slate-900 text-xl dark:text-white">
							Add New Book Title
						</h1>
					</div>
					<p className="mt-1 text-slate-500 text-sm">
						Enter the catalog information for the new book entry.
					</p>
				</div>
				<Link href="/admin/catalog/books">
					<Button className="h-10 gap-2 px-4 text-sm"variant="outline" >
						<ArrowLeft className="h-4 w-4" /> Back to Books
					</Button>
				</Link>
			</div>

			<form className="grid max-w-5xl grid-cols-1 gap-6 lg:grid-cols-3"onSubmit={handleAddBook} >
				<div className="space-y-6 rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm lg:col-span-2 dark:border-slate-800 dark:bg-slate-900">
					<div className="space-y-2">
						<label className="font-semibold text-slate-700 dark:text-slate-300">
							Book Title *
						</label>
						<Input
							className="h-10 text-sm"
							onChange={(e) => setNewTitle(e.target.value)}
							placeholder="e.g. Al-Rewaya Chronicles"
							required
							value={newTitle}
						/>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<label className="font-semibold text-slate-700 dark:text-slate-300">
								Author Name *
							</label>
							<Input
								className="h-10 text-sm"
								onChange={(e) => setNewAuthor(e.target.value)}
								placeholder="Author full name"
								required
								value={newAuthor}
							/>
						</div>
						<div className="space-y-2">
							<label className="font-semibold text-slate-700 dark:text-slate-300">
								ISBN / SKU
							</label>
							<Input
								className="h-10 text-sm"
								onChange={(e) => setNewIsbn(e.target.value)}
								placeholder="978-xxxxxxxxx"
								value={newIsbn}
							/>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<label className="font-semibold text-slate-700 dark:text-slate-300">
								Publisher
							</label>
							<Input
								className="h-10 text-sm"
								onChange={(e) => setNewPublisher(e.target.value)}
								placeholder="Publisher name"
								value={newPublisher}
							/>
						</div>
						<div className="space-y-2">
							<label className="font-semibold text-slate-700 dark:text-slate-300">
								Ribbon
							</label>
							<Input
								className="h-10 text-sm"
								onChange={(e) => setNewRibbon(e.target.value)}
								placeholder="e.g. Best Seller"
								value={newRibbon}
							/>
						</div>
					</div>

					<div className="space-y-2">
						<label className="font-semibold text-slate-700 dark:text-slate-300">
							Description
						</label>
						<textarea
							className="min-h-[120px] w-full rounded-lg border border-input bg-background p-3 text-sm focus:ring-1 focus:ring-primary"
							onChange={(e) => setNewDescription(e.target.value)}
							placeholder="Book description..."
							value={newDescription}
						/>
					</div>



					<div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
						<div className="space-y-2">
							<label className="font-semibold text-slate-700 dark:text-slate-300">
								Category
							</label>
							<div className="max-h-40 overflow-y-auto rounded-lg border border-input bg-background p-3">
								<div className="flex flex-col gap-2">
									{categories.map((cat: any) => (
										<label key={cat.id} className="flex items-center gap-2 text-sm">
											<input
												type="checkbox"
												className="rounded border-slate-300 text-primary focus:ring-primary"
												checked={newCategoryIds.includes(cat.id)}
												onChange={(e) => {
													if (e.target.checked) {
														setNewCategoryIds((prev) => [...prev, cat.id]);
													} else {
														setNewCategoryIds((prev) =>
															prev.filter((id) => id !== cat.id)
														);
													}
												}}
											/>
											{cat.name}
										</label>
									))}
								</div>
							</div>
						</div>
						<div className="space-y-2">
							<label className="font-semibold text-slate-700 dark:text-slate-300">
								Language
							</label>
							<select
								className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm focus:ring-1 focus:ring-primary"
								onChange={(e) => setNewLanguage(e.target.value)}
								value={newLanguage}
							>
								<option value="English">English</option>
								<option value="Arabic">Arabic</option>
								<option value="Bilingual">Bilingual</option>
							</select>
						</div>
						<div className="space-y-2">
							<label className="font-semibold text-slate-700 dark:text-slate-300">
								Price (AED)
							</label>
							<Input
								className="h-10 text-sm"
								onChange={(e) => setNewPrice(e.target.value)}
								type="number"
								value={newPrice}
							/>
						</div>
						<div className="space-y-2">
							<label className="font-semibold text-slate-700 dark:text-slate-300">
								Stock
							</label>
							<Input
								className="h-10 text-sm"
								onChange={(e) => setNewStock(e.target.value)}
								type="number"
								value={newStock}
							/>
						</div>
					</div>
				</div>

				<div className="space-y-6 lg:col-span-1">
					<div className="space-y-4 rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
						<h2 className="font-bold text-lg text-slate-900 dark:text-white">
							Cover Image
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
							{newCoverImage ? (
								<div className="relative mx-auto mt-4 aspect-[2/3] w-full max-w-[200px] overflow-hidden rounded-lg border border-slate-200 shadow-sm">
									<img
										alt="Cover Preview"
										className="h-full w-full object-cover"
										src={newCoverImage}
									/>
								</div>
							) : (
								<div className="mx-auto mt-4 flex aspect-[2/3] w-full max-w-[200px] flex-col items-center justify-center rounded-lg border border-slate-300 border-dashed bg-slate-50 text-slate-400 dark:border-slate-700 dark:bg-slate-800/50">
									<span className="text-sm">No image uploaded</span>
								</div>
							)}
						</div>
					</div>

					<div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
						<Button className="h-11 w-full gap-2" disabled={createProductMutation.isPending}type="submit" >
							<Save className="h-4 w-4" /> 
							{createProductMutation.isPending ? "Saving..." : "Save Book Title"}
						</Button>
					</div>
				</div>
			</form>
	</div>
	)
}
