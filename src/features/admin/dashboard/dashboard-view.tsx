"use client";

import { DashboardChart } from "./components/dashboard-chart";
import { DashboardHero } from "./components/dashboard-hero";
import { DashboardStats } from "./components/dashboard-stats";
import { QuickActionsCard } from "./components/quick-actions-card";
import { RecentOrdersTable } from "./components/recent-orders-table";

export function DashboardView() {
	return (
		<div className="space-y-6">
			{/* Welcome Hero Banner */}
			<DashboardHero />

			{/* Key Metrics Stats Grid */}
			<DashboardStats />

			{/* Interactive Sales & Revenue Graph */}
			<DashboardChart />

			{/* Recent Orders Table & Quick Action Modules */}
			<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
				<RecentOrdersTable />
				<QuickActionsCard />
			</div>
		</div>
	);
}
