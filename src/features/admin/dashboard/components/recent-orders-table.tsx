"use client";

import { Filter } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGetOrdersQuery } from "@/types/graphql";

export function RecentOrdersTable() {
	const { data } = useGetOrdersQuery();
	const orders = data?.orders || [];
	
	const recentOrders = orders.slice(0, 5).map(o => ({
		id: o.id.slice(-8).toUpperCase(),
		rawId: o.id,
		customer: `${o.shippingAddress?.firstName || ""} ${o.shippingAddress?.lastName || ""}`.trim() || o.email,
		items: `${o.items.reduce((sum: number, i: any) => sum + i.quantity, 0)} items`,
		total: `AED ${o.total.toFixed(2)}`,
		status: o.status,
		date: o.createdAt ? new Date(Number(o.createdAt)).toLocaleDateString() : "N/A",
	}));

	return (
		<div className="space-y-4 rounded-lg border border-slate-200/80 bg-white p-4 sm:p-6 shadow-xs lg:col-span-2 dark:border-slate-800 dark:bg-slate-900">
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
				<div>
					<h2 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">
						Recent Customer Orders
					</h2>
					<p className="text-sm text-slate-500">
						Latest bookstore transactions processed across UAE & GCC hubs
					</p>
				</div>
				<Button
					size="sm"
					variant="outline"
					className="text-sm gap-1.5 h-8 self-start sm:self-auto"
				>
					<Filter className="h-3.5 w-3.5" />
					Filter Orders
				</Button>
			</div>

			{/* Mobile Card List View (< md) */}
			<div className="grid grid-cols-1 gap-3 md:hidden">
				{recentOrders.map((order) => (
					<div
						key={order.rawId}
						className="rounded-lg border border-slate-100 bg-slate-50/50 p-3.5 space-y-2 dark:border-slate-800 dark:bg-slate-800/40"
					>
						<div className="flex items-center justify-between">
							<span className="font-semibold text-sm text-primary">
								{order.id}
							</span>
							<Badge
								variant={
									order.status === "Delivered"
										? "success"
										: order.status === "Processing"
											? "secondary"
											: "outline"
								}
								className="px-2 py-0 text-[10px]"
							>
								{order.status}
							</Badge>
						</div>
						<div className="flex items-center justify-between text-sm">
							<span className="font-medium text-slate-800 dark:text-slate-200">
								{order.customer}
							</span>
							<span className="font-bold text-slate-900 dark:text-white">
								{order.total}
							</span>
						</div>
						<div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
							<span className="shrink-0">{order.items}</span>
							<span className="shrink-0">{order.date}</span>
						</div>
					</div>
				))}
			</div>

			{/* Desktop Table View (>= md) */}
			<div className="hidden md:block overflow-x-auto">
				<table className="w-full text-left text-sm">
					<thead className="border-b border-slate-200 text-slate-500 dark:border-slate-800">
						<tr>
							<th className="py-2.5 px-3 font-semibold">Order ID</th>
							<th className="py-2.5 px-3 font-semibold">Customer</th>
							<th className="py-2.5 px-3 font-semibold">Book Items</th>
							<th className="py-2.5 px-3 font-semibold">Total</th>
							<th className="py-2.5 px-3 font-semibold">Status</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-slate-100 dark:divide-slate-800">
						{recentOrders.map((order) => (
							<tr
								key={order.rawId}
								className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
							>
								<td className="py-3 px-3 font-semibold text-primary">
									{order.id}
								</td>
								<td className="py-3 px-3 font-medium text-slate-800 dark:text-slate-200">
									{order.customer}
								</td>
								<td className="py-3 px-3 text-slate-600 dark:text-slate-400">
									{order.items}
								</td>
								<td className="py-3 px-3 font-bold text-slate-900 dark:text-white">
									{order.total}
								</td>
								<td className="py-3 px-3">
									<Badge
										variant={
											order.status === "Delivered"
												? "success"
												: order.status === "Processing"
													? "secondary"
													: "outline"
										}
										className="px-2 py-0 text-[10px]"
									>
										{order.status}
									</Badge>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
