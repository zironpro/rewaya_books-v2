import { ShoppingBagIcon } from "lucide-react";

import { MobileBuyBar } from "@/components/commerce/mobile-buy-bar";

import { CurrencyIcon } from "@/assets/icons/currency";

import { AddBundleToCartButton } from "@/features/bundles/components/add-bundle-to-cart-button";
import type { Bundle } from "@/lib/catalog/types";

interface BundleMobileBuyBarProps {
	bundle: Bundle;
}

export function BundleMobileBuyBar({ bundle }: BundleMobileBuyBarProps) {
	return (
		<MobileBuyBar
			actions={
				<AddBundleToCartButton
					bundleSlug={bundle.id}
					checkoutCatalogAppId={bundle.checkoutCatalogAppId}
					checkoutCatalogItemId={bundle.checkoutCatalogItemId || bundle.id}
					title={bundle.title}
					price={bundle.price}
					image={bundle.coverImage}
					className="gap-2"
					size="lg"
					variant="secondary"
				>
					<ShoppingBagIcon size={18} />
					Add to Cart
				</AddBundleToCartButton>
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
