import { SettingsView } from "@/features/admin/settings/settings-view";
import { auth } from "@/auth-admin";
import { redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Account Settings | Rewaya Admin",
};

export default async function SettingsPage() {
	const session = await auth();

	if (!session) {
		redirect("/admin/login");
	}

	return <SettingsView />;
}
