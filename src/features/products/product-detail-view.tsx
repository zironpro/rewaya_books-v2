"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import { useOpenPanel } from "@openpanel/nextjs";

import Breadcrumbs from "@/components/layout/Breadcrumbs";
import { Button } from "@/components/ui/button";

import { ProductGallery } from "@/features/products/components/product-gallery";
import { ProductInfoPanel } from "@/features/products/components/product-info-panel";
import { ProductMobileBuyBar } from "@/features/products/components/product-mobile-buy-bar";
import { ProductPurchasePanel } from "@/features/products/components/product-purchase-panel";
import { ProductRelatedBooks } from "@/features/products/components/product-related-books";
import type { ProductDetailData } from "@/features/products/types";
import { trackMetaEvent } from "@/lib/analytics/meta";
import type { BookProps } from "@/lib/store";

export type { ProductDetailData } from "@/features/products/types";

interface ProductDetailViewProps {
	product: ProductDetailData | null;
	sameCategoryBooks?: BookProps[];
	relatedReads?: BookProps[];
}

export const ProductDetailView = ({
	product,
	sameCategoryBooks = [],
	relatedReads = [],
}: ProductDetailViewProps) => {
	const { track } = useOpenPanel();
	const [quantity, setQuantity] = useState(1);

	useEffect(() => {
		if (product) {
			const customData = {
				...(product.productId
					? { content_ids: [product.productId] }
					: {}),
				content_name: product.title,
				content_type: "product",
				value: product.price,
				currency: "AED",
				...(product.category ? { content_category: product.category } : {}),
			};
			trackMetaEvent("ViewContent", {
				event_source_url: window.location.href,
				custom_data: customData,
			});
			track("product_view", {
				product_id: product.productId,
				product_name: product.title,
				category: product.category,
				price: product.price,
			});
		}
	}, [product, track]);

	if (!product) {
		return (
			<main className="container grow py-32 text-center">
				<h1 className="font-serif text-3xl text-secondary">
					Product not found
				</h1>
				<p className="mt-4 text-muted-foreground">
					This title is not in the catalog or is no longer available.
				</p>
				<Button
					className="mt-8"
					nativeButton={false}
					render={<Link href="/shop" />}
				>
					Back to shop
				</Button>
			</main>
		);
	}

	return (
		<>
			<main className="bg-background pt-4 pb-28 md:pb-16">
				<div className="container">
					<Breadcrumbs
						className="mb-6"
						items={[
							{ label: "Shop", href: "/shop" },
							...(product.category
								? [
										{
											label: product.category,
											href: product.categorySlug
												? `/shop?category=${encodeURIComponent(product.categorySlug)}`
												: "/shop",
										},
									]
								: []),
							{ label: product.title },
						]}
					/>

					<div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10 xl:gap-12">
						<div className="lg:col-span-4 xl:col-span-5">
							<ProductGallery
								image={product.image}
								images={product.images}
								title={product.title}
								productId={product.productId}
							/>
						</div>

						<div className="lg:col-span-5 xl:col-span-4">
							<ProductInfoPanel product={product} />
						</div>

						<div className="hidden lg:col-span-3 lg:block xl:col-span-3">
							<ProductPurchasePanel
								availableForSale={product.availableForSale}
								onQuantityChange={setQuantity}
								price={product.price}
								productId={product.productId}
								productVariant={product.defaultVariant}
								quantity={quantity}
								title={product.title}
								image={product.image}
							/>
						</div>
					</div>

					<ProductRelatedBooks
						books={sameCategoryBooks}
						category={product.category}
						categorySlug={product.categorySlug}
						variant="same-category"
					/>
					<ProductRelatedBooks books={relatedReads} variant="related-reads" />
				</div>
			</main>

			<ProductMobileBuyBar
				availableForSale={product.availableForSale}
				price={product.price}
				productId={product.productId}
				productName={product.title}
				productVariant={product.defaultVariant}
				quantity={quantity}
				image={product.image}
			/>
		</>
	);
};
