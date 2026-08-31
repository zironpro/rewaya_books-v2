"use client";

import Image from "next/image";
import Link from "next/link";

import { Eye, Plus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

import { AddToCartButton } from "@/features/products/components/add-to-cart-button";
import { WishlistToggleButton } from "@/features/wishlist/components/wishlist-toggle-button";
import type { BookProps } from "@/lib/store";
import { cn } from "@/lib/utils";

export function BookCard({
	id,
	productId,
	slug,
	title,
	author,
	price,
	image,
	coverImage,
	category,
	badge,
	defaultVariant,
	availableForSale,
}: BookProps & { coverImage?: string }) {
	const productHref = `/product/${slug ?? id}`;
	const finalImage =
		image ||
		coverImage ||
		"https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=400&auto=format&fit=crop";

	return (
		<div className="group relative">
			<Link className="absolute inset-0 z-10" href={productHref} />
			<div className="relative mb-4 aspect-4/5 overflow-hidden rounded-md border bg-card group-hover:shadow-md">
				<Image
					alt={title}
					className="object-contain transition-transform duration-700 group-hover:scale-105"
					fill
					sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
					src={finalImage}
				/>

				<div className="absolute top-4 right-4 z-20 flex flex-col gap-2 opacity-0 transition-opacity group-hover:opacity-100">
					<WishlistToggleButton
						className={cn(
							"size-9 rounded-full backdrop-blur-sm",
							"bg-card text-mauve-900 hover:bg-mauve-100"
						)}
						productId={productId}
					/>

					<Dialog>
						<DialogTrigger
							render={
								<Button
									className="size-9 rounded-full bg-white/80 backdrop-blur-sm"
									size="icon"
									variant="ghost"
								/>
							}
						>
							<Eye size={16} strokeWidth={1.5} />
						</DialogTrigger>
						<DialogContent className="max-w-4xl">
							<div className="grid grid-cols-1 gap-8 p-6 md:grid-cols-2">
								<div className="relative aspect-3/4 overflow-hidden bg-mauve-50">
									<Image
										alt={title}
										className="object-cover"
										fill
										sizes="(max-width: 768px) 100vw, 400px"
										src={finalImage}
									/>
								</div>
								<div className="flex flex-col justify-between py-4">
									<DialogHeader className="p-0">
										<Badge className="w-fit">{category}</Badge>
										<DialogTitle className="text-4xl">{title}</DialogTitle>
										<DialogDescription>{author}</DialogDescription>
									</DialogHeader>

									<div className="space-y-4">
										<p className="font-extrabold text-3xl text-primary">
											AED {price.toFixed(2)}
										</p>
										<p className="text-base text-mauve-500 leading-relaxed">
											Experience the profound wisdom and timeless narrative of{" "}
											{title}. A curated masterpiece now available in the Rewaya
											collection.
										</p>
										<div className="flex gap-4">
											<AddToCartButton
												availableForSale={availableForSale ?? true}
												className="flex-1"
												disabled={!(productId || id)}
												image={finalImage}
												price={price}
												productId={(productId || id) ?? ""}
												productName={title}
												productVariant={defaultVariant}
												variant="default"
											>
												Add to Bag
											</AddToCartButton>
											<WishlistToggleButton
												className="size-11 shrink-0 border"
												productId={productId}
												size="md"
											/>
										</div>
									</div>
								</div>
							</div>
						</DialogContent>
					</Dialog>
				</div>

				<div className="absolute right-0 bottom-0 left-0 z-20 translate-y-full bg-primary transition-transform duration-300 group-hover:translate-y-0">
					<AddToCartButton
						availableForSale={availableForSale ?? true}
						className="h-auto w-full rounded-none p-3 text-white hover:text-white md:p-4"
						disabled={!(productId || id)}
						image={finalImage}
						price={price}
						productId={(productId || id) ?? ""}
						productName={title}
						productVariant={defaultVariant}
						variant="ghost"
					>
						<Plus className="mr-2" size={14} /> Add to Bag
					</AddToCartButton>
				</div>

				<div className="absolute top-4 left-4 z-10 flex flex-col items-start gap-1">
					{badge === "best seller" && (
						<span className="rounded bg-secondary px-2 py-1 font-medium text-white text-xs shadow-sm">
							Best Seller
						</span>
					)}
					{badge === "new arrival" && (
						<span className="rounded bg-primary px-2 py-1 font-medium text-white text-xs shadow-sm">
							New Arrival
						</span>
					)}
					{badge === "new seller" && (
						<span className="rounded border-primary border-l-4 bg-mauve-800 px-3 py-1 font-medium text-white text-xs shadow-sm">
							New Seller
						</span>
					)}
					{/* {price < 50 && !badge && (
						<span className="rounded bg-primary px-2 py-1 font-medium text-white text-xs shadow-sm">
							Special Offer
						</span>
					)} */}
				</div>
			</div>

			<div className="flex cursor-pointer flex-col gap-1 px-1">
				<h3 className="flex-1 font-semibold text-base text-primary leading-tight transition-colors">
					{title}
				</h3>
				<div className="flex flex-col items-center sm:flex-row sm:justify-between">
					<span className="whitespace-nowrap font-extrabold text-secondary text-sm md:text-base">
						AED {price.toFixed(2)}
					</span>
					{author && author !== "Unknown" && (
						<p className="text-mauve-400 text-xs">{author}</p>
					)}
				</div>
			</div>
		</div>
	);
}
