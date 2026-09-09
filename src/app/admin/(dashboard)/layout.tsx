import { redirect } from "next/navigation";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { auth } from "@/auth-admin";
import { DashboardHeader } from "@/features/admin/dashboard/components/dashboard-header";
import { AppSidebar } from "@/features/admin/layout/app-sidebar";

export default async function DashboardLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const session = await auth();

	if (!session || (session.user as any)?.role !== "ADMIN") {
		redirect("/admin/login");
	}

	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset className="bg-white dark:bg-slate-950">
				<DashboardHeader />
				<div className="flex-1 space-y-6 p-4 md:p-6 lg:p-8">{children}</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
