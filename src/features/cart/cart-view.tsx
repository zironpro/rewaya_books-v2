"use client";

import { useEffect, useState, useTransition } from "react";

import { useOpenPanel } from "@openpanel/nextjs";

import { StatusBanner } from "@/components/feedback/status-banner";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import { toastManager } from "@/components/ui/toast";

import { redirectToCheckout } from "@/features/cart/cart-actions";
import { useCart } from "@/features/cart/cart-provider";
import { isItemUnavailable } from "@/features/cart/cart-sdk";
import { CartEmpty } from "@/features/cart/components/cart-empty";
import { CartLineItem } from "@/features/cart/components/cart-line-item";
import { CartLoading } from "@/features/cart/components/cart-loading";
import { CartOrderSummary } from "@/features/cart/components/cart-order-summary";
import { trackMetaEvent } from "@/lib/analytics/meta";

export function CartView() {
	const { track } = useOpenPanel();
	const { snapshot, isLoading, error, updateQuantity, removeItem } = useCart();
	const items = snapshot?.lineItems ?? [];
	const summary = snapshot?.summary ?? { discountNames: [] };
	const [actionError, setActionError] = useState<string | null>(error);
	const [checkingOut, startCheckout] = useTransition();

	useEffect(() => {
		if (error) setActionError(error);
	}, [error]);

	const handleUpdateQuantity = async (itemId: string, quantity: number) => {
		if (quantity < 1) return;
		try {
			await updateQuantity(itemId, quantity);
			setActionError(null);
		} catch (e: any) {
			setActionError(
				e.message || "Could not update quantity. Please try again."
			);
		}
	};

	const handleRemoveItem = async (itemId: string) => {
		try {
			await removeItem(itemId);
			setActionError(null);
			toastManager.add({ title: "Item removed", type: "success" });
		} catch (e: any) {
			setActionError(e.message || "Could not remove item. Please try again.");
		}
	};

	const handleCheckout = () => {
		// Track InitiateCheckout event
		if (typeof window !== "undefined") {
			trackMetaEvent("InitiateCheckout", {
				event_source_url: window.location.href,
				custom_data: {
					value: Number(summary.total) ?? Number(summary.subtotal),
					currency: "AED",
					num_items: items.length,
				},
			});
		}
		track("checkout", {
			value: Number(summary.total) ?? Number(summary.subtotal),
			num_items: items.length,
		});
		// Redirect to checkout
		startCheckout(() => redirectToCheckout());
	};

	const hasUnavailable = items.some(isItemUnavailable);
	const displayTotal = summary.total ?? summary.subtotal;

	return (
		<main className="grow pt-4 pb-28 md:pb-16">
			<div className="container">
				<Breadcrumbs className="mb-4" items={[{ label: "Shopping Bag" }]} />

				{actionError ? (
					<StatusBanner className="mb-6" variant="error">
						{actionError}
					</StatusBanner>
				) : null}
				<div className="mb-12">
					<h1 className="font-bold font-serif text-3xl text-secondary sm:text-4xl md:text-5xl">
						Shopping <span className="font-normal italic">Bag</span>.
					</h1>
				</div>

				{isLoading ? (
					<CartLoading />
				) : items.length === 0 ? (
					<CartEmpty />
				) : (
					<div className="flex flex-col gap-12 lg:flex-row">
						<div className="grow space-y-4">
							<div className="hidden grid-cols-4 border-stone-100 border-b pb-4 font-bold text-sm text-stone-400 md:grid">
								<div className="col-span-2">Item</div>
								<div className="text-center">Quantity</div>
								<div className="text-right">Total</div>
							</div>

							{items.map((item) => (
								<CartLineItem
									item={item}
									key={item._id ?? ""}
									onRemove={handleRemoveItem}
									onUpdateQuantity={handleUpdateQuantity}
								/>
							))}
						</div>
						<aside className="w-full lg:w-96">
							<CartOrderSummary
								checkingOut={checkingOut}
								displayTotal={displayTotal}
								hasUnavailable={hasUnavailable}
								onCheckout={handleCheckout}
								summary={summary}
							/>
						</aside>
					</div>
				)}
			</div>
		</main>
	);
}
