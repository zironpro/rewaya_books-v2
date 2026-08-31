"use client";

import { useMemo } from "react";

import Breadcrumbs from "@/components/layout/Breadcrumbs";
import { PolicyCards } from "@/components/PolicyCards";
import { Separator } from "@/components/ui/separator";

import type { Bundle } from "@/domain/catalog";
import { BundleBuyBox } from "@/features/bundles/components/bundle-detail/bundle-buy-box";
import { BundleImageGallery } from "@/features/bundles/components/bundle-detail/bundle-image-gallery";
import { BundleIncludedVolumes } from "@/features/bundles/components/bundle-detail/bundle-included-volumes";
import { BundleMobileBuyBar } from "@/features/bundles/components/bundle-detail/bundle-mobile-buy-bar";
import { BundleNewsletterCta } from "@/features/bundles/components/bundle-detail/bundle-newsletter-cta";
import { BundleProductInfo } from "@/features/bundles/components/bundle-detail/bundle-product-info";
import { BundleRelatedBooks } from "@/features/bundles/components/bundle-detail/bundle-related-books";
import { BundleRelatedBundles } from "@/features/bundles/components/bundle-detail/bundle-related-bundles";
import type { BookProps } from "@/lib/store";

function pickRandomBooks(
	books: BookProps[],
	count: number,
	seed: string
): BookProps[] {
	const shuffled = [...books].sort((a, b) => {
		const hash = (id: number) =>
			(seed + id).split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
		return (hash(a.id) % 10) - (hash(b.id) % 10);
	});
	return shuffled.slice(0, count);
}

interface BundleDetailViewProps {
	id: string;
	bundle: Bundle | null;
	allBundles: Bundle[];
	relatedBooks: BookProps[];
}

export const BundleDetailView = ({
	id,
	bundle: initialBundle,
	allBundles,
	relatedBooks,
}: BundleDetailViewProps) => {
	const bundleId = initialBundle?.id ?? id;
	const randomBooks = useMemo(
		() =>
			relatedBooks.length > 0
				? relatedBooks.slice(0, 4)
				: pickRandomBooks([], 4, bundleId),
		[relatedBooks, bundleId]
	);

	if (!initialBundle) {
		return (
			<main className="container py-32 text-center">
				<p className="text-muted-foreground">Bundle not found.</p>
			</main>
		);
	}

	const bundle = initialBundle;
	const relatedBundles = allBundles.filter((b) => b.id !== bundle.id);

	return (
		<>
			<main className="container pt-6 pb-28 md:pb-16">
				<Breadcrumbs
					className="mb-8"
					items={[
						{ label: "Shop", href: "/shop" },
						{ label: "Bundles", href: "/bundles" },
						{ label: bundle.title },
					]}
				/>

				<div className="mb-20 grid grid-cols-1 items-start gap-10 md:grid-cols-2 lg:grid-cols-12">
					<div className="lg:col-span-5">
						<BundleImageGallery bundle={bundle} />
					</div>

					<BundleProductInfo bundle={bundle} className="lg:col-span-4" />

					<BundleBuyBox
						bundle={bundle}
						className="hidden md:col-span-2 md:block lg:col-span-3"
					/>
				</div>

				<BundleIncludedVolumes books={bundle.books} />

				<Separator />

				<BundleRelatedBundles bundles={relatedBundles} />
				<BundleRelatedBooks books={randomBooks} />
				<BundleNewsletterCta />
				<PolicyCards />
			</main>

			<BundleMobileBuyBar bundle={bundle} />
		</>
	);
};
