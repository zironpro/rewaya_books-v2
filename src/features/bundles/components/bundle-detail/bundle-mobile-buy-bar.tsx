"use client";

import { ShoppingBagIcon } from "lucide-react";
import { useRouter } from "next/navigation";

import { MobileBuyBar } from "@/components/commerce/mobile-buy-bar";

import { CurrencyIcon } from "@/assets/icons/currency";

import { AddBundleToCartButton } from "@/features/bundles/components/add-bundle-to-cart-button";
import type { Bundle } from "@/lib/catalog/types";

interface BundleMobileBuyBarProps {
	bundle: Bundle;
}

export function BundleMobileBuyBar({ bundle }: BundleMobileBuyBarProps) {
	const router = useRouter();

	return (
		<MobileBuyBar
			actions={
				<div className="flex gap-2">
					<AddBundleToCartButton
						bundleSlug={bundle.id}
						checkoutCatalogAppId={bundle.checkoutCatalogAppId}
						checkoutCatalogItemId={bundle.checkoutCatalogItemId || bundle.id}
						className="px-3"
						image={bundle.coverImage}
						price={bundle.price}
						size="lg"
						title={bundle.title}
						variant="secondary"
					>
						<ShoppingBagIcon size={18} />
						<span className="sr-only">Add to Cart</span>
					</AddBundleToCartButton>
					<AddBundleToCartButton
						bundleSlug={bundle.id}
						checkoutCatalogAppId={bundle.checkoutCatalogAppId}
						checkoutCatalogItemId={bundle.checkoutCatalogItemId || bundle.id}
						image={bundle.coverImage}
						onAdded={() => router.push("/cart")}
						price={bundle.price}
						size="lg"
						title={bundle.title}
						variant="default"
					>
						Buy Now
					</AddBundleToCartButton>
				</div>
			}
			priceLabel={
				<div className="flex items-center gap-1">
					<CurrencyIcon className="size-5 shrink-0 text-primary" />
					<span className="font-bold text-2xl text-primary">
						{bundle.price}
					</span>
				</div>
			}
		/>
	);
}
