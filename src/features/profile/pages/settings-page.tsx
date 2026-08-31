"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

import { ProfilePageHeader } from "@/features/profile/components/profile-page-header";
import { SettingsTab } from "@/features/profile/components/settings-tab";
import { updateUserProfile } from "@/features/profile/profile-actions";

interface SettingsPageProps {
	initialUser: {
		name: string;
		nickname: string;
		phone: string;
		email: string;
	};
}

export const SettingsPage = ({ initialUser }: SettingsPageProps) => {
	const [saving, setSaving] = useState(false);
	const router = useRouter();

	const handleSave = async (data: {
		firstName: string;
		lastName: string;
		nickname: string;
		phone: string;
	}) => {
		setSaving(true);
		
		const result = await updateUserProfile(data);
		
		setSaving(false);
		if (result.status === "success") {
			router.refresh();
			return true;
		}
		return false;
	};

	const firstName = initialUser.name.split(" ")[0] || "";
	const lastName = initialUser.name.split(" ").slice(1).join(" ") || "";

	return (
		<>
			<ProfilePageHeader
				description="Manage your account preferences"
				title="Settings"
			/>
			<SettingsTab
				email={initialUser.email}
				firstName={firstName}
				isLoggingOut={false}
				isSaving={saving}
				lastName={lastName}
				nickname={initialUser.nickname || firstName}
				onLogout={async () => {
					await signOut({ callbackUrl: "/" });
				}}
				onResetPassword={async () => {}}
				onSave={handleSave}
				phone={initialUser.phone}
			/>
		</>
	);
};
