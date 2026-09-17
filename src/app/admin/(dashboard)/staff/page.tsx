import { getAdmins } from "@/features/admin/staff/staff-actions";
import { StaffView } from "@/features/admin/staff/staff-view";
import { auth } from "@/auth-admin";
import { redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Staff Management | Rewaya Admin",
};

export default async function StaffManagementPage() {
	const session = await auth();
	const userPermissions = (session?.user as any)?.adminPermissions || [];
	const userId = (session?.user as any)?.id || "";

	// Master permission or specific STAFF_MANAGEMENT permission is required
	if (!userPermissions.includes("MASTER") && !userPermissions.includes("STAFF_MANAGEMENT")) {
		redirect("/admin"); // Redirect if unauthorized
	}

	const admins = await getAdmins();

	return <StaffView initialAdmins={admins} currentUserId={userId} />;
}
