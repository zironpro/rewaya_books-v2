"use client";

import {
	type KeyboardEvent,
	useCallback,
	useEffect,
	useId,
	useRef,
	useState,
} from "react";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { SearchIcon } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

import {
	type SearchSuggestion,
	searchProductsAction,
} from "@/features/search/search-actions";
import { cn } from "@/lib/utils";

const DEBOUNCE_MS = 300;
const MIN_QUERY_LENGTH = 2;

function shopSearchHref(query: string) {
	return `/shop?q=${encodeURIComponent(query.trim())}`;
}

function productHref(suggestion: SearchSuggestion) {
	return `/product/${suggestion.slug ?? suggestion.id}`;
}

interface ProductSearchProps {
	className?: string;
	defaultQuery?: string;
	onNavigate?: () => void;
	autoFocus?: boolean;
}

export function ProductSearch({
	className,
	defaultQuery = "",
	onNavigate,
	autoFocus = false,
}: ProductSearchProps) {
	const router = useRouter();
	const listboxId = useId();
	const rootRef = useRef<HTMLFormElement>(null);

	const [query, setQuery] = useState(defaultQuery);
	const [results, setResults] = useState<SearchSuggestion[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const [activeIndex, setActiveIndex] = useState(-1);

	const trimmedQuery = query.trim();
	const showDropdown = isOpen && trimmedQuery.length >= MIN_QUERY_LENGTH;
	const hasSearched = trimmedQuery.length >= MIN_QUERY_LENGTH && !isLoading;

	const navigateToShop = useCallback(() => {
		if (trimmedQuery.length < MIN_QUERY_LENGTH) return;
		setIsOpen(false);
		onNavigate?.();
		router.push(shopSearchHref(trimmedQuery));
	}, [trimmedQuery, onNavigate, router]);

	useEffect(() => {
		setQuery(defaultQuery);
	}, [defaultQuery]);

	useEffect(() => {
		if (trimmedQuery.length < MIN_QUERY_LENGTH) {
			setResults([]);
			setIsLoading(false);
			setActiveIndex(-1);
			return;
		}

		setIsLoading(true);
		let cancelled = false;
		const timer = window.setTimeout(() => {
			void searchProductsAction(trimmedQuery).then(({ results: next }) => {
				if (cancelled) return;
				setResults(next);
				setIsLoading(false);
				setActiveIndex(-1);
			});
		}, DEBOUNCE_MS);

		return () => {
			cancelled = true;
			window.clearTimeout(timer);
		};
	}, [trimmedQuery]);

	useEffect(() => {
		function handlePointerDown(event: MouseEvent) {
			if (!rootRef.current?.contains(event.target as Node)) {
				setIsOpen(false);
			}
		}

		document.addEventListener("mousedown", handlePointerDown);
		return () => document.removeEventListener("mousedown", handlePointerDown);
	}, []);

	const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
		if (!isOpen && trimmedQuery.length >= MIN_QUERY_LENGTH) {
			if (event.key === "ArrowDown" || event.key === "ArrowUp") {
				setIsOpen(true);
			}
		}

		switch (event.key) {
			case "Escape":
				setIsOpen(false);
				setActiveIndex(-1);
				break;
			case "ArrowDown": {
				event.preventDefault();
				const maxIndex = results.length;
				setActiveIndex((prev) => (prev < maxIndex ? prev + 1 : prev));
				break;
			}
			case "ArrowUp": {
				event.preventDefault();
				setActiveIndex((prev) => (prev > -1 ? prev - 1 : -1));
				break;
			}
			case "Enter":
				event.preventDefault();
				if (activeIndex >= 0 && activeIndex < results.length) {
					setIsOpen(false);
					onNavigate?.();
					router.push(productHref(results[activeIndex]));
					return;
				}
				if (activeIndex === results.length) {
					navigateToShop();
					return;
				}
				navigateToShop();
				break;
			default:
				break;
		}
	};

	return (
		<form
			className={cn("relative w-full", className)}
			onSubmit={(e) => {
				e.preventDefault();
				navigateToShop();
			}}
			ref={rootRef}
		>
			<Input
				aria-activedescendant={
					activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined
				}
				aria-autocomplete="list"
				aria-controls={listboxId}
				aria-expanded={showDropdown}
				aria-label="Search books"
				autoFocus={autoFocus}
				className="w-full"
				icon={
					isLoading ? (
						<Spinner aria-hidden className="text-muted-foreground" />
					) : (
						<SearchIcon aria-hidden className="text-muted-foreground" />
					)
				}
				onChange={(event) => {
					setQuery(event.target.value);
					setIsOpen(true);
				}}
				onFocus={() => {
					if (trimmedQuery.length >= MIN_QUERY_LENGTH) {
						setIsOpen(true);
					}
				}}
				onKeyDown={handleKeyDown}
				placeholder="What are you looking for?"
				role="combobox"
				size="lg"
				type="search"
				value={query}
			/>

			{showDropdown && (
				<ul
					aria-label="Search suggestions"
					className="absolute top-full z-50 mt-1 max-h-[min(24rem,calc(100vh-8rem))] w-full overflow-y-auto rounded-sm border border-border/40 bg-white py-1 shadow-lg"
					id={listboxId}
					role="listbox"
				>
					{isLoading && results.length === 0 ? (
						<li className="px-4 py-3 text-muted-foreground text-sm">
							Searching…
						</li>
					) : null}

					{!isLoading && hasSearched && results.length === 0 ? (
						<li className="px-4 py-3 text-muted-foreground text-sm">
							No books found.
						</li>
					) : null}

					{results.map((suggestion, index) => {
						const isActive = activeIndex === index;
						return (
							<li
								aria-selected={isActive}
								id={`${listboxId}-option-${index}`}
								key={suggestion.id}
								role="option"
							>
								<Link
									className={cn(
										"flex items-center gap-3 px-3 py-2 text-sm transition-colors hover:bg-accent",
										isActive && "bg-accent"
									)}
									href={productHref(suggestion)}
									onClick={() => {
										setIsOpen(false);
										onNavigate?.();
									}}
									onMouseEnter={() => setActiveIndex(index)}
								>
									{suggestion.image ? (
										<Image
											alt=""
											className="size-10 shrink-0 rounded-sm object-cover"
											height={40}
											src={suggestion.image}
											width={32}
										/>
									) : (
										<div
											aria-hidden
											className="size-10 shrink-0 rounded-sm bg-stone-100"
										/>
									)}
									<span className="min-w-0 flex-1">
										<span className="line-clamp-1 font-medium text-secondary">
											{suggestion.title}
										</span>
										{suggestion.author ? (
											<span className="line-clamp-1 text-muted-foreground text-xs">
												{suggestion.author}
											</span>
										) : null}
									</span>
									<span className="shrink-0 font-medium text-secondary text-xs">
										AED {suggestion.price.toFixed(2)}
									</span>
								</Link>
							</li>
						);
					})}

					{trimmedQuery.length >= MIN_QUERY_LENGTH && !isLoading ? (
						<li className="border-stone-100 border-t" role="presentation">
							<button
								className={cn(
									"w-full px-4 py-3 text-start font-medium text-primary text-sm transition-colors hover:bg-accent",
									activeIndex === results.length && "bg-accent"
								)}
								onClick={navigateToShop}
								onMouseEnter={() => setActiveIndex(results.length)}
								type="button"
							>
								View all results for &ldquo;{trimmedQuery}&rdquo;
							</button>
						</li>
					) : null}
				</ul>
			)}
		</form>
	);
}
