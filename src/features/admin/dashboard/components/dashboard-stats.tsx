"use client";

import {
	ArrowUpRight,
	BookOpen,
	ShoppingBag,
	TrendingUp,
	Users,
} from "lucide-react";

import {
	useGetOrdersQuery,
	useGetProductsQuery,
	useGetUsersQuery,
} from "@/types/graphql";

export function DashboardStats() {
	const { data: ordersData } = useGetOrdersQuery();
	const { data: usersData } = useGetUsersQuery();
	const { data: productsData } = useGetProductsQuery();

	const orders = ordersData?.orders || [];
	const users = usersData?.users || [];
	const products = productsData?.products || [];

	const totalSales = orders
		.filter((o) => o.isPaid)
		.reduce((sum, o) => sum + o.total, 0);
	const totalOrders = orders.length;
	const activeCustomers = users.length;
	const totalBooks = products.length;

	const stats = [
		{
			label: "Total Sales (AED)",
			value: totalSales.toLocaleString(undefined, {
				minimumFractionDigits: 2,
				maximumFractionDigits: 2,
			}),
			change: "Upward",
			trend: "up",
			icon: TrendingUp,
			desc: "All time paid revenue",
		},
		{
			label: "Total Orders",
			value: totalOrders.toLocaleString(),
			change: "Growing",
			trend: "up",
			icon: ShoppingBag,
			desc: "All time orders",
		},
		{
			label: "Active Customers",
			value: activeCustomers.toLocaleString(),
			change: "Active",
			trend: "up",
			icon: Users,
			desc: "Registered accounts",
		},
		{
			label: "Book Titles Listed",
			value: totalBooks.toLocaleString(),
			change: "Live",
			trend: "up",
			icon: BookOpen,
			desc: "Catalog synced via Database",
		},
	];

	return (
		<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
			{stats.map((stat, i) => {
				const Icon = stat.icon;
				return (
					<div
						className="space-y-3 rounded-lg border border-slate-200/80 bg-white p-5 shadow-xs transition-all hover:border-primary/40 dark:border-slate-800 dark:bg-slate-900"
						key={i}
					>
						<div className="flex items-center justify-between">
							<span className="font-medium text-slate-500 text-sm">
								{stat.label}
							</span>
							<div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary dark:bg-primary/20">
								<Icon className="h-4 w-4" />
							</div>
						</div>
						<div className="flex items-baseline justify-between">
							<span className="font-extrabold text-2xl text-slate-900 tracking-tight dark:text-white">
								{stat.value}
							</span>
							<span className="flex items-center font-bold text-emerald-600 text-sm dark:text-emerald-400">
								{stat.change} <ArrowUpRight className="h-3.5 w-3.5" />
							</span>
						</div>
						<p className="text-[11px] text-slate-400 dark:text-slate-500">
							{stat.desc}
						</p>
					</div>
				);
			})}
		</div>
	);
}
