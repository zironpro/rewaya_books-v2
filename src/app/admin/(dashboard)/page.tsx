import { Metadata } from "next";
import { DashboardView } from "@/features/admin/dashboard/dashboard-view";

export const metadata: Metadata = {
	title: "Rewaya Admin Console | Enterprise Operations",
	description:
		"Administrative console and store operations manager for Rewaya Book World.",
};

export default function DashboardPage() {
	return <DashboardView />;
}
