"use client";

import Link from "next/link";

import { CreditCard, ShieldCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PaymentTabProps {
	paymentMethods: any[];
	loading?: boolean;
	onAddCard?: () => void;
}

export const PaymentTab = ({
	paymentMethods,
	loading = false,
	onAddCard,
}: PaymentTabProps) => {
	if (loading) {
		return (
			<div className="py-16 text-center text-sm text-stone-400 md:py-24">
				Loading payment methods…
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{paymentMethods.length === 0 ? (
				<Card>
					<CardContent className="flex flex-col items-center py-12 text-center md:py-16">
						<CreditCard className="mb-4 text-stone-300" size={40} />
						<p className="mb-2 font-bold text-secondary">No saved cards yet</p>
						<p className="mb-6 max-w-md text-sm text-stone-400">
							Cards used at checkout may appear here after you complete an
							order. Add a new card during your next purchase.
						</p>
						{onAddCard ? (
							<Button onClick={onAddCard} variant="premium">
								Go to checkout
							</Button>
						) : (
							<Button
								nativeButton={false}
								render={<Link href="/cart" />}
								variant="premium"
							>
								Go to cart
							</Button>
						)}
					</CardContent>
				</Card>
			) : (
				<div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
					{paymentMethods.map((method) => (
						<Card
							className={`group relative overflow-hidden transition-all duration-300 hover:shadow-md ${
								method.isDefault ? "ring-2 ring-primary ring-offset-2" : ""
							}`}
							key={method.id}
						>
							<div className="absolute -top-10 -right-10 opacity-[0.03] transition-transform duration-700 group-hover:scale-110">
								<CreditCard size={200} />
							</div>

							<CardHeader className="flex flex-row items-start justify-between pb-4">
								<div className="flex items-center gap-4">
									<div className="flex size-12 items-center justify-center rounded-2xl border border-stone-100 bg-stone-50">
										{method.provider === "Visa" ? (
											<span className="font-black text-blue-800 text-xl italic">
												VISA
											</span>
										) : (
											<div className="flex -space-x-2">
												<div className="size-6 rounded-full bg-red-500/80" />
												<div className="size-6 rounded-full bg-orange-500/80" />
											</div>
										)}
									</div>
									<div>
										<div className="flex items-center gap-2">
											<CardTitle className="font-bold text-lg">
												{method.provider} •••• {method.last4}
											</CardTitle>
											{method.isDefault ? (
												<Badge
													className="border-primary/20 bg-primary/5 font-bold text-[10px] text-primary uppercase tracking-wider"
													variant="outline"
												>
													Primary
												</Badge>
											) : null}
										</div>
										{method.expiry !== "—" ? (
											<p className="text-stone-400 text-xs">
												Expires {method.expiry}
											</p>
										) : null}
									</div>
								</div>
							</CardHeader>

							<CardContent className="flex items-center gap-2 pt-4 text-emerald-600">
								<ShieldCheck size={16} />
								<span className="font-bold text-xs uppercase tracking-wide">
									From past orders
								</span>
							</CardContent>
						</Card>
					))}
				</div>
			)}

			<div className="mt-8 flex items-start gap-4 rounded-lg border border-stone-100 bg-stone-50 p-6">
				<div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white shadow-soft">
					<ShieldCheck className="text-primary" size={20} />
				</div>
				<div>
					<h4 className="font-bold text-secondary text-sm">
						Your Security is Our Priority
					</h4>
					<p className="mt-1 text-stone-400 text-xs leading-relaxed">
						Rewaya uses secure checkout. We do not store full card numbers on
						our servers. New cards are saved when you pay at checkout.
					</p>
				</div>
			</div>
		</div>
	);
};
