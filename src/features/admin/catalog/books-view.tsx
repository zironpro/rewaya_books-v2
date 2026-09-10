"use client";

import * as React from "react";

import Link from "next/link";

import {
	ArrowDownToLine,
	ArrowUpToLine,
	BookOpen,
	Check,
	Download,
	Eye,
	GripVertical,
	Plus,
	Save,
	Search,
	SlidersHorizontal,
	Trash2,
	Upload,
} from "lucide-react";
import Papa from "papaparse";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import {
	useCreateProductMutation,
	useDeleteProductMutation,
	useGetCategoriesQuery,
	useGetProductsPaginatedQuery,
	useUpdateProductMutation,
	useUpdateProductsSortOrderMutation,
} from "@/types/graphql";

const initialBooks = [
	{
		id: "BK-1001",
		sortOrder: 1,
		title: "The Palace of Dreams",
		author: "Ismail Kadare",
		isbn: "978-0385497046",
		category: "Fiction",
		price: 245.0,
		originalPrice: 295.0,
		stock: 48,
		language: "English",
		rating: 4.8,
		status: "In Stock",
	},
	{
		id: "BK-1002",
		sortOrder: 2,
		title: "Desert Tales Vol. 2 (Signed Edition)",
		author: "Tariq Mansoor",
		isbn: "978-1841584321",
		category: "Arabic",
		price: 180.0,
		originalPrice: 220.0,
		stock: 12,
		language: "Arabic",
		rating: 4.9,
		status: "Low Stock",
	},
	{
		id: "BK-1003",
		sortOrder: 3,
		title: "History of Modern Arabia",
		author: "Dr. Sultan Al-Qasimi",
		isbn: "978-0521873041",
		category: "Biography",
		price: 120.0,
		originalPrice: 150.0,
		stock: 150,
		language: "English",
		rating: 4.7,
		status: "In Stock",
	},
	{
		id: "BK-1004",
		sortOrder: 4,
		title: "Children Arabic Fables 3+",
		author: "Fatima Al-Zahra",
		isbn: "978-9948012345",
		category: "Children Books",
		price: 85.0,
		originalPrice: 110.0,
		stock: 320,
		language: "Arabic",
		rating: 5.0,
		status: "In Stock",
	},
	{
		id: "BK-1005",
		sortOrder: 5,
		title: "Psychology of Success in Commerce",
		author: "Rashid Ben Saeed",
		isbn: "978-0062457714",
		category: "Business",
		price: 140.0,
		originalPrice: 165.0,
		stock: 0,
		language: "English",
		rating: 4.6,
		status: "Out of Stock",
	},
];

