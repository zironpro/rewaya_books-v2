"use client";

import Link from "next/link";

import { Edit2, Package } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

interface OverviewTabProps {
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
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

export const OverviewTab = ({
	firstName,
	lastName,
	email,
	phone,
	orders,
	loading = false,
}: OverviewTabProps) => {
	const recentOrder = orders[0];

	return (
		<div className="space-y-6 lg:space-y-8">
			<div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between">
						<div>
							<CardTitle className="font-serif text-2xl">
								Personal Info
							</CardTitle>
							<CardDescription>Your account details</CardDescription>
						</div>
						<Button
							className="rounded-full"
							nativeButton={false}
							render={<Link href="/profile/settings" />}
							size="icon"
							variant="ghost"
						>
							<Edit2 size={16} />
						</Button>
					</CardHeader>
					<CardContent className="space-y-5">
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-1">
								<p className="font-bold text-stone-400 text-xs uppercase">
									First Name
								</p>
								<p className="font-bold text-secondary">
									{loading ? "…" : firstName || "—"}
								</p>
							</div>
							<div className="space-y-1">
								<p className="font-bold text-stone-400 text-xs uppercase">
									Last Name
								</p>
								<p className="font-bold text-secondary">
									{loading ? "…" : lastName || "—"}
								</p>
							</div>
						</div>
						<div className="space-y-1">
							<p className="font-bold text-stone-400 text-xs uppercase">
								Email
							</p>
							<p className="font-bold text-secondary">
								{loading ? "…" : email || "—"}
							</p>
						</div>
						<div className="space-y-1">
							<p className="font-bold text-stone-400 text-xs uppercase">
								Phone
							</p>
							<p className="font-bold text-secondary">
								{loading ? "…" : phone}
							</p>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="font-serif text-2xl">
							Recent Activity
						</CardTitle>
						<CardDescription>Your latest order updates</CardDescription>
					</CardHeader>
					<CardContent>
						{loading ? (
							<p className="text-sm text-stone-400">Loading…</p>
						) : recentOrder ? (
							<div className="flex gap-4">
								<div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-stone-50">
									<Package className="text-primary" size={20} />
								</div>
								<div>
									<p className="font-bold text-secondary text-sm hover:text-primary transition-colors">
										<Link href={`/profile/orders/${recentOrder.orderId}`}>
											Order {recentOrder.id} — {recentOrder.status}
										</Link>
									</p>
									<p className="text-stone-400 text-xs">{recentOrder.date}</p>
								</div>
							</div>
						) : (
							<p className="text-sm text-stone-400">
								No orders yet.{" "}
								<Link className="text-primary underline" href="/shop">
									Start shopping
								</Link>
							</p>
						)}
					</CardContent>
				</Card>
			</div>

			<Card className="overflow-hidden">
				<CardHeader className="border-stone-100 border-b bg-stone-50/50 pb-6">
					<div className="flex items-center justify-between gap-4">
						<CardTitle className="font-serif text-2xl">Active Orders</CardTitle>
						<Button
							className="rounded-xl"
							nativeButton={false}
							render={<Link href="/profile/orders" />}
							size="sm"
							variant="outline"
						>
							View all
						</Button>
					</div>
				</CardHeader>
				<CardContent className="p-0">
					{loading ? (
						<p className="p-6 text-sm text-stone-400">Loading orders…</p>
					) : orders.length === 0 ? (
						<p className="p-6 text-sm text-stone-400">No orders to show.</p>
					) : (
						<div className="divide-y divide-stone-100">
							{orders.slice(0, 2).map((order) => (
								<div
									className="flex items-center justify-between p-5 transition-colors hover:bg-stone-50 md:p-6"
									key={order.orderId}
								>
									<div className="flex items-center gap-4 md:gap-6">
										<div className="flex size-12 items-center justify-center rounded-2xl border border-stone-100 bg-white">
											<Package className="text-stone-400" size={20} />
										</div>
										<div>
											<p className="font-bold text-secondary hover:text-primary transition-colors">
												<Link href={`/profile/orders/${order.orderId}`}>
													{order.id}
												</Link>
											</p>
											<p className="text-sm text-stone-400">
												{order.date} • {order.items} items
											</p>
										</div>
									</div>
									<div className="text-right">
										<p className="mb-1 font-bold text-secondary">
											{order.total}
										</p>
										<span
											className={`rounded-full px-2 py-0.5 font-bold text-[10px] uppercase tracking-wider ${statusClass(order.status)}`}
										>
											{order.status}
										</span>
									</div>
								</div>
							))}
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
};
