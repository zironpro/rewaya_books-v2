import { SettingsPage } from "@/features/profile/pages/settings-page";

import { auth } from "@/auth";
import connectToDatabase from "@/lib/db/mongodb";
import { User } from "@/lib/db/models/User";
import { redirect } from "next/navigation";

export const metadata = {
	title: "Account Settings | Rewaya",
	description: "Update your profile and security settings.",
};

export default async function ProfileSettingsPage() {
	const session = await auth();
	
	if (!session?.user?.email) {
		redirect("/login");
	}

	await connectToDatabase();
	const userDoc = await User.findOne({ email: session.user.email }).lean();

	if (!userDoc) {
		redirect("/login");
	}

	const serializedUser = {
		name: userDoc.name || "",
		nickname: userDoc.nickname || "",
		phone: userDoc.phone || "",
		email: userDoc.email || "",
	};

	return <SettingsPage initialUser={serializedUser} />;
}