export function BooksView() {
	const [searchQuery, setSearchQuery] = React.useState("");
	const [debouncedSearch, setDebouncedSearch] = React.useState("");
	const [selectedCategory, setSelectedCategory] = React.useState("All");
	const [sortBy, setSortBy] = React.useState("custom");
	const [isSaved, setIsSaved] = React.useState(false);
	const [page, setPage] = React.useState(1);
	const [itemsPerPage, setItemsPerPage] = React.useState(50);

	React.useEffect(() => {
		const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300);
		return () => clearTimeout(timer);
	}, [searchQuery]);

	const { data, isLoading, refetch, isFetching } = useGetProductsPaginatedQuery(
		{
			page,
			limit: itemsPerPage,
			q: debouncedSearch || undefined,
			category: selectedCategory === "All" ? undefined : selectedCategory,
			sort: sortBy === "custom" ? undefined : sortBy,
		}
	);

	// Reset page when filters change
	React.useEffect(() => {
		setPage(1);
	}, [debouncedSearch, selectedCategory, sortBy]);

	const { data: categoriesData } = useGetCategoriesQuery();
	const createProductMutation = useCreateProductMutation();
	const deleteProductMutation = useDeleteProductMutation();
	const updateProductMutation = useUpdateProductMutation();
	const updateProductsSortOrderMutation = useUpdateProductsSortOrderMutation();

	const fetchedBooks = data?.productsPaginated?.items || [];
	const totalCount = data?.productsPaginated?.totalCount || 0;
	const totalPages = data?.productsPaginated?.totalPages || 0;
	const categories = categoriesData?.categories || [];

	// Drag and Drop States
	const [orderedBooks, setOrderedBooks] = React.useState<any[]>([]);
	const [draggedIndex, setDraggedIndex] = React.useState<number | null>(null);
	const [dragOverIndex, setDragOverIndex] = React.useState<number | null>(null);
	const observerTarget = React.useRef(null);

	React.useEffect(() => {
		if (fetchedBooks.length > 0) {
			if (page === 1) {
				setOrderedBooks([...fetchedBooks]);
			} else {
				setOrderedBooks((prev) => {
					const existingIds = new Set(prev.map((b) => b.id));
					const newBooks = fetchedBooks.filter(
						(b: any) => !existingIds.has(b.id)
					);
					return [...prev, ...newBooks];
				});
			}
		} else if (page === 1) {
			setOrderedBooks([]);
		}
	}, [fetchedBooks, page]);

	React.useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && page < totalPages && !isFetching) {
					setPage((p) => p + 1);
				}
			},
			{ threshold: 1.0 }
		);

		if (observerTarget.current) {
			observer.observe(observerTarget.current);
		}

		return () => {
			if (observerTarget.current) {
				observer.unobserve(observerTarget.current);
			}
		};
	}, [page, totalPages, isFetching]);

	const [isUploadingBulk, setIsUploadingBulk] = React.useState(false);
	const fileInputRef = React.useRef<HTMLInputElement>(null);

	const [importProgress, setImportProgress] = React.useState({
		isOpen: false,
		isUploading: false,
		total: 0,
		processed: 0,
		updated: 0,
		added: 0,
		errors: [] as string[],
	});

	React.useEffect(() => {
		const handleBeforeUnload = (e: BeforeUnloadEvent) => {
			if (importProgress.isUploading) {
				e.preventDefault();
				e.returnValue =
					"Import is in progress. Are you sure you want to leave? Products will not be completely imported.";
			}
		};
		window.addEventListener("beforeunload", handleBeforeUnload);
		return () => window.removeEventListener("beforeunload", handleBeforeUnload);
	}, [importProgress.isUploading]);

	const handleBulkUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return;

		setIsUploadingBulk(true);
		Papa.parse(file, {
			header: true,
			skipEmptyLines: true,
			complete: async (results) => {
				const rows = results.data as any[];
				let updatedCount = 0;
				let addedCount = 0;
				const errorList: string[] = [];

				setImportProgress({
					isOpen: true,
					isUploading: true,
					total: rows.length,
					processed: 0,
					updated: 0,
					added: 0,
					errors: [],
				});

				for (let i = 0; i < rows.length; i++) {
					const row = rows[i];
					try {
						const priceNum = Number.parseFloat(row.price) || 0;
						const stockNum = Number.parseInt(row.stock) || 0;
						const categoryNames = row.categoryName
							? row.categoryName
									.split(",")
									.map((s: string) => s.trim())
									.filter(Boolean)
							: [];

						const selectedCats = categoryNames
							.map((catName: string) => {
								const searchName = catName.toLowerCase();
								return categories.find(
									(c: any) =>
										c.name.toLowerCase() === searchName ||
										c.slug.toLowerCase() === searchName ||
										c.name.toLowerCase().includes(searchName) ||
										searchName.includes(c.name.toLowerCase())
								);
							})
							.filter(Boolean);

						const primaryCat =
							selectedCats.length > 0 ? selectedCats[0] : undefined;

						const productInput = {
							title: row.title || "Untitled Book",
							slug:
								row.slug ||
								(row.title || "untitled-book")
									.toLowerCase()
									.replace(/[^a-z0-9]+/g, "-") +
									"-" +
									Date.now(),
							author: row.author || "",
							isbn: row.isbn || "",
							categoryIds: selectedCats.map((c: any) => c.id),
							categoryId: primaryCat?.id || undefined,
							categorySlug: primaryCat?.slug || undefined,
							categoryName: primaryCat?.name || undefined,
							price: priceNum,
							originalPrice: priceNum * 1.2,
							stock: stockNum,
							language: row.language || "English",
							ribbon: row.ribbon || "",
							description: row.description || "",
							publisher: row.publisher || "",
							coverImage: row.coverImage || "",
							sortOrder: row.sortOrder
								? Number.parseInt(row.sortOrder)
								: undefined,
						} as any;

						const existingBook = row.isbn
							? orderedBooks.find((b: any) => b.isbn === row.isbn)
							: null;

						if (existingBook) {
							await updateProductMutation.mutateAsync({
								id: existingBook.id,
								input: productInput,
							});
							updatedCount++;
						} else if (row.id) {
							await updateProductMutation.mutateAsync({
								id: row.id,
								input: productInput,
							});
							updatedCount++;
						} else {
							await createProductMutation.mutateAsync({
								input: productInput,
							});
							addedCount++;
						}
					} catch (error) {
						console.error("Failed to add book from CSV row", row, error);
						errorList.push(
							row.title || `Row ${i + 1} (ISBN: ${row.isbn || "N/A"})`
						);
					}

					if (i % 5 === 0) {
						setImportProgress((prev) => ({
							...prev,
							processed: i + 1,
							updated: updatedCount,
							added: addedCount,
						}));
					}
				}

				setImportProgress((prev) => ({
					...prev,
					isUploading: false,
					processed: rows.length,
					updated: updatedCount,
					added: addedCount,
					errors: errorList,
				}));
				setIsUploadingBulk(false);
				if (fileInputRef.current) fileInputRef.current.value = "";
				refetch();
			},
			error: (error) => {
				console.error("CSV Parse Error", error);
				alert("Error parsing CSV file.");
				setIsUploadingBulk(false);
				if (fileInputRef.current) fileInputRef.current.value = "";
			},
		});
	};

	const handleExportBulk = () => {
		// Use orderedBooks for export so it includes all loaded pages
		const exportData = orderedBooks.map((book: any) => ({
			id: book.id || "",
			slug: book.slug || "",
			title: book.title || "",
			author: book.author || "",
			isbn: book.isbn || "",
			categoryName:
				book.categories && book.categories.length > 0
					? book.categories.map((c: any) => c.name).join(", ")
					: book.categoryName || "",
			price: book.price || 0,
			stock: book.stock || 0,
			language: book.language || "English",
			ribbon: book.ribbon || "",
			description: book.description || "",
			publisher: book.publisher || "",
			coverImage: book.coverImage || "",
			sortOrder: book.sortOrder || 0,
		}));
		const csv = Papa.unparse(exportData);
		const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.setAttribute(
			"download",
			`books_export_${new Date().toISOString().split("T")[0]}.csv`
		);
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	// New book form state removed (moved to separate page)

	// Edit book form state
	const [editingBook, setEditingBook] = React.useState<any>(null);
	const [editTitle, setEditTitle] = React.useState("");
	const [editAuthor, setEditAuthor] = React.useState("");
	const [editIsbn, setEditIsbn] = React.useState("");
	const [editCategoryIds, setEditCategoryIds] = React.useState<string[]>([]);
	const [editPrice, setEditPrice] = React.useState("120");
	const [editStock, setEditStock] = React.useState("50");
	const [editLanguage, setEditLanguage] = React.useState("English");
	const [editRibbon, setEditRibbon] = React.useState("");
	const [editDescription, setEditDescription] = React.useState("");
	const [editPublisher, setEditPublisher] = React.useState("");
	const [editCoverImage, setEditCoverImage] = React.useState("");
	const [isUploading, setIsUploading] = React.useState(false);

	const handleImageUpload = async (
		e: React.ChangeEvent<HTMLInputElement>,
		isEdit: boolean
	) => {
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
				if (isEdit) {
					setEditCoverImage(data.url);
				}
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

	const openEditModal = (book: any) => {
		setEditingBook(book);
		setEditTitle(book.title || "");
		setEditAuthor(book.author || "");
		setEditIsbn(book.isbn || "");
		const ids = book.categoryIds || [];
		if (ids.length === 0 && book.categoryId) ids.push(book.categoryId);
		setEditCategoryIds(ids);
		setEditPrice(book.price ? book.price.toString() : "0");
		setEditStock(book.stock ? book.stock.toString() : "0");
		setEditLanguage(book.language || "English");
		setEditRibbon(book.ribbon || "");
		setEditDescription(book.description || "");
		setEditPublisher(book.publisher || "");
		setEditCoverImage(book.coverImage || "");
	};

	// Reorder list helper function
	const reorderList = (fromIndex: number, toIndex: number) => {
		if (searchQuery || selectedCategory !== "All") return; // Prevent drag drop while filtering
		const newArr = [...orderedBooks];
		const [removed] = newArr.splice(fromIndex, 1);
		newArr.splice(toIndex, 0, removed);
		setOrderedBooks(newArr);
	};

	const moveToTop = (index: number) => {
		reorderList(index, 0);
	};

	const moveToBottom = (index: number) => {
		reorderList(index, orderedBooks.length - 1);
	};

	// Move book position up or down via buttons
	const moveBook = (index: number, direction: "up" | "down") => {
		const targetIndex = direction === "up" ? index - 1 : index + 1;
		if (targetIndex < 0 || targetIndex >= orderedBooks.length) return;
		reorderList(index, targetIndex);
	};

	const handleSaveOrder = async () => {
		setIsSaved(true);
		try {
			const updates = orderedBooks.map((book, index) => ({
				id: book.id,
				sortOrder: index,
			}));
			await updateProductsSortOrderMutation.mutateAsync({ updates });
			refetch();
		} catch (error) {
			console.error("Failed to save order", error);
		}
		setTimeout(() => setIsSaved(false), 3000);
	};

	// Filter & Sort books
	const handleDeleteBook = async (id: string) => {
		if (!confirm("Are you sure you want to delete this book?")) return;
		try {
			await deleteProductMutation.mutateAsync({ id });
			refetch();
		} catch (error) {
			console.error("Failed to delete book", error);
		}
	};

	const getProcessedBooks = () => {
		// Sorting and filtering are now handled by the backend!
		return orderedBooks;
	};

	const processedBooks = getProcessedBooks();

	// handleAddBook removed (moved to separate page)

	const handleEditBook = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!editingBook || !editTitle) return;

		const priceNum = Number.parseFloat(editPrice) || 0;
		const stockNum = Number.parseInt(editStock) || 0;
		const selectedCats = categories.filter((c: any) =>
			editCategoryIds.includes(c.id)
		);
		const primaryCat = selectedCats.length > 0 ? selectedCats[0] : undefined;

		try {
			await updateProductMutation.mutateAsync({
				id: editingBook.id,
				input: {
					title: editTitle,
					slug:
						editTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-") +
						"-" +
						Date.now(),
					author: editAuthor,
					isbn: editIsbn,
					categoryIds: selectedCats.map((c: any) => c.id),
					categoryId: primaryCat?.id,
					categorySlug: primaryCat?.slug,
					categoryName: primaryCat?.name || editCategoryIds.join(","),
					price: priceNum,
					originalPrice: priceNum * 1.2,
					stock: stockNum,
					language: editLanguage,
					ribbon: editRibbon,
					description: editDescription,
					publisher: editPublisher,
					coverImage: editCoverImage,
				},
			});
			setEditingBook(null);
			refetch();
		} catch (error) {
			console.error("Failed to update book", error);
		}
	};

	return (
		<div className="space-y-6">
			{/* Header Banner */}
			<div className="flex flex-col justify-between gap-4 rounded-lg border border-slate-200/80 bg-white p-5 shadow-xs sm:flex-row sm:items-center dark:border-slate-800 dark:bg-slate-900">
				<div>
					<div className="flex items-center gap-2">
						<BookOpen className="h-5 w-5 text-primary" />
						<h1 className="font-extrabold text-slate-900 text-xl dark:text-white">
							Books Catalog & Drag-and-Drop Reordering
						</h1>
					</div>
					<p className="mt-1 text-slate-500 text-sm">
						Drag and move book rows to arrange storefront display order, manage
						ISBNs, and update AED prices.
					</p>
				</div>

				<div className="flex items-center gap-2 self-start sm:self-auto">
					<Button
						className="h-10 gap-1.5 border-emerald-500/40 text-emerald-700 text-sm hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/30"
						onClick={handleSaveOrder}
						size="sm"
						variant="outline"
					>
						{isSaved ? (
							<Check className="h-4 w-4" />
						) : (
							<Save className="h-4 w-4" />
						)}
						{isSaved ? "Custom Order Saved!" : "Save Custom Order"}
					</Button>

					<input
						accept=".csv"
						className="hidden"
						onChange={handleBulkUpload}
						ref={fileInputRef}
						type="file"
					/>
					<Button
						className="h-10 gap-2 px-4 font-semibold text-sm"
						disabled={isUploadingBulk}
						onClick={() => fileInputRef.current?.click()}
						size="sm"
						variant="outline"
					>
						<Upload className="h-4 w-4" />
						{isUploadingBulk ? "Uploading..." : "Bulk Upload CSV"}
					</Button>

					<Button
						className="h-10 gap-2 px-4 font-semibold text-sm"
						onClick={handleExportBulk}
						size="sm"
						variant="outline"
					>
						<Download className="h-4 w-4" />
						Export CSV
					</Button>

					<Link href="/admin/catalog/books/new">
						<Button className="h-10 gap-2 px-4 font-semibold text-sm">
							<Plus className="h-4 w-4" />
							Add New Book
						</Button>
					</Link>
				</div>
			</div>

			{/* Filter, Search, and Sort Mode Controls */}
			<div className="flex flex-col items-center justify-between gap-3 rounded-lg border border-slate-200/80 bg-white p-3 shadow-xs sm:flex-row dark:border-slate-800 dark:bg-slate-900">
				<div className="relative w-full sm:w-80">
					<Search className="absolute top-2.5 left-2.5 h-4 w-4 text-slate-400" />
					<Input
						className="h-9 border-none bg-slate-50 pl-8 text-sm shadow-none dark:bg-slate-800"
						onChange={(e) => setSearchQuery(e.target.value)}
						placeholder="Search by title, author, ISBN..."
						value={searchQuery}
					/>
				</div>

				<div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:flex-nowrap">
					<select
						className="h-9 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm dark:border-slate-800 dark:bg-slate-800 dark:text-white"
						onChange={(e) => setSelectedCategory(e.target.value)}
						value={selectedCategory}
					>
						<option value="All">All Categories</option>
						{categories.map((cat: any) => (
							<option key={cat.id} value={cat.name}>
								{cat.name}
							</option>
						))}
					</select>

					<div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 p-1 dark:border-slate-700 dark:bg-slate-800">
						<SlidersHorizontal className="ml-1 h-3.5 w-3.5 shrink-0 text-slate-400" />
						<select
							className="h-7 bg-transparent px-2 font-semibold text-slate-800 text-sm focus:outline-none dark:text-slate-200"
							onChange={(e) => setSortBy(e.target.value)}
							value={sortBy}
						>
							<option value="custom">Custom Order (Drag Enabled)</option>
							<option value="price-asc">Price: Low to High</option>
							<option value="price-desc">Price: High to Low</option>
							<option value="rating">Highest Rated</option>
							<option value="stock">Highest Stock</option>
						</select>
					</div>
				</div>
			</div>

			{/* Book Catalog Table with Drag & Drop */}
			<div className="rounded-lg border border-slate-200/80 bg-white p-4 shadow-xs sm:p-6 dark:border-slate-800 dark:bg-slate-900">
				<div className="mb-3 flex items-center gap-1 text-[11px] text-slate-500">
					<GripVertical className="h-4 w-4 animate-pulse text-primary" />
					<span>
						Click & drag any row handle to reorder storefront display sequence.
					</span>
				</div>

				<div className="overflow-x-auto">
					<table className="w-full text-left text-sm">
						<thead className="border-slate-200 border-b text-slate-500 dark:border-slate-800">
							<tr>
								<th className="px-3 py-3 font-semibold">Name</th>
								<th className="px-3 py-3 font-semibold">ISBN</th>
								<th className="px-3 py-3 font-semibold">Price (AED)</th>
								<th className="px-3 py-3 font-semibold">Status</th>
								<th className="px-3 py-3 text-right font-semibold">Actions</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-slate-100 dark:divide-slate-800">
							{processedBooks.map((book, index) => {
								const isDragging = draggedIndex === index;
								const isDragOver =
									dragOverIndex === index && draggedIndex !== index;

								return (
									<tr
										className={`transition-all ${
											isDragging
												? "border-2 border-primary border-dashed bg-primary/5 opacity-30"
												: isDragOver
													? "border-primary border-t-2 bg-primary/10 shadow-md"
													: "hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
										}`}
										draggable={sortBy === "custom"}
										key={book.id}
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
											e.dataTransfer.setData("text/plain", index.toString());
											e.dataTransfer.effectAllowed = "move";
										}}
										onDrop={(e) => {
											e.preventDefault();
											if (draggedIndex !== null) {
												reorderList(draggedIndex, index);
											}
											setDraggedIndex(null);
											setDragOverIndex(null);
										}}
									>
										<td className="px-3 py-3">
											<div className="font-semibold text-slate-900 dark:text-white">
												{book.title}
											</div>
											<div className="text-[11px] text-slate-500">
												{book.author}
											</div>
										</td>
										<td className="px-3 py-3">
											<div className="font-semibold text-slate-900 dark:text-white">
												{book.isbn || "N/A"}
											</div>
										</td>
										<td className="px-3 py-3">
											<div className="font-bold text-slate-900 dark:text-white">
												AED {book.price.toFixed(2)}
											</div>
											<div className="text-[10px] text-slate-400 line-through">
												AED {book.originalPrice?.toFixed(2) || "N/A"}
											</div>
										</td>

										<td className="px-3 py-3">
											{(() => {
												const stockCount = book.stock || 0;
												const isOutOfStock = stockCount === 0;
												const isLowStock = stockCount > 0 && stockCount <= 20;
												const badgeVariant = isOutOfStock
													? "destructive"
													: isLowStock
														? "secondary"
														: "success";
												const badgeText = isOutOfStock
													? "Out of Stock"
													: isLowStock
														? "Low Stock"
														: "In Stock";
												return (
													<Badge
														className="px-2 py-0 text-[10px]"
														variant={badgeVariant}
													>
														{badgeText}
													</Badge>
												);
											})()}
										</td>
										<td className="px-3 py-3 text-right">
											<div className="flex items-center justify-end gap-1">
												{sortBy === "custom" && (
													<>
														<Button
															className="text-slate-500 hover:bg-primary/10 hover:text-primary"
															onClick={() => moveToTop(index)}
															size="sm"
															title="Move to Top"
															variant="ghost"
														>
															<ArrowUpToLine className="h-4 w-4" />
														</Button>
														<Button
															className="text-slate-500 hover:bg-primary/10 hover:text-primary"
															onClick={() => moveToBottom(index)}
															size="sm"
															title="Move to Bottom"
															variant="ghost"
														>
															<ArrowDownToLine className="h-4 w-4" />
														</Button>
													</>
												)}

												<Button
													asChild
													className="text-slate-500 hover:bg-primary/10 hover:text-primary"
													size="sm"
													title="View Full Details"
													variant="ghost"
												>
													<Link href={`/admin/catalog/${book.slug}`}>
														<Eye className="h-4 w-4" />
													</Link>
												</Button>

												<Button
													className="text-red-500 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950/30"
													disabled={deleteProductMutation.isPending}
													onClick={() => handleDeleteBook(book.id)}
													size="sm"
													variant="ghost"
												>
													<Trash2 className="h-4 w-4" />
												</Button>
											</div>
										</td>
									</tr>
								);
							})}
							{page < totalPages && (
								<tr ref={observerTarget}>
									<td
										className="py-6 text-center text-slate-500 text-sm"
										colSpan={8}
									>
										{isFetching
											? "Loading more books..."
											: "Scroll to load more"}
									</td>
								</tr>
							)}
						</tbody>
					</table>

					{/* Stats / Actions Footer */}
					{totalCount > 0 && (
						<div className="mt-4 flex items-center justify-between border-slate-200 border-t pt-4 dark:border-slate-800">
							<div className="flex items-center gap-4">
								<div className="text-slate-500 text-sm">
									Loaded {orderedBooks.length} of {totalCount} books
								</div>
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Bulk Import Progress/Summary Dialog */}
			<Dialog
				onOpenChange={(isOpen) => {
					// Prevent closing by clicking outside if uploading is in progress
					if (!importProgress.isUploading && !isOpen) {
						setImportProgress((prev) => ({ ...prev, isOpen: false }));
					}
				}}
				open={importProgress.isOpen}
			>
				<DialogContent
					className="sm:max-w-md"
					onInteractOutside={(e) => {
						if (importProgress.isUploading) e.preventDefault();
					}}
				>
					<DialogHeader>
						<DialogTitle>
							{importProgress.isUploading
								? "Importing Catalog..."
								: "Import Complete!"}
						</DialogTitle>
						<DialogDescription>
							{importProgress.isUploading
								? "Please do not close this window or refresh the page until the process is finished."
								: "Here is the summary of your bulk import operation."}
						</DialogDescription>
					</DialogHeader>

					<div className="py-4">
						{importProgress.isUploading ? (
							<div className="space-y-4 text-center">
								<div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
									<div
										className="h-full bg-primary transition-all duration-300"
										style={{
											width: `${(importProgress.processed / importProgress.total) * 100}%`,
										}}
									/>
								</div>
								<p className="font-medium text-slate-700 text-sm dark:text-slate-300">
									Processing row {importProgress.processed} of{" "}
									{importProgress.total} (
									{Math.round(
										(importProgress.processed / importProgress.total) * 100
									)}
									%)
								</p>
							</div>
						) : (
							<div className="space-y-4">
								<div className="grid grid-cols-2 gap-3 text-center">
									<div className="rounded-lg bg-emerald-50 p-3 dark:bg-emerald-500/10">
										<p className="font-bold text-2xl text-emerald-600 dark:text-emerald-400">
											{importProgress.added}
										</p>
										<p className="font-medium text-emerald-800 text-xs dark:text-emerald-300">
											New Books Added
										</p>
									</div>
									<div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-500/10">
										<p className="font-bold text-2xl text-blue-600 dark:text-blue-400">
											{importProgress.updated}
										</p>
										<p className="font-medium text-blue-800 text-xs dark:text-blue-300">
											Books Updated
										</p>
									</div>
								</div>

								{importProgress.errors.length > 0 && (
									<div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-900/50 dark:bg-red-900/20">
										<p className="font-semibold text-red-800 text-sm dark:text-red-400">
											Errors ({importProgress.errors.length})
										</p>
										<ul className="mt-2 max-h-32 list-disc overflow-y-auto pl-4 text-red-700 text-xs dark:text-red-300">
											{importProgress.errors.map((err, idx) => (
												<li key={idx}>{err}</li>
											))}
										</ul>
									</div>
								)}
							</div>
						)}
					</div>

					{!importProgress.isUploading && (
						<DialogFooter>
							<Button
								onClick={() =>
									setImportProgress((prev) => ({ ...prev, isOpen: false }))
								}
							>
								Close
							</Button>
						</DialogFooter>
					)}
				</DialogContent>
			</Dialog>
		</div>
	);
}
