"use client";

import * as React from "react";
import { Mail, MapPin, Phone, Search, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGetUsersQuery, useGetOrdersQuery } from "@/types/graphql";

const initialCustomers = [
	{
		id: "CUST-801",
		name: "Amira Al-Maktoum",
		email: "amira.m@dubai.ae",
		phone: "+971 50 123 4567",
		city: "Dubai",
		region: "UAE",
		ordersCount: 14,
		totalSpent: 3420.0,
		status: "VIP Member",
		joinDate: "Jan 2025",
	},
	{
		id: "CUST-802",
		name: "Tariq Mansoor",
		email: "tariq.mansoor@gmail.com",
		phone: "+971 55 987 6543",
		city: "Abu Dhabi",
		region: "UAE",
		ordersCount: 8,
		totalSpent: 1840.0,
		status: "Active",
		joinDate: "Mar 2025",
	},
	{
		id: "CUST-803",
		name: "Sarah Jenkins",
		email: "sarah.j@company.com",
		phone: "+971 52 333 4455",
		city: "Sharjah",
		region: "UAE",
		ordersCount: 5,
		totalSpent: 920.0,
		status: "Active",
		joinDate: "May 2025",
	},
	{
		id: "CUST-804",
		name: "Khaled Ben Omar",
		email: "khaled@benomar.com",
		phone: "+971 56 444 8899",
		city: "Dubai",
		region: "UAE",
		ordersCount: 19,
		totalSpent: 4890.0,
		status: "VIP Member",
		joinDate: "Dec 2024",
	},
	{
		id: "CUST-805",
		name: "Faisal Al-Riyami",
		email: "faisal@riyami.om",
		phone: "+968 91 234 567",
		city: "Muscat",
		region: "GCC (Oman)",
		ordersCount: 3,
		totalSpent: 640.0,
		status: "Active",
		joinDate: "Jun 2025",
	},
];

export function CustomersView() {
	const { data, isLoading } = useGetUsersQuery();
	const users = data?.users || [];
	
	const { data: ordersData } = useGetOrdersQuery();
	const orders = ordersData?.orders || [];
	
	const activeCustomersCount = users.filter(c => c.role !== "ADMIN" && c.role !== "admin").length;

	const [search, setSearch] = React.useState("");

	const filtered = users.filter(
		(c) =>
			c.role !== "ADMIN" &&
			c.role !== "admin" &&
			(c.name?.toLowerCase().includes(search.toLowerCase()) ||
			c.email.toLowerCase().includes(search.toLowerCase()) ||
			c.city?.toLowerCase().includes(search.toLowerCase()))
	);

	return (
		<div className="space-y-6">
			{/* Header Banner */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-lg border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
				<div>
					<div className="flex items-center gap-2">
						<Users className="h-5 w-5 text-primary" />
						<h1 className="font-extrabold text-xl text-slate-900 dark:text-white">
							Customers Directory
						</h1>
					</div>
					<p className="text-sm text-slate-500 mt-1">
						Registered bookstore accounts, order histories, and GCC regional
						breakdown.
					</p>
				</div>

				<Badge
					variant="outline"
					className="text-sm px-3 py-1 self-start sm:self-auto"
				>
					{activeCustomersCount} Active Customers
				</Badge>
			</div>

			{/* Search Bar */}
			<div className="rounded-lg border border-slate-200/80 bg-white p-3 shadow-xs dark:border-slate-800 dark:bg-slate-900">
				<div className="relative w-full sm:w-80">
					<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
					<Input
						placeholder="Search by customer name, email, city..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="h-9 pl-8 text-sm bg-slate-50 dark:bg-slate-800 border-none"
					/>
				</div>
			</div>

			{/* Customers Cards / Table */}
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{filtered.map((cust) => {
					const userOrders = orders.filter((o: any) => o.email.toLowerCase() === cust.email.toLowerCase());
					const ordersCount = userOrders.length;
					const totalSpent = userOrders.reduce((sum: number, o: any) => sum + o.total, 0);

					return (
					<div
						key={cust.id}
						className="flex flex-col justify-between space-y-4 rounded-lg border border-slate-200/80 bg-white p-5 shadow-xs transition-all hover:border-primary/40 dark:border-slate-800 dark:bg-slate-900"
					>
						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<Badge
									variant={
										cust.role === "VIP" ? "default" : "secondary"
									}
									className="text-[10px]"
								>
									{cust.role || "USER"}
								</Badge>
								<span className="font-semibold text-sm text-primary">
									{cust.id}
								</span>
							</div>

							<div>
								<h3 className="font-bold text-lg text-slate-900 dark:text-white">
									{cust.name || "Unknown"}
								</h3>
								<div className="flex items-center gap-1.5 text-sm text-slate-500 mt-0.5">
									<Mail className="h-3.5 w-3.5" />
									<span className="truncate">{cust.email}</span>
								</div>
								<div className="flex items-center gap-1.5 text-sm text-slate-500 mt-0.5">
									<MapPin className="h-3.5 w-3.5 text-rose-500" />
									<span>
										{cust.city || userOrders[0]?.shippingAddress?.city || "N/A"},{" "}
										{cust.region || userOrders[0]?.shippingAddress?.country || "N/A"}
									</span>
								</div>
							</div>
						</div>

						<div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-sm">
							<div>
								<div className="text-[10px] text-slate-400">Total Orders</div>
								<div className="font-bold text-slate-900 dark:text-white">
									{ordersCount} orders
								</div>
							</div>
							<div className="text-right">
								<div className="text-[10px] text-slate-400">Lifetime Spent</div>
								<div className="font-extrabold text-primary">
									AED {totalSpent.toFixed(2)}
								</div>
							</div>
						</div>
					</div>
					);
				})}
			</div>
		</div>
	);
}
