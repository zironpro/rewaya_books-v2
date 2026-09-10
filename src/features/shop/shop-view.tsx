"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Loader2, SlidersHorizontal } from "lucide-react";

import Breadcrumbs from "@/components/layout/Breadcrumbs";
import { MobileFilterDrawer } from "@/components/layout/mobile-filter-drawer";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import { BookCard } from "@/features/products/components/book-card";
import { graphqlClient } from "@/lib/graphql-client";
import { type BookProps, getBookReactKey } from "@/lib/store";
import { cn } from "@/lib/utils";
import { GetProductsPaginatedDocument } from "@/types/graphql";

import { PriceFilter } from "./components/price-filter";
import { ShopSortFieldset } from "./components/shop-sort-fieldset";

interface ShopViewProps {
	books: BookProps[];
	categories?: any[]; // Dummy generic category type
	activeCategory?: string;
	searchQuery?: string;
	totalCount?: number;
	currentPage?: number;
	itemsPerPage?: number;
	categoryIdToSearch?: string;
	customOrderIds?: string[];
	totalPages?: number;
}

export const ShopView = ({
	books,
	categories = [],
	activeCategory,
	searchQuery,
	totalCount = 0,
	currentPage = 1,
	itemsPerPage = 25,
	categoryIdToSearch,
	customOrderIds,
	totalPages = 1,
}: ShopViewProps) => {
	const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const [loadedBooks, setLoadedBooks] = useState<BookProps[]>(books);
	const [page, setPage] = useState(currentPage);
	const [isFetching, setIsFetching] = useState(false);
	const observerTarget = useRef(null);

	// Reset when props change (like new category or search)
	useEffect(() => {
		setLoadedBooks(books);
		setPage(currentPage);
	}, [books, currentPage]);

	const loadMore = useCallback(async () => {
		if (page >= totalPages || isFetching) return;

		setIsFetching(true);
		try {
			const nextPage = page + 1;
			const res = await graphqlClient.request(GetProductsPaginatedDocument, {
				category: categoryIdToSearch,
				q: searchQuery,
				sort: searchParams.get("sort") || undefined,
				page: nextPage,
				limit: itemsPerPage,
				customOrderIds: customOrderIds,
			});

			if (res.productsPaginated?.items) {
				setLoadedBooks((prev) => [
					...prev,
					...(res.productsPaginated.items as any),
				]);
				setPage(nextPage);
			}
		} catch (e) {
			console.error("Failed to fetch more books", e);
		} finally {
			setIsFetching(false);
		}
	}, [
		page,
		totalPages,
		isFetching,
		categoryIdToSearch,
		searchQuery,
		searchParams,
		itemsPerPage,
		customOrderIds,
	]);

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) {
					loadMore();
				}
			},
			{ threshold: 0.1 }
		);

		if (observerTarget.current) {
			observer.observe(observerTarget.current);
		}

		return () => observer.disconnect();
	}, [loadMore]);

	useEffect(() => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	}, []);

	const updatePage = (page: number) => {
		const params = new URLSearchParams(searchParams.toString());
		params.set("page", page.toString());
		router.push(`${pathname}?${params.toString()}`);
	};

	const updateLimit = (limit: number) => {
		const params = new URLSearchParams(searchParams.toString());
		params.set("limit", limit.toString());
		params.set("page", "1");
		router.push(`${pathname}?${params.toString()}`);
	};

	const updateSort = (value: string | null) => {
		const params = new URLSearchParams(searchParams.toString());
		if (!value) {
			params.delete("sort");
		} else {
			params.set("sort", value);
		}
		params.set("page", "1");
		router.push(`${pathname}?${params.toString()}`);
	};

	const sidebarCategories: Array<
		| { type: "all"; name: string; count: number }
		| { type: "generic"; category: any }
	> = [
		{ type: "all", name: "All", count: totalCount },
		...categories.map((category) => ({ type: "generic" as const, category })),
	];

	const FilterContent = ({ onClose }: { onClose?: () => void }) => (
		<div className="space-y-12">
			<div className="lg:hidden">
				<ShopSortFieldset
					onChange={updateSort}
					value={searchParams.get("sort") ?? undefined}
				/>
			</div>

			<div>
				<h3 className="mb-4 border-b pb-1 font-semibold text-sm">Categories</h3>
				<div className="flex flex-col gap-1">
					{sidebarCategories.map((item) => {
						if (item.type === "all") {
							const isActive = !activeCategory;
							return (
								<Link
									className={cn(
										"inline-flex h-8 w-full items-center justify-between rounded-sm px-2 text-sm transition-colors hover:bg-accent/80",
										isActive ? "bg-accent text-accent-foreground" : ""
									)}
									href="/shop"
									key="all"
								>
									<span>{item.name}</span>
									<span className="text-[9px] text-mauve-500 tabular-nums">
										{item.count}
									</span>
								</Link>
							);
						}

						const { category } = item;
						const isActive = activeCategory === category.slug;
						const count = category.count ?? 0;

						return (
							<Link
								className={cn(
									"inline-flex h-8 w-full items-center justify-between rounded-sm px-2 text-sm transition-colors hover:bg-accent/80 hover:text-accent-foreground",
									isActive ? "bg-accent text-accent-foreground" : ""
								)}
								href={`/shop?category=${encodeURIComponent(category.slug || category.id)}`}
								key={`${category.slug}-${category.name}`}
							>
								<span>{category.name}</span>
								<span className="text-[9px] text-mauve-500 tabular-nums">
									{count}
								</span>
							</Link>
						);
					})}
				</div>
			</div>

			<div>
				<h3 className="mb-4 border-b pb-1 font-semibold text-sm">
					Price Range
				</h3>
				<PriceFilter />
			</div>

			<div>
				<h3 className="mb-4 border-b pb-1 font-semibold text-sm">
					Availability
				</h3>
				<div className="space-y-4">
					<div className="flex items-center space-x-3">
						<Checkbox id="in-stock" />
						<label
							className="cursor-pointer font-bold text-sm"
							htmlFor="in-stock"
						>
							In stock
						</label>
					</div>
					<div className="flex items-center space-x-3">
						<Checkbox id="pre-order" />
						<label
							className="cursor-pointer font-bold text-sm"
							htmlFor="pre-order"
						>
							Pre-order
						</label>
					</div>
				</div>
			</div>

			<div className="pt-8 lg:hidden">
				<Button
					className="h-12 w-full text-sm"
					onClick={onClose}
					variant="outline"
				>
					Apply Filters
				</Button>
			</div>
		</div>
	);

	return (
		<>
			<main className="grow pt-4 pb-28 md:pt-6 md:pb-16">
				<section className="container max-w-none md:mb-4">
					<Breadcrumbs className="mb-2" items={[{ label: "Shop" }]} />
					<div className="flex items-center justify-between text-center md:justify-center">
						{/* <span className="mb-2 block font-medium text-muted-foreground text-xs sm:text-sm">
							Collection
						</span> */}
						<h1 className="mb-4 font-bold font-display text-3xl text-secondary sm:text-4xl md:mb-4 md:text-5xl">
							The <span className="text-primary italic">Library.</span>
						</h1>

						<Button
							className="md:hidden"
							onClick={() => setIsMobileFilterOpen(true)}
							variant="outline"
						>
							<SlidersHorizontal className="mr-2" size={14} /> Filter & Sort
						</Button>
					</div>
				</section>

				<section className="container mb-6 max-w-none">
					<div className="flex flex-col gap-9 lg:flex-row">
						<aside className="scrollbar-thin sticky top-32 hidden h-fit max-h-[calc(100vh-160px)] w-64 shrink-0 space-y-12 overflow-y-auto pr-4 lg:block">
							<FilterContent />
						</aside>

						<div className="grow">
							<div className="mb-4 hidden items-center justify-between border-mauve-100 border-b pb-2 font-semibold md:flex">
								<p className="font-medium text-mauve-500 text-sm">
									Showing {totalCount} results
									{searchQuery ? ` for "${searchQuery}"` : ""}
									{activeCategory
										? ` in ${categories.find((c) => c.slug === activeCategory)?.name ?? activeCategory}`
										: ""}
								</p>
								<div className="flex items-center gap-6">
									<ShopSortFieldset
										className="m-0 flex flex-row items-center gap-2 p-0"
										onChange={updateSort}
										value={searchParams.get("sort") ?? undefined}
									/>
								</div>
							</div>

							{loadedBooks.length === 0 ? (
								<p className="py-16 text-center text-muted-foreground">
									No books found. Try another search or category.
								</p>
							) : (
								<div className="space-y-8">
									<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
										{loadedBooks.map((book, index) => (
											<BookCard key={getBookReactKey(book, index)} {...book} />
										))}
									</div>

									<div
										className="flex w-full justify-center py-8"
										ref={observerTarget}
									>
										{isFetching && (
											<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
										)}
										{!isFetching &&
											page >= totalPages &&
											loadedBooks.length > 0 && (
												<p className="text-muted-foreground text-sm">
													You have reached the end of the list.
												</p>
											)}
									</div>
								</div>
							)}
						</div>
					</div>
				</section>
			</main>

			<MobileFilterDrawer
				onOpenChange={setIsMobileFilterOpen}
				open={isMobileFilterOpen}
			>
				<FilterContent onClose={() => setIsMobileFilterOpen(false)} />
			</MobileFilterDrawer>
		</>
	);
};
