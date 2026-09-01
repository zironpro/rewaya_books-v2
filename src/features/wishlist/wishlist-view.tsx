"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import { Heart, ShoppingBag } from "lucide-react";

import Breadcrumbs from "@/components/layout/Breadcrumbs";
import { Button } from "@/components/ui/button";

import { BookCard } from "@/features/products/components/book-card";
import { useWishlist } from "@/features/wishlist/wishlist-provider";
import { type BookProps, getBookReactKey } from "@/lib/store";

import { fetchWishlistProducts } from "./wishlist-actions";
import { useSession } from "next-auth/react";

export const WishlistView = () => {
	const { data: session } = useSession();
	const { productIds, isLoading: wishlistLoading } = useWishlist();
	const [books, setBooks] = useState<BookProps[]>([]);
	const [productsLoading, setProductsLoading] = useState(false);

	useEffect(() => {
		if (!productIds.length) {
			setBooks([]);
			return;
		}

		let isMounted = true;
		setProductsLoading(true);
		fetchWishlistProducts(productIds)
			.then((res) => {
				if (isMounted) setBooks(res);
			})
			.catch(console.error)
			.finally(() => {
				if (isMounted) setProductsLoading(false);
			});

		return () => {
			isMounted = false;
		};
	}, [productIds]);

	const loading = wishlistLoading || productsLoading;
	const isLoggedIn = !!session?.user;

	return (
		<main className="grow pt-4 pb-28 md:pb-16">
			<section className="container mb-12">
				<Breadcrumbs className="mb-4" items={[{ label: "Wishlist" }]} />
				<div className="text-center">
					<span className="mb-4 block font-medium text-sm text-stone-400">
						Your Collection
					</span>
					<h1 className="mb-8 font-black font-serif text-3xl text-secondary sm:text-4xl md:text-5xl lg:text-6xl">
						Saved <span className="font-normal italic">Stories</span>.
					</h1>
					{!loading && !isLoggedIn && productIds.length > 0 && (
						<p className="mx-auto max-w-md text-sm text-stone-500">
							<Link className="text-primary underline" href="/login">
								Sign in
							</Link>{" "}
							to sync your wishlist across devices.
						</p>
					)}
				</div>
			</section>

			<section className="container mb-32">
				{loading ? (
					<p className="py-24 text-center text-sm text-stone-400">
						Loading your wishlist…
					</p>
				) : books.length > 0 ? (
					<div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
						{books.map((book, index) => (
							<BookCard key={getBookReactKey(book, index)} {...book} />
						))}
					</div>
				) : (
					<div className="mx-auto max-w-lg rounded-md border border-stone-100 bg-white p-8 text-center shadow-soft md:p-20">
						<div className="mx-auto mb-8 flex size-24 items-center justify-center rounded-full bg-stone-50">
							<Heart className="text-stone-200" size={40} strokeWidth={1} />
						</div>
						<h2 className="mb-4 font-serif text-3xl">Your wishlist is empty</h2>
						<p className="mb-10 text-stone-500 leading-relaxed">
							Save your favorite books to your wishlist and they&apos;ll appear
							here. Start exploring our curated collection today.
						</p>

						<Button nativeButton={false} render={<Link href="/shop" />}>
							<ShoppingBag className="mr-2" size={18} />
							Continue Shopping
						</Button>
					</div>
				)}
			</section>
		</main>
	);
};
