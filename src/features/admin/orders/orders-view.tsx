"use client";

import * as React from "react";

import Link from "next/link";

import { Eye, Search, ShoppingBag } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
	useGetOrdersQuery,
	useUpdateOrderStatusMutation,
} from "@/types/graphql";

const initialOrders = [
	{
		id: "ORD-9482",
		customer: "Amira Al-Maktoum",
		email: "amira.m@dubai.ae",
		phone: "+971 50 123 4567",
		city: "Dubai",
		address: "Downtown Dubai, Boulevard Crescent Tower 1, Unit 1402",
		items: [{ name: "The Palace of Dreams (Hardcover)", qty: 1, price: 245.0 }],
		total: 245.0,
		paymentStatus: "Paid",
		fulfillmentStatus: "Delivered",
		date: "2026-08-10 11:20 AM",
	},
	{
		id: "ORD-9481",
		customer: "Tariq Mansoor",
		email: "tariq.mansoor@gmail.com",
		phone: "+971 55 987 6543",
		city: "Abu Dhabi",
		address: "Al Reem Island, Hydra Avenue, Apt 804",
		items: [
			{ name: "Desert Tales Vol. 2 (Signed Edition)", qty: 1, price: 180.0 },
		],
		total: 180.0,
		paymentStatus: "Paid",
		fulfillmentStatus: "Processing",
		date: "2026-08-10 10:45 AM",
	},
	{
		id: "ORD-9480",
		customer: "Sarah Jenkins",
		email: "sarah.j@company.com",
		phone: "+971 52 333 4455",
		city: "Sharjah",
		address: "Al Majaz Waterfront 2, Villa 12",
		items: [{ name: "History of Modern Arabia", qty: 1, price: 120.0 }],
		total: 120.0,
		paymentStatus: "Paid",
		fulfillmentStatus: "Shipped",
		date: "2026-08-10 09:15 AM",
	},
	{
		id: "ORD-9479",
		customer: "Khaled Ben Omar",
		email: "khaled@benomar.com",
		phone: "+971 56 444 8899",
		city: "Dubai",
		address: "Dubai Marina, Marina Gate 2, Unit 2201",
		items: [{ name: "Arabic Poetry Collection 2026", qty: 1, price: 310.0 }],
		total: 310.0,
		paymentStatus: "Paid",
		fulfillmentStatus: "Delivered",
		date: "2026-08-10 08:30 AM",
	},
];

