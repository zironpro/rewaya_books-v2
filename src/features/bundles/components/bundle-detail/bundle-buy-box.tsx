import { PurchasePanelShell } from "@/components/commerce/purchase-panel-shell";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

import { AddBundleToCartButton } from "@/features/bundles/components/add-bundle-to-cart-button";
import { WishlistToggleButton } from "@/features/wishlist/components/wishlist-toggle-button";
import type { Bundle } from "@/lib/catalog/types";
import { cn } from "@/lib/utils";

interface BundleBuyBoxProps {
	bundle: Bundle;
	className?: string;
}

export function BundleBuyBox({ bundle, className }: BundleBuyBoxProps) {
	return (
		<PurchasePanelShell className={cn("p-6", className)}>
			<div>
				<span className="text-muted-foreground text-xs">Bundle contents</span>
				<h3 className="font-bold text-secondary uppercase">
					{bundle.books.length} Books
				</h3>
			</div>
			<Separator className="my-3" />
			<ScrollArea className="mb-4 max-h-[280px]">
				<div className="space-y-3 pr-2">
					{bundle.books.map((book, i) => (
						<div
							className="group/item flex cursor-pointer items-start"
							key={book.id}
						>
							<span className="mt-0.5 w-6 shrink-0 text-muted-foreground/50 text-xs">
								{(i + 1).toString().padStart(2, "0")}
							</span>
							<p className="font-medium text-sm text-stone-500 leading-tight transition-colors group-hover/item:text-primary">
								{book.title}
							</p>
						</div>
					))}
				</div>
			</ScrollArea>

			<AddBundleToCartButton
				bundleSlug={bundle.id}
				checkoutCatalogAppId={bundle.checkoutCatalogAppId}
				checkoutCatalogItemId={bundle.checkoutCatalogItemId || bundle.id}
				title={bundle.title}
				price={bundle.price}
				image={bundle.coverImage}
				className="w-full"
				size="lg"
			>
				Add to cart
			</AddBundleToCartButton>

			<Separator className="my-4" />

			{bundle.bundleProductId || bundle.storeProductIds?.[0] ? (
				<WishlistToggleButton
					productId={bundle.bundleProductId || bundle.storeProductIds?.[0]!}
					variant="row"
				/>
			) : null}
		</PurchasePanelShell>
	);
}
