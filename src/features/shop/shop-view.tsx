"use client";

import { useEffect, useState } from "react";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
	ChevronFirstIcon,
	ChevronLastIcon,
	ChevronLeftIcon,
	ChevronRightIcon,
	SlidersHorizontal,
} from "lucide-react";

import Breadcrumbs from "@/components/layout/Breadcrumbs";
import { MobileFilterDrawer } from "@/components/layout/mobile-filter-drawer";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
} from "@/components/ui/pagination";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

import { BookCard } from "@/features/products/components/book-card";
import { type BookProps, getBookReactKey } from "@/lib/store";
import { cn } from "@/lib/utils";

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
}

export const ShopView = ({
	books,
	categories = [],
	activeCategory,
	searchQuery,
	totalCount = 0,
	currentPage = 1,
	itemsPerPage = 25,
}: ShopViewProps) => {
	const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

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

	const totalPages = Math.max(1, Math.ceil(totalCount / itemsPerPage));

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
						const count = category.productCount ?? 0;

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

							{books.length === 0 ? (
								<p className="py-16 text-center text-muted-foreground">
									No books found. Try another search or category.
								</p>
							) : (
								<div className="space-y-8">
									<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
										{books.map((book, index) => (
											<BookCard key={getBookReactKey(book, index)} {...book} />
										))}
									</div>

									<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
										<div className="flex items-center gap-3">
											<Label htmlFor="rows-per-page">Books per page</Label>
											<Select
												onValueChange={(val) => updateLimit(Number(val))}
												value={itemsPerPage.toString()}
											>
												<SelectTrigger
													className="w-fit whitespace-nowrap"
													id="rows-per-page"
												>
													<SelectValue placeholder="Select number of results" />
												</SelectTrigger>
												<SelectContent className="[&_*[role=option]>span]:inset-e-2 [&_*[role=option]>span]:inset-s-auto [&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8">
													<SelectItem value="25">25</SelectItem>
													<SelectItem value="50">50</SelectItem>
													<SelectItem value="100">100</SelectItem>
												</SelectContent>
											</Select>
										</div>

										<div className="flex items-center gap-4 text-muted-foreground text-sm">
											<p aria-live="polite" className="whitespace-nowrap">
												<span className="text-foreground">
													{totalCount === 0
														? 0
														: (currentPage - 1) * itemsPerPage + 1}
													-{Math.min(currentPage * itemsPerPage, totalCount)}
												</span>{" "}
												of <span className="text-foreground">{totalCount}</span>
											</p>

											<Pagination>
												<PaginationContent>
													<PaginationItem>
														<PaginationLink
															aria-label="Go to first page"
															className={cn(
																currentPage <= 1
																	? "pointer-events-none opacity-50"
																	: "cursor-pointer"
															)}
															onClick={() => updatePage(1)}
														>
															<ChevronFirstIcon aria-hidden="true" size={16} />
														</PaginationLink>
													</PaginationItem>

													<PaginationItem>
														<PaginationLink
															aria-label="Go to previous page"
															className={cn(
																currentPage <= 1
																	? "pointer-events-none opacity-50"
																	: "cursor-pointer"
															)}
															onClick={() =>
																updatePage(Math.max(1, currentPage - 1))
															}
														>
															<ChevronLeftIcon aria-hidden="true" size={16} />
														</PaginationLink>
													</PaginationItem>

													<PaginationItem>
														<PaginationLink
															aria-label="Go to next page"
															className={cn(
																currentPage >= totalPages || totalCount === 0
																	? "pointer-events-none opacity-50"
																	: "cursor-pointer"
															)}
															onClick={() =>
																updatePage(
																	Math.min(totalPages, currentPage + 1)
																)
															}
														>
															<ChevronRightIcon aria-hidden="true" size={16} />
														</PaginationLink>
													</PaginationItem>

													<PaginationItem>
														<PaginationLink
															aria-label="Go to last page"
															className={
																currentPage >= totalPages || totalCount === 0
																	? "pointer-events-none opacity-50"
																	: "cursor-pointer"
															}
															onClick={() => updatePage(totalPages)}
														>
															<ChevronLastIcon aria-hidden="true" size={16} />
														</PaginationLink>
													</PaginationItem>
												</PaginationContent>
											</Pagination>
										</div>
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
