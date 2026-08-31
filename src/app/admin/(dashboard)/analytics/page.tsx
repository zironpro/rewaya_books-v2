import { Metadata } from "next";
import { AnalyticsView } from "@/features/admin/analytics/analytics-view";

export const metadata: Metadata = {
	title: "Sales & Revenue Analytics | Rewaya Admin",
	description:
		"Detailed breakdown of total sales AED, category revenues, and regional performance.",
};

export default function AnalyticsPage() {
	return <AnalyticsView />;
}
