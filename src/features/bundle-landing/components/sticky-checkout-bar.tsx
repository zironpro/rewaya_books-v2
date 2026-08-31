"use client";

import type { BundlePresentation } from "@/domain/bundle";
import { cn } from "@/lib/utils";

import { useStickyNav } from "../hooks/useStickyNav";
import { BundleCheckoutCta } from "./bundle-checkout-cta";

interface StickyCheckoutBarProps {
	bundle: BundlePresentation;
}

export function StickyCheckoutBar({ bundle }: StickyCheckoutBarProps) {
	const { pastHero } = useStickyNav();
	return (
		<div
			className={cn(
				"fixed inset-x-0 bottom-0 z-40 md:hidden",
				"border-(--bundle-gold)/25 border-t bg-card/90 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-8px_30px_rgba(44,36,28,0.12)] backdrop-blur-md transition-transform duration-300 ease-out will-change-transform",
				pastHero ? "translate-y-0" : "translate-y-full"
			)}
		>
			<div className="mx-auto flex max-w-lg items-center gap-3">
				<div className="min-w-0 flex-1">
					<p className="truncate font-bold font-display text-lg text-secondary">
						{bundle.name}
					</p>
					<p className="text-muted-foreground text-xs">
						<span className="font-semibold text-secondary">
							AED {bundle.price}
						</span>{" "}
						<span className="line-through">AED {bundle.originalPrice}</span>
					</p>
				</div>
				<div className="shrink-0">
					<BundleCheckoutCta
						bundle={bundle}
						className="text-sm"
						label="Checkout"
						mode="checkout"
						size="sm"
					/>
				</div>
			</div>
		</div>
	);
}
