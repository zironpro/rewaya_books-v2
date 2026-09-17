"use client";

import * as React from "react";
import { useState, useTransition } from "react";
import { KeyRound, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { changeOwnPassword } from "./settings-actions";

export function SettingsView() {
	const [isPending, startTransition] = useTransition();
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	const handleChangePassword = async (e: React.FormEvent) => {
		e.preventDefault();

		if (newPassword !== confirmPassword) {
			toast.error("New password and confirm password do not match.");
			return;
		}

		startTransition(async () => {
			const res = await changeOwnPassword(currentPassword, newPassword);
			if (res.success) {
				toast.success(res.message);
				setCurrentPassword("");
				setNewPassword("");
				setConfirmPassword("");
				// The session will automatically become invalid and redirect the user on the next navigation or refresh.
				// We can force a reload to log them out immediately:
				setTimeout(() => {
					window.location.href = "/admin/login";
				}, 1000);
			} else {
				toast.error(res.message);
			}
		});
	};

	return (
		<div className="space-y-6 max-w-2xl">
			{/* Header */}
			<div className="rounded-lg border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
				<div className="flex items-center gap-2">
					<KeyRound className="h-5 w-5 text-primary" />
					<h1 className="font-extrabold text-slate-900 text-xl dark:text-white">
						Account Settings
					</h1>
				</div>
				<p className="mt-1 text-slate-500 text-sm">
					Manage your personal admin account settings and security.
				</p>
			</div>

			{/* Change Password Form */}
			<div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
				<h3 className="font-bold text-lg mb-4 border-b border-slate-100 pb-3 dark:border-slate-800">Change Password</h3>
				<form onSubmit={handleChangePassword} className="space-y-4">
					<div>
						<label className="text-sm font-medium mb-1 block">Current Password</label>
						<Input
							type="password"
							required
							placeholder="Enter your current password..."
							value={currentPassword}
							onChange={(e) => setCurrentPassword(e.target.value)}
						/>
					</div>
					
					<div>
						<label className="text-sm font-medium mb-1 block">New Password</label>
						<Input
							type="password"
							required
							placeholder="Enter a secure new password..."
							value={newPassword}
							onChange={(e) => setNewPassword(e.target.value)}
						/>
					</div>

					<div>
						<label className="text-sm font-medium mb-1 block">Confirm New Password</label>
						<Input
							type="password"
							required
							placeholder="Re-type your new password..."
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
						/>
					</div>
					
					<div className="flex justify-end pt-2">
						<Button type="submit" disabled={isPending}>
							{isPending ? "Updating..." : (
								<>
									<Save className="h-4 w-4 mr-2" /> Update Password
								</>
							)}
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
}
