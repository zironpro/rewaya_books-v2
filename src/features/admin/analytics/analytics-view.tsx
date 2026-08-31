"use client";

import * as React from "react";

import {
	ArrowUpRight,
	BookOpen,
	Calendar as CalendarIcon,
	DollarSign,
	Download,
	FileText,
	Globe,
	ShoppingBag,
	TrendingUp,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useGetOrdersQuery, useGetProductsQuery } from "@/types/graphql";

export function AnalyticsView() {
	const [timeRange, setTimeRange] = React.useState("this-month");

	// Sales Report Modal State
	const [isReportModalOpen, setIsReportModalOpen] = React.useState(false);
	const [reportStartDate, setReportStartDate] = React.useState("");
	const [reportEndDate, setReportEndDate] = React.useState("");
	const [isDownloadingReport, setIsDownloadingReport] = React.useState(false);

	const handleDownloadReport = () => {
		if (!reportStartDate || !reportEndDate) return;
		setIsDownloadingReport(true);

		const url = `/api/admin/reports/sales?startDate=${reportStartDate}&endDate=${reportEndDate}`;

		const a = document.createElement("a");
		a.href = url;
		a.download = "sales_report.pdf";
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);

		setIsDownloadingReport(false);
		setIsReportModalOpen(false);
	};

	const setThisMonth = () => {
		const now = new Date();
		const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
		const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

		const formatDate = (date: Date) => {
			const year = date.getFullYear();
			const month = String(date.getMonth() + 1).padStart(2, '0');
			const day = String(date.getDate()).padStart(2, '0');
			return `${year}-${month}-${day}`;
		};

		setReportStartDate(formatDate(firstDay));
		setReportEndDate(formatDate(lastDay));
	};

	const { data: ordersData } = useGetOrdersQuery();
	const { data: productsData } = useGetProductsQuery();
	const orders = ordersData?.orders || [];
	const products = productsData?.products || [];

	const paidOrders = orders.filter((o: any) => o.isPaid);
	const totalSales = paidOrders.reduce(
		(sum: number, o: any) => sum + o.total,
		0
	);
	const avgOrderValue =
		paidOrders.length > 0 ? totalSales / paidOrders.length : 0;

	const totalUnits = paidOrders.reduce((sum: number, o: any) => {
		return (
			sum +
			o.items.reduce((itemSum: number, item: any) => itemSum + item.quantity, 0)
		);
	}, 0);

	const regionMap: Record<string, { sales: number; orders: number }> = {};
	paidOrders.forEach((o: any) => {
		const region = o.shippingAddress?.country || "Unknown";
		if (!regionMap[region]) regionMap[region] = { sales: 0, orders: 0 };
		regionMap[region].sales += o.total;
		regionMap[region].orders += 1;
	});

	const regionalSales = Object.keys(regionMap)
		.sort((a, b) => regionMap[b].sales - regionMap[a].sales)
		.slice(0, 5)
		.map((region) => {
			const data = regionMap[region];
			return {
				region,
				sales: `AED ${data.sales.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
				percentage:
					totalSales > 0
						? `${Math.round((data.sales / totalSales) * 100)}%`
						: "0%",
				orders: data.orders,
			};
		});

	const productCategoryMap: Record<string, string> = {};
	products.forEach((p: any) => {
		productCategoryMap[p.title] = p.categoryName || "Uncategorized";
	});

	const categoryMap: Record<string, { sales: number; count: number }> = {};
	const bookMap: Record<
		string,
		{ units: number; revenue: number; category: string }
	> = {};

	paidOrders.forEach((o: any) => {
		o.items.forEach((item: any) => {
			const category = productCategoryMap[item.title] || "Uncategorized";

			if (!categoryMap[category])
				categoryMap[category] = { sales: 0, count: 0 };
			categoryMap[category].sales += item.price * item.quantity;
			categoryMap[category].count += item.quantity;

			if (!bookMap[item.title])
				bookMap[item.title] = { units: 0, revenue: 0, category };
			bookMap[item.title].units += item.quantity;
			bookMap[item.title].revenue += item.price * item.quantity;
		});
	});

	const categorySales = Object.keys(categoryMap)
		.sort((a, b) => categoryMap[b].sales - categoryMap[a].sales)
		.slice(0, 5)
		.map((cat) => {
			const data = categoryMap[cat];
			return {
				name: cat,
				sales: data.sales,
				percentage:
					totalSales > 0 ? Math.round((data.sales / totalSales) * 100) : 0,
				count: data.count,
			};
		});

	const topBooks = Object.keys(bookMap)
		.sort((a, b) => bookMap[b].revenue - bookMap[a].revenue)
		.slice(0, 5)
		.map((title, index) => {
			const data = bookMap[title];
			return {
				rank: index + 1,
				title,
				category: data.category,
				revenue: `AED ${data.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
				units: data.units,
			};
		});

	return (
		<div className="space-y-6">
			{/* Header Banner */}
			<div className="flex flex-col justify-between gap-4 rounded-lg border border-slate-200/80 bg-white p-5 shadow-xs sm:flex-row sm:items-center dark:border-slate-800 dark:bg-slate-900">
				<div>
					<div className="flex items-center gap-2">
						<TrendingUp className="h-5 w-5 text-primary" />
						<h1 className="font-extrabold text-slate-900 text-xl dark:text-white">
							Sales & Revenue Analytics
						</h1>
					</div>
					<p className="mt-1 text-slate-500 text-sm">
						Comprehensive breakdown of total sales AED, category revenues, and
						regional performance.
					</p>
				</div>

				<div className="flex items-center gap-2 self-start sm:self-auto">
					<Dialog onOpenChange={setIsReportModalOpen} open={isReportModalOpen}>
						<DialogTrigger asChild>
							<Button
								className="h-9 gap-2 bg-slate-900 text-sm text-white hover:bg-slate-800 hover:text-white dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-200"
								size="sm"
								variant="outline"
							>
								<FileText className="h-3.5 w-3.5" /> Sales Report
							</Button>
						</DialogTrigger>
						<DialogContent className="sm:max-w-md">
							<DialogHeader>
								<DialogTitle>Download Sales Report</DialogTitle>
								<DialogDescription>
									Select a date range to generate a PDF invoice of all sales.
								</DialogDescription>
							</DialogHeader>

							<div className="flex flex-col gap-4 py-4">
								<Button
									className="w-full gap-2 border-primary/20 text-primary hover:bg-primary/5"
									onClick={setThisMonth}
									variant="outline"
								>
									<CalendarIcon className="h-4 w-4" /> Select Current Month
								</Button>

								<div className="relative">
									<div className="absolute inset-0 flex items-center">
										<span className="w-full border-slate-200 border-t dark:border-slate-800" />
									</div>
									<div className="relative flex justify-center text-xs uppercase">
										<span className="bg-white px-2 text-slate-500 dark:bg-slate-950 dark:text-slate-400">
											Or custom range
										</span>
									</div>
								</div>

								<div className="grid grid-cols-2 gap-4">
									<div className="flex flex-col gap-2">
										<Label htmlFor="start-date">Start Date</Label>
										<Input
											id="start-date"
											onChange={(e) => setReportStartDate(e.target.value)}
											type="date"
											value={reportStartDate}
										/>
									</div>
									<div className="flex flex-col gap-2">
										<Label htmlFor="end-date">End Date</Label>
										<Input
											id="end-date"
											onChange={(e) => setReportEndDate(e.target.value)}
											type="date"
											value={reportEndDate}
										/>
									</div>
								</div>
							</div>

							<DialogFooter>
								<Button
									onClick={() => setIsReportModalOpen(false)}
									variant="outline"
								>
									Cancel
								</Button>
								<Button
									className="gap-2"
									disabled={
										!reportStartDate || !reportEndDate || isDownloadingReport
									}
									onClick={handleDownloadReport}
								>
									<Download className="h-4 w-4" />
									{isDownloadingReport ? "Generating..." : "Download PDF"}
								</Button>
							</DialogFooter>
						</DialogContent>
					</Dialog>
				</div>
			</div>

			{/* Main Revenue Stats Grid */}
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
				<div className="space-y-2 rounded-lg border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
					<div className="flex items-center justify-between text-slate-500 text-sm">
						<span>Total Sales Revenue</span>
						<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
							<TrendingUp className="h-4 w-4" />
						</div>
					</div>
					<div className="flex items-baseline justify-between">
						<span className="font-extrabold text-2xl text-slate-900 tracking-tight dark:text-white">
							AED{" "}
							{totalSales.toLocaleString(undefined, {
								minimumFractionDigits: 2,
								maximumFractionDigits: 2,
							})}
						</span>
					</div>
					<div className="flex items-center gap-1.5 font-semibold text-emerald-600 text-sm dark:text-emerald-400">
						<ArrowUpRight className="h-3.5 w-3.5" /> +14.2% vs last month
					</div>
				</div>

				<div className="space-y-2 rounded-lg border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
					<div className="flex items-center justify-between text-slate-500 text-sm">
						<span>Net Profit Estimated</span>
						<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
							<DollarSign className="h-4 w-4" />
						</div>
					</div>
					<div className="flex items-baseline justify-between">
						<span className="font-extrabold text-2xl text-slate-900 tracking-tight dark:text-white">
							AED{" "}
							{(totalSales * 0.3).toLocaleString(undefined, {
								minimumFractionDigits: 2,
								maximumFractionDigits: 2,
							})}
						</span>
					</div>
					<div className="flex items-center gap-1.5 font-semibold text-emerald-600 text-sm dark:text-emerald-400">
						<ArrowUpRight className="h-3.5 w-3.5" /> +11.8% margin rate
					</div>
				</div>

				<div className="space-y-2 rounded-lg border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
					<div className="flex items-center justify-between text-slate-500 text-sm">
						<span>Average Order Value</span>
						<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600">
							<ShoppingBag className="h-4 w-4" />
						</div>
					</div>
					<div className="flex items-baseline justify-between">
						<span className="font-extrabold text-2xl text-slate-900 tracking-tight dark:text-white">
							AED{" "}
							{avgOrderValue.toLocaleString(undefined, {
								minimumFractionDigits: 2,
								maximumFractionDigits: 2,
							})}
						</span>
					</div>
					<div className="flex items-center gap-1.5 font-semibold text-emerald-600 text-sm dark:text-emerald-400">
						<ArrowUpRight className="h-3.5 w-3.5" /> +4.3% per basket
					</div>
				</div>

				<div className="space-y-2 rounded-lg border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
					<div className="flex items-center justify-between text-slate-500 text-sm">
						<span>Total Units Sold</span>
						<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600">
							<BookOpen className="h-4 w-4" />
						</div>
					</div>
					<div className="flex items-baseline justify-between">
						<span className="font-extrabold text-2xl text-slate-900 tracking-tight dark:text-white">
							{totalUnits.toLocaleString()} books
						</span>
					</div>
					<div className="flex items-center gap-1.5 font-semibold text-emerald-600 text-sm dark:text-emerald-400">
						<ArrowUpRight className="h-3.5 w-3.5" /> +9.6% volume
					</div>
				</div>
			</div>

			{/* Category Breakdown & Regional Distribution */}
			<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
				{/* Category Revenue Share */}
				<div className="space-y-4 rounded-lg border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
					<div className="flex items-center justify-between">
						<h2 className="font-bold text-lg text-slate-900 dark:text-white">
							Sales by Category (AED)
						</h2>
						<Badge className="text-[10px]" variant="secondary">
							Top 5 Categories
						</Badge>
					</div>

					<div className="space-y-3 pt-2">
						{categorySales.map((cat) => (
							<div className="space-y-1.5" key={cat.name}>
								<div className="flex items-center justify-between text-sm">
									<span className="font-semibold text-slate-800 dark:text-slate-200">
										{cat.name} ({cat.count} sold)
									</span>
									<span className="font-bold text-slate-900 dark:text-white">
										AED{" "}
										{cat.sales.toLocaleString(undefined, {
											minimumFractionDigits: 2,
											maximumFractionDigits: 2,
										})}{" "}
										({cat.percentage}%)
									</span>
								</div>
								<div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
									<div
										className="h-full rounded-full bg-gradient-to-r from-primary to-primary-dark transition-all duration-500"
										style={{ width: `${cat.percentage}%` }}
									/>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Regional Sales Breakdown */}
				<div className="space-y-4 rounded-lg border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
					<div className="flex items-center justify-between">
						<h2 className="font-bold text-lg text-slate-900 dark:text-white">
							Regional GCC Sales Distribution
						</h2>
						<Globe className="h-4 w-4 text-slate-400" />
					</div>

					<div className="divide-y divide-slate-100 dark:divide-slate-800">
						{regionalSales.map((reg) => (
							<div
								className="flex items-center justify-between py-3"
								key={reg.region}
							>
								<div>
									<div className="font-semibold text-slate-900 text-sm dark:text-white">
										{reg.region}
									</div>
									<div className="text-[11px] text-slate-500">
										{reg.orders} completed orders
									</div>
								</div>
								<div className="text-right">
									<div className="font-bold text-slate-900 text-sm dark:text-white">
										{reg.sales}
									</div>
									<Badge className="text-[10px]" variant="outline">
										{reg.percentage} share
									</Badge>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>

			{/* Top Bestselling Books Leaderboard */}
			<div className="space-y-4 rounded-lg border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
				<h2 className="font-bold text-lg text-slate-900 dark:text-white">
					Top Revenue Generating Books
				</h2>

				<div className="overflow-x-auto">
					<table className="w-full text-left text-sm">
						<thead className="border-slate-200 border-b text-slate-500 dark:border-slate-800">
							<tr>
								<th className="px-3 py-2.5 font-semibold">Rank</th>
								<th className="px-3 py-2.5 font-semibold">Book Title</th>
								<th className="px-3 py-2.5 font-semibold">Category</th>
								<th className="px-3 py-2.5 font-semibold">Units Sold</th>
								<th className="px-3 py-2.5 font-semibold">
									Total Revenue (AED)
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-slate-100 dark:divide-slate-800">
							{topBooks.map((book) => (
								<tr
									className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
									key={book.rank}
								>
									<td className="px-3 py-3 font-bold text-primary">
										#{book.rank}
									</td>
									<td className="px-3 py-3 font-semibold text-slate-900 dark:text-white">
										{book.title}
									</td>
									<td className="px-3 py-3">
										<Badge className="text-[10px]" variant="outline">
											{book.category}
										</Badge>
									</td>
									<td className="px-3 py-3 font-medium">{book.units} copies</td>
									<td className="px-3 py-3 font-extrabold text-slate-900 dark:text-white">
										{book.revenue}
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