export function OrdersView() {
	const { data, isLoading, refetch } = useGetOrdersQuery();
	const orders = data?.orders || [];

	const { mutate: updateStatus, isPending: isUpdating } =
		useUpdateOrderStatusMutation({
			onSuccess: () => refetch(),
		});

	const [search, setSearch] = React.useState("");
	const [statusFilter, setStatusFilter] = React.useState("Pending");

	const filtered = orders.filter((o) => {
		const matchesSearch =
			o.id.toLowerCase().includes(search.toLowerCase()) ||
			o.email.toLowerCase().includes(search.toLowerCase());

		let matchesStatus = false;
		const oStatus = o.status.toUpperCase();

		if (statusFilter === "All") matchesStatus = true;
		else if (statusFilter === "Completed")
			matchesStatus = oStatus === "DELIVERED";
		else matchesStatus = oStatus === statusFilter.toUpperCase();

		return matchesSearch && matchesStatus;
	});

	const tabs = ["Pending", "Shipped", "Completed", "Cancelled", "All"];

	return (
		<div className="space-y-6">
			{/* Header Banner */}
			<div className="flex flex-col justify-between gap-4 rounded-lg border border-slate-200/80 bg-white p-5 shadow-xs sm:flex-row sm:items-center dark:border-slate-800 dark:bg-slate-900">
				<div>
					<div className="flex items-center gap-2">
						<ShoppingBag className="h-5 w-5 text-primary" />
						<h1 className="font-extrabold text-slate-900 text-xl dark:text-white">
							Customer Orders & Fulfillment
						</h1>
					</div>
					<p className="mt-1 text-slate-500 text-sm">
						Track transactions, manage GCC shipping fulfillments, and inspect
						order invoices.
					</p>
				</div>

				<Badge
					className="self-start px-3 py-1 text-sm sm:self-auto"
					variant="outline"
				>
					{orders.length} Total Orders
				</Badge>
			</div>

			{/* Tabs and Search Bar */}
			<div className="flex flex-col gap-4">
				<div className="hide-scrollbar flex items-center overflow-x-auto border-slate-200 border-b pb-px dark:border-slate-800">
					{tabs.map((tab) => (
						<button
							className={`whitespace-nowrap border-b-2 px-4 py-2.5 font-medium text-sm transition-colors ${
								statusFilter === tab
									? "border-primary text-primary"
									: "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 dark:text-slate-400 dark:hover:border-slate-700 dark:hover:text-slate-200"
							}`}
							key={tab}
							onClick={() => setStatusFilter(tab)}
						>
							{tab}
							<Badge className="ml-2 bg-slate-100 text-slate-600 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-400">
								{tab === "All"
									? orders.length
									: orders.filter((o) =>
											tab === "Completed"
												? o.status.toUpperCase() === "DELIVERED"
												: o.status.toUpperCase() === tab.toUpperCase()
										).length}
							</Badge>
						</button>
					))}
				</div>

				<div className="flex flex-col items-center justify-between gap-3 rounded-lg border border-slate-200/80 bg-white p-3 shadow-xs sm:flex-row dark:border-slate-800 dark:bg-slate-900">
					<div className="relative w-full sm:w-80">
						<Search className="absolute top-2.5 left-2.5 h-4 w-4 text-slate-400" />
						<Input
							className="h-9 border-none bg-slate-50 pl-8 text-sm dark:bg-slate-800"
							onChange={(e) => setSearch(e.target.value)}
							placeholder="Search by Order ID, customer, city..."
							value={search}
						/>
					</div>
				</div>
			</div>

			{/* Orders List Table */}
			<div className="rounded-lg border border-slate-200/80 bg-white p-4 shadow-xs sm:p-6 dark:border-slate-800 dark:bg-slate-900">
				<div className="overflow-x-auto">
					<table className="w-full text-left text-sm">
						<thead className="border-slate-200 border-b text-slate-500 dark:border-slate-800">
							<tr>
								<th className="px-3 py-3 font-semibold">Order ID</th>
								<th className="px-3 py-3 font-semibold">Customer Details</th>
								<th className="px-3 py-3 font-semibold">Date</th>
								<th className="px-3 py-3 font-semibold">Total</th>
								<th className="px-3 py-3 font-semibold">Payment</th>
								<th className="px-3 py-3 font-semibold">Fulfillment</th>
								<th className="px-3 py-3 font-semibold">Action</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-slate-100 dark:divide-slate-800">
							{filtered.map((ord) => (
								<tr
									className={`transition-colors ${ord.shippingMethod === "express" ? "bg-primary/20 hover:bg-primary/10 dark:bg-primary/10 dark:hover:bg-primary/20" : "hover:bg-slate-50/80 dark:hover:bg-slate-800/40"}`}
									key={ord.id}
								>
									<td className="px-3 py-3 font-semibold text-primary">
										<div className="flex flex-col items-start gap-1">
											<span>{ord.id}</span>
											{ord.shippingMethod === "express" && (
												<Badge
													className="h-4 border-primary/20 bg-primary/10 px-1.5 py-0 text-[9px] text-primary uppercase tracking-wider hover:bg-primary/20 dark:border-primary/30 dark:bg-primary/20 dark:text-primary"
													variant="warning"
												>
													Express
												</Badge>
											)}
										</div>
									</td>
									<td className="px-3 py-3">
										<div className="font-bold text-slate-900 dark:text-white">
											{ord.shippingAddress?.firstName}{" "}
											{ord.shippingAddress?.lastName}
										</div>
										<div className="mt-0.5 text-slate-500 text-xs">
											{ord.email}
										</div>
									</td>
									<td className="px-3 py-3 text-slate-500 text-sm">
										{ord.createdAt
											? new Date(Number(ord.createdAt)).toLocaleDateString()
											: "N/A"}
									</td>
									<td className="px-3 py-3 font-bold text-slate-900 dark:text-white">
										AED {ord.total.toFixed(2)}
									</td>
									<td className="px-3 py-3">
										<div className="flex flex-col items-start gap-1">
											<Badge
												className="text-[10px]"
												variant={ord.isPaid ? "success" : "secondary"}
											>
												{ord.isPaid ? "Paid" : "Unpaid"}
											</Badge>
										</div>
									</td>
									<td className="px-3 py-3">
										<Badge className="text-[10px]" variant="outline">
											{ord.status}
										</Badge>
									</td>
									<td className="px-3 py-3">
										<Button
											asChild
											className="h-8 gap-1 text-sm"
											size="sm"
											variant="ghost"
										>
											<Link href={`/admin/orders/${ord.id}`}>
												<Eye className="h-3.5 w-3.5" /> View
											</Link>
										</Button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}
