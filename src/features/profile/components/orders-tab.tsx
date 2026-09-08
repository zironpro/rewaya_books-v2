"use client";

import Link from "next/link";

import { Package } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

interface OrdersTabProps {
	orders: any[];
	loading?: boolean;
}

function statusClass(status: string) {
	if (status === "Delivered") return "bg-emerald-100 text-emerald-700";
	if (status === "Shipped" || status === "Partially shipped") {
		return "bg-blue-100 text-blue-700";
	}
	if (status === "Cancelled") return "bg-red-100 text-red-700";
	return "bg-stone-100 text-stone-500";
}

export const OrdersTab = ({ orders, loading = false }: OrdersTabProps) => {
	if (loading) {
		return (
			<Card className="overflow-hidden">
				<CardContent className="py-16 text-center text-sm text-stone-400">
					Loading orders…
				</CardContent>
			</Card>
		);
	}

	if (orders.length === 0) {
		return (
			<Card className="overflow-hidden">
				<CardContent className="flex flex-col items-center py-16 text-center md:py-24">
					<Package className="mb-4 text-stone-300" size={40} />
					<p className="mb-2 font-bold text-secondary">No orders yet</p>
					<p className="mb-6 max-w-xs text-sm text-stone-400">
						When you place an order, it will appear here.
					</p>
					<Button asChild className="bg-primary text-white hover:bg-primary/90">
						<Link href="/shop">Browse shop</Link>
					</Button>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className="overflow-hidden">
			<CardHeader className="border-stone-100 border-b bg-stone-50/50 pb-6">
				<CardTitle className="font-serif text-2xl">Order History</CardTitle>
				<CardDescription>
					Manage and track your previous purchases
				</CardDescription>
			</CardHeader>
			<CardContent className="p-0">
				<div className="divide-y divide-stone-100">
					{orders.map((order) => (
						<div
							className="flex flex-col justify-between gap-4 p-5 transition-colors hover:bg-stone-50 md:flex-row md:items-center md:gap-6 md:p-6"
							key={order.orderId}
						>
							<div className="flex items-center gap-4 md:gap-6">
								<div className="flex size-14 shrink-0 items-center justify-center rounded-2xl border border-stone-100 bg-white">
									<Package className="text-stone-400" size={24} />
								</div>
								<div>
									<p className="font-bold text-lg text-secondary transition-colors hover:text-primary">
										<Link href={`/profile/orders/${order.orderId}`}>
											{order.id}
										</Link>
									</p>
									<p className="text-sm text-stone-400">
										{order.date} • {order.items} items
									</p>
								</div>
							</div>
							<div className="flex items-center justify-between gap-8 md:justify-end">
								<div className="flex flex-col items-end gap-2 text-right">
									<div>
										<p className="font-bold text-lg text-secondary">
											{order.total}
										</p>
										<span
											className={`rounded-full px-2 py-1 font-bold text-[10px] uppercase tracking-wider ${statusClass(order.status)}`}
										>
											{order.status}
										</span>
									</div>
									{order.trackingUrl && (
										<Button
											render={
												<a
													href={order.trackingUrl}
													rel="noreferrer"
													target="_blank"
												/>
											}
											size="xs"
											variant="outline"
										>
											Track Order
										</Button>
									)}
								</div>
							</div>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
};
