"use client";

import { Filter } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { useGetOrdersQuery } from "@/types/graphql";

export function RecentOrdersTable() {
	const { data } = useGetOrdersQuery();
	const orders = data?.orders || [];

	const recentOrders = orders.slice(0, 5).map((o) => ({
		id: o.id.slice(-8).toUpperCase(),
		rawId: o.id,
		customer:
			`${o.shippingAddress?.firstName || ""} ${o.shippingAddress?.lastName || ""}`.trim() ||
			o.email,
		items: `${o.items.reduce((sum: number, i: any) => sum + i.quantity, 0)} items`,
		total: `AED ${o.total.toFixed(2)}`,
		status: o.status,
		date: o.createdAt
			? new Date(Number(o.createdAt)).toLocaleDateString()
			: "N/A",
	}));

	return (
		<div className="space-y-4 rounded-lg border border-slate-200/80 bg-white p-4 shadow-xs sm:p-6 lg:col-span-2 dark:border-slate-800 dark:bg-slate-900">
			<div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
				<div>
					<h2 className="font-bold text-base text-slate-900 sm:text-lg dark:text-white">
						Recent Customer Orders
					</h2>
					<p className="text-slate-500 text-sm">
						Latest bookstore transactions processed across UAE & GCC hubs
					</p>
				</div>
				<Button
					className="h-8 gap-1.5 self-start text-sm sm:self-auto"
					size="sm"
					variant="outline"
				>
					<Filter className="h-3.5 w-3.5" />
					Filter Orders
				</Button>
			</div>

			{/* Mobile Card List View (< md) */}
			<div className="grid grid-cols-1 gap-3 md:hidden">
				{recentOrders.map((order) => (
					<div
						className="space-y-2 rounded-lg border border-slate-100 bg-slate-50/50 p-3.5 dark:border-slate-800 dark:bg-slate-800/40"
						key={order.rawId}
					>
						<div className="flex items-center justify-between">
							<span className="font-semibold text-primary text-sm">
								{order.id}
							</span>
							<Badge
								className="px-2 py-0 text-[10px]"
								variant={
									order.status === "Delivered"
										? "success"
										: order.status === "Processing"
											? "secondary"
											: "outline"
								}
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
			<div className="hidden overflow-x-auto md:block">
				<table className="w-full text-left text-sm">
					<thead className="border-slate-200 border-b text-slate-500 dark:border-slate-800">
						<tr>
							<th className="px-3 py-2.5 font-semibold">Order ID</th>
							<th className="px-3 py-2.5 font-semibold">Customer</th>
							<th className="px-3 py-2.5 font-semibold">Book Items</th>
							<th className="px-3 py-2.5 font-semibold">Total</th>
							<th className="px-3 py-2.5 font-semibold">Status</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-slate-100 dark:divide-slate-800">
						{recentOrders.map((order) => (
							<tr
								className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
								key={order.rawId}
							>
								<td className="px-3 py-3 font-semibold text-primary">
									{order.id}
								</td>
								<td className="px-3 py-3 font-medium text-slate-800 dark:text-slate-200">
									{order.customer}
								</td>
								<td className="px-3 py-3 text-slate-600 dark:text-slate-400">
									{order.items}
								</td>
								<td className="px-3 py-3 font-bold text-slate-900 dark:text-white">
									{order.total}
								</td>
								<td className="px-3 py-3">
									<Badge
										className="px-2 py-0 text-[10px]"
										variant={
											order.status === "Delivered"
												? "success"
												: order.status === "Processing"
													? "secondary"
													: "outline"
										}
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
