"use client";

import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import type { CartSummary } from "@/features/cart/cart-sdk";

interface CartOrderSummaryProps {
	summary: CartSummary;
	displayTotal?: string;
	hasUnavailable: boolean;
	checkingOut: boolean;
	onCheckout: () => void;
}

export function CartOrderSummary({
	summary,
	displayTotal,
	hasUnavailable,
	checkingOut,
	onCheckout,
}: CartOrderSummaryProps) {
	return (
		<Card className="sticky top-32 bg-card">
			<CardHeader className="border-b pb-4">
				<CardTitle className="font-bold font-display">Order Summary</CardTitle>
			</CardHeader>
			<CardContent className="space-y-0 pt-6">
				<div className="space-y-4">
					<div className="flex justify-between text-muted-foreground text-sm">
						<span>Subtotal</span>
						<span>{summary.subtotal ?? "-klp"}</span>
					</div>
					{summary.discount ? (
						<div className="flex justify-between text-muted-foreground text-sm">
							<span>
								Discount
								{summary.discountNames.length > 0 && (
									<span className="font-normal text-stone-400">
										{" "}
										· {summary.discountNames.join(", ")}
									</span>
								)}
							</span>
							<span>-{summary.discount}</span>
						</div>
					) : summary.discountNames.length > 0 ? (
						<div className="flex justify-between text-muted-foreground text-sm">
							<span>Applied discount</span>
							<span className="text-right text-stone-400">
								{summary.discountNames.join(", ")}
							</span>
						</div>
					) : null}
					<div className="flex justify-between text-muted-foreground text-sm">
						<span>Shipping</span>
						<span>{summary.shipping ?? "Calculated at checkout"}</span>
					</div>
				</div>

				<Separator className="my-6" />

				<div className="flex items-end justify-between">
					<span className="font-semibold text-sm">Total</span>
					<span className="font-bold text-2xl text-primary tracking-tight">
						{displayTotal ?? "-"}
					</span>
				</div>

				{hasUnavailable && (
					<p className="mt-4 text-destructive text-xs">
						Remove unavailable items to continue.
					</p>
				)}

				<Button
					className="mt-6 w-full"
					disabled={checkingOut || hasUnavailable}
					onClick={onCheckout}
					variant="secondary"
				>
					{checkingOut ? "Redirecting…" : "Checkout"}
					<ArrowRight
						className="ml-2 transition-transform group-hover:translate-x-1"
						size={16}
					/>
				</Button>
			</CardContent>
		</Card>
	);
}
