"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import {
	Package,
	RefreshCcw,
	ShieldCheck,
	ShoppingBagIcon,
	Truck,
} from "lucide-react";

import { AvailabilityStatus } from "@/components/commerce/availability-status";
import { PurchasePanelShell } from "@/components/commerce/purchase-panel-shell";
import { QuantitySelector } from "@/components/commerce/quantity-selector";
import { Separator } from "@/components/ui/separator";

import { AddToCartButton } from "@/features/products/components/add-to-cart-button";
import { WishlistToggleButton } from "@/features/wishlist/components/wishlist-toggle-button";

const TRUST_ITEMS = [
	{ icon: Truck, label: "Express delivery across the UAE " },
	{ icon: RefreshCcw, label: "Easy 30-day returns on eligible items" },
	{ icon: ShieldCheck, label: "100% authentic edition guarantee" },
] as const;

interface ProductPurchasePanelProps {
	title: string;
	price: number;
	productId?: string;
	productVariant?: any;
	availableForSale?: boolean;
	quantity: number;
	onQuantityChange: (qty: number) => void;
	image?: string;
	stock?: number;
	className?: string;
}

export function ProductPurchasePanel({
	title,
	price,
	productId,
	productVariant,
	availableForSale,
	quantity,
	onQuantityChange,
	image,
	stock,
	className,
}: ProductPurchasePanelProps) {
	const router = useRouter();
	const inStock = availableForSale !== false;

	return (
		<PurchasePanelShell className={className}>
			<div className="mb-4 flex items-start gap-3">
				<div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
					<Package className="size-5" />
				</div>
				<div className="min-w-0">
					<p className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
						Sold by
					</p>
					<p className="font-bold text-secondary text-sm">Rewaya Books</p>
					{/* <p className="text-muted-foreground text-xs">
						Official store · Curated editions
					</p> */}
				</div>
			</div>

			<Separator className="mb-4" />

			<p className="flex items-baseline gap-1 tracking-tight">
				AED
				<span className="font-extrabold text-2xl text-primary">
					{price.toFixed(2)}
				</span>
			</p>

			<div className="mb-4 space-y-2">
				<AvailabilityStatus
					availableForSale={availableForSale}
					variant={productVariant}
				/>
				<QuantitySelector
					disabled={!inStock}
					onQuantityChange={onQuantityChange}
					quantity={quantity}
					max={stock}
				/>
			</div>

			{inStock && (
				<div className="flex flex-col gap-2">
					<AddToCartButton
						availableForSale={availableForSale}
						className="hidden w-full gap-2 md:flex"
						disabled={!productId}
						productId={productId ?? ""}
						productName={title}
						productVariant={productVariant}
						quantity={quantity}
						price={price}
						image={image}
						stock={stock}
						size="lg"
						variant="secondary"
					>
						<ShoppingBagIcon className="size-4" />
						Add to Cart
					</AddToCartButton>

					<AddToCartButton
						availableForSale={availableForSale}
						className="hidden w-full md:flex"
						disabled={!productId}
						onAdded={() => router.push("/cart")}
						productId={productId ?? ""}
						productName={title}
						productVariant={productVariant}
						quantity={quantity}
						price={price}
						image={image}
						stock={stock}
						size="lg"
						trackEventName="buy_now"
						variant="outline"
					>
						Buy Now
					</AddToCartButton>

					{/* {!productId && (
						<p className="text-center text-muted-foreground text-xs">
						Catalog sync required to purchase online.
						</p>
						)} */}
				</div>
			)}

			<Separator className="my-4" />

			<ul className="space-y-3">
				{TRUST_ITEMS.map(({ icon: Icon, label }) => (
					<li className="flex gap-3 text-sm" key={label}>
						<Icon aria-hidden className="mt-0.5 size-4 shrink-0 text-primary" />
						<span className="text-muted-foreground leading-snug">{label}</span>
					</li>
				))}
			</ul>

			<Separator className="my-4" />

			<WishlistToggleButton productId={productId} variant="row" />

			<Link
				className="mt-3 block text-center font-medium text-primary text-xs hover:underline"
				href="/shop"
			>
				Continue browsing the shop
			</Link>
		</PurchasePanelShell>
	);
}
