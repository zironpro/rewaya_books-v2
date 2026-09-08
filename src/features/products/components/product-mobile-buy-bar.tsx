"use client";

import { ShoppingBagIcon } from "lucide-react";

import { MobileBuyBar } from "@/components/commerce/mobile-buy-bar";

import { AddToCartButton } from "@/features/products/components/add-to-cart-button";

interface ProductMobileBuyBarProps {
	price: number;
	productId?: string;
	productName?: string;
	productVariant?: any;
	availableForSale?: boolean;
	quantity: number;
	image?: string;
}

export function ProductMobileBuyBar({
	price,
	productId,
	productName = "Product",
	productVariant,
	availableForSale,
	quantity,
	image,
}: ProductMobileBuyBarProps) {
	return (
		<MobileBuyBar
			actions={
				<AddToCartButton
					availableForSale={availableForSale}
					className="gap-2"
					disabled={!productId}
					image={image}
					price={price}
					productId={productId ?? ""}
					productName={productName}
					productVariant={productVariant}
					quantity={quantity}
					size="lg"
					variant="secondary"
				>
					<ShoppingBagIcon size={18} />
					Add to Cart
				</AddToCartButton>
			}
			priceLabel={
				<span className="font-bold text-2xl text-secondary">
					AED {price.toFixed(2)}
				</span>
			}
		/>
	);
}
