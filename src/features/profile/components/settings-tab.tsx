"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { ProfileStatusBanner } from "@/features/profile/components/profile-status-banner";

interface SettingsTabProps {
	firstName: string;
	lastName: string;
	nickname: string;
	phone: string;
	email: string;
	onSave: (data: {
		firstName: string;
		lastName: string;
		nickname: string;
		phone: string;
	}) => Promise<boolean>;
	onResetPassword: () => Promise<void>;
	onLogout: () => void;
	isSaving?: boolean;
	isLoggingOut?: boolean;
}

export const SettingsTab = ({
	firstName: initialFirst,
	lastName: initialLast,
	nickname: initialNickname,
	phone: initialPhone,
	email,
	onSave,
	onResetPassword,
	onLogout,
	isSaving = false,
	isLoggingOut = false,
}: SettingsTabProps) => {
	const [firstName, setFirstName] = useState(initialFirst);
	const [lastName, setLastName] = useState(initialLast);
	const [nickname, setNickname] = useState(initialNickname);
	const [phone, setPhone] = useState(initialPhone);
	const [message, setMessage] = useState<{
		text: string;
		variant: "error" | "success";
	} | null>(null);
	const [resetPending, setResetPending] = useState(false);

	const handleSave = async () => {
		setMessage(null);
		const ok = await onSave({ firstName, lastName, nickname, phone });
		setMessage(
			ok
				? { text: "Profile updated successfully.", variant: "success" }
				: {
						text: "Could not update profile. Please try again.",
						variant: "error",
					}
		);
	};

	const handleReset = async () => {
		setMessage(null);
		setResetPending(true);
		try {
			await onResetPassword();
			setMessage({
				text: "Password reset email sent. Check your inbox.",
				variant: "success",
			});
		} catch {
			setMessage({
				text: "Could not send reset email. Please try again.",
				variant: "error",
			});
		} finally {
			setResetPending(false);
		}
	};

	return (
		<div className="space-y-8">
			{message ? (
				<ProfileStatusBanner message={message.text} variant={message.variant} />
			) : null}

			<Card>
				<CardHeader>
					<CardTitle className="font-serif text-2xl">Profile</CardTitle>
					<CardDescription>Update your personal information</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<div className="space-y-2">
							<label className="font-bold text-stone-400 text-xs uppercase">
								First name
							</label>
							<Input
								onChange={(e) => setFirstName(e.target.value)}
								value={firstName}
							/>
						</div>
						<div className="space-y-2">
							<label className="font-bold text-stone-400 text-xs uppercase">
								Last name
							</label>
							<Input
								onChange={(e) => setLastName(e.target.value)}
								value={lastName}
							/>
						</div>
					</div>
					<div className="space-y-2">
						<label className="font-bold text-stone-400 text-xs uppercase">
							Display name
						</label>
						<Input
							onChange={(e) => setNickname(e.target.value)}
							value={nickname}
						/>
					</div>
					<div className="space-y-2">
						<label className="font-bold text-stone-400 text-xs uppercase">
							Phone
						</label>
						<Input onChange={(e) => setPhone(e.target.value)} value={phone} />
					</div>
					<div className="space-y-2">
						<label className="font-bold text-stone-400 text-xs uppercase">
							Email
						</label>
						<Input disabled value={email} />
						<p className="text-stone-400 text-xs">
							Email cannot be changed here. Contact support if needed.
						</p>
					</div>
					<div className="flex flex-wrap gap-3 border-stone-100 border-t pt-6">
						<Button disabled={isSaving} onClick={handleSave} className="bg-primary hover:bg-primary/90 text-white">
							{isSaving ? "Saving…" : "Save changes"}
						</Button>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle className="font-serif text-2xl">Security</CardTitle>
					<CardDescription>Password and account access</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<Button
						disabled={resetPending}
						onClick={handleReset}
						variant="outline"
					>
						{resetPending ? "Sending…" : "Send password reset email"}
					</Button>
					<div className="border-stone-100 border-t pt-6">
						<Button
							className="text-red-600 hover:bg-red-50"
							disabled={isLoggingOut}
							onClick={onLogout}
							variant="outline"
						>
							{isLoggingOut ? "Signing out…" : "Sign out"}
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};
