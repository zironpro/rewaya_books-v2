"use client";

import { ShoppingBagIcon } from "lucide-react";

import { MobileBuyBar } from "@/components/commerce/mobile-buy-bar";

import { AddToCartButton } from "@/features/products/components/add-to-cart-button";

import { useRouter } from "next/navigation";

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
	const router = useRouter();
	return (
		<MobileBuyBar
			actions={
				<div className="flex gap-2">
					<AddToCartButton
						availableForSale={availableForSale}
						className="px-3"
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
						<span className="sr-only">Add to Cart</span>
					</AddToCartButton>
					<AddToCartButton
						availableForSale={availableForSale}
						disabled={!productId}
						image={image}
						onAdded={() => router.push("/cart")}
						price={price}
						productId={productId ?? ""}
						productName={productName}
						productVariant={productVariant}
						quantity={quantity}
						size="lg"
						trackEventName="buy_now"
						variant="default"
					>
						Buy Now
					</AddToCartButton>
				</div>
			}
			priceLabel={
				<span className="font-bold text-2xl text-secondary">
					AED {price.toFixed(2)}
				</span>
			}
		/>
	);
}
