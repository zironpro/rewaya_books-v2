"use client";

import * as React from "react";
import { ArrowUpRight, Calendar, DollarSign, TrendingUp } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { useGetOrdersQuery } from "@/types/graphql";

export function DashboardChart() {
	const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);
	
	const { data } = useGetOrdersQuery();
	const orders = data?.orders || [];

	const monthlyData = React.useMemo(() => {
		const data = [
			{ month: "Jan", revenue: 0, orders: 0 },
			{ month: "Feb", revenue: 0, orders: 0 },
			{ month: "Mar", revenue: 0, orders: 0 },
			{ month: "Apr", revenue: 0, orders: 0 },
			{ month: "May", revenue: 0, orders: 0 },
			{ month: "Jun", revenue: 0, orders: 0 },
			{ month: "Jul", revenue: 0, orders: 0 },
			{ month: "Aug", revenue: 0, orders: 0 },
			{ month: "Sep", revenue: 0, orders: 0 },
			{ month: "Oct", revenue: 0, orders: 0 },
			{ month: "Nov", revenue: 0, orders: 0 },
			{ month: "Dec", revenue: 0, orders: 0 },
		];

		const currentYear = new Date().getFullYear();

		orders.forEach((o: any) => {
			if (o.createdAt) {
				const date = new Date(Number(o.createdAt));
				if (date.getFullYear() === currentYear) {
					const month = date.getMonth();
					if (o.isPaid) {
						data[month].revenue += o.total;
					}
					data[month].orders += 1;
				}
			}
		});
		return data;
	}, [orders]);

	const currentMonthIndex = new Date().getMonth();
	const maxRevenue = Math.max(...monthlyData.map(d => d.revenue), 10000); // minimum scale 10k
	
	const activeIndex = hoveredIndex !== null ? hoveredIndex : currentMonthIndex;
	const currentMonthData = monthlyData[activeIndex] || monthlyData[0];
	
	const ytdRevenue = monthlyData.reduce((sum, item) => sum + item.revenue, 0);
	const avgMonthly = ytdRevenue / (currentMonthIndex + 1);
	
	let peakMonth = monthlyData[0];
	monthlyData.forEach(m => {
		if (m.revenue > peakMonth.revenue) peakMonth = m;
	});

	return (
		<div className="space-y-4 rounded-lg border border-slate-200/80 bg-white p-4 sm:p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
			{/* Chart Header */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 dark:border-slate-800">
				<div>
					<div className="flex items-center gap-2">
						<h2 className="font-extrabold text-lg sm:text-xl text-slate-900 dark:text-white">
							Revenue & Sales Performance Graph
						</h2>
						<Badge variant="success" className="text-[10px] gap-1">
							<span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
							Live AED Data
						</Badge>
					</div>
					<p className="text-sm text-slate-500 mt-0.5">
						Monthly gross sales revenue trends and volume growth across UAE &
						GCC hubs
					</p>
				</div>

				<div className="flex items-center gap-3">
					<div className="text-right hidden xs:block">
						<div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
							{currentMonthData.month} 2026 Revenue
						</div>
						<div className="font-extrabold text-xl text-primary">
							AED {currentMonthData.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
						</div>
					</div>
				</div>
			</div>

			{/* Interactive Bar/Area Visualizer */}
			<div className="pt-2">
				<div className="relative h-56 sm:h-64 w-full flex items-end justify-between gap-2 pt-6">
					{/* Horizontal Grid lines */}
					<div className="absolute inset-0 flex flex-col justify-between pointer-events-none text-[10px] text-slate-400 dark:text-slate-600">
						<div className="border-b border-dashed border-slate-200 dark:border-slate-800 flex justify-between">
							<span>AED {maxRevenue.toLocaleString()}</span>
						</div>
						<div className="border-b border-dashed border-slate-200 dark:border-slate-800 flex justify-between">
							<span>AED {(maxRevenue * 0.66).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
						</div>
						<div className="border-b border-dashed border-slate-200 dark:border-slate-800 flex justify-between">
							<span>AED {(maxRevenue * 0.33).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
						</div>
						<div className="border-b border-slate-200 dark:border-slate-800" />
					</div>

					{/* Monthly Bars */}
					{monthlyData.map((item, idx) => {
						const heightPercent = (item.revenue / maxRevenue) * 100;
						const isSelected = hoveredIndex === idx;

						return (
							<div
								key={item.month}
								onMouseEnter={() => setHoveredIndex(idx)}
								className="group relative flex-1 flex flex-col items-center justify-end h-full z-10 cursor-pointer"
							>
								{/* Tooltip Hover Overlay */}
								{isSelected && (
									<div className="absolute -top-10 z-20 px-2.5 py-1 rounded-md bg-slate-900 text-white text-[11px] font-bold shadow-md whitespace-nowrap dark:bg-slate-100 dark:text-slate-900 animate-in fade-in zoom-in-95">
										AED {item.revenue.toLocaleString()} ({item.orders} orders)
									</div>
								)}

								{/* Animated Bar Column */}
								<div
									className={`w-full max-w-[36px] sm:max-w-[48px] rounded-t-md transition-all duration-300 ${
										isSelected
											? "bg-gradient-to-t from-primary-dark via-primary to-primary shadow-lg shadow-primary/30"
											: "bg-primary/20 dark:bg-primary/30 hover:bg-primary/50"
									}`}
									style={{ height: `${heightPercent}%` }}
								/>

								{/* Month Label */}
								<span
									className={`mt-2 text-sm font-semibold transition-colors ${
										isSelected
											? "text-primary font-bold"
											: "text-slate-500 dark:text-slate-400"
									}`}
								>
									{item.month}
								</span>
							</div>
						);
					})}
				</div>
			</div>

			<div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-sm">
				<div className="space-y-0.5">
					<div className="text-[10px] text-slate-400">Peak Sales Month</div>
					<div className="font-bold text-slate-900 dark:text-white">
						{peakMonth.month} (AED {peakMonth.revenue >= 1000 ? (peakMonth.revenue/1000).toFixed(1) + 'k' : peakMonth.revenue.toFixed(0)})
					</div>
				</div>
				<div className="space-y-0.5">
					<div className="text-[10px] text-slate-400">
						Average Monthly Sales
					</div>
					<div className="font-bold text-slate-900 dark:text-white">
						AED {avgMonthly.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
					</div>
				</div>
				<div className="space-y-0.5">
					<div className="text-[10px] text-slate-400">Total YTD Revenue</div>
					<div className="font-bold text-slate-900 dark:text-white">
						AED {ytdRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
					</div>
				</div>
				<div className="space-y-0.5">
					<div className="text-[10px] text-slate-400">Revenue Trajectory</div>
					<div className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
						Upward Trend <ArrowUpRight className="h-3.5 w-3.5" />
					</div>
				</div>
			</div>
		</div>
	);
}
