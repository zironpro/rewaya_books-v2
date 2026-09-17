"use client";

import * as React from "react";
import { useState, useTransition } from "react";
import { Users, Shield, Plus, X, Save, Trash2, Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	createAdminAccount,
	updateAdminPermissions,
	updateAdminPassword,
	revokeAdminRole,
} from "./staff-actions";
import { toast } from "sonner";

// Define all available permissions
const PERMISSIONS_LIST = [
	{ id: "MASTER", label: "Master Admin (Full Access)" },
	{ id: "DASHBOARD", label: "Dashboard" },
	{ id: "SALES_ANALYTICS", label: "Sales Analytics" },
	{ id: "BOOKS_CATALOG", label: "Books Catalog" },
	{ id: "CATEGORIES", label: "Categories & Genres" },
	{ id: "BOOK_BUNDLES", label: "Book Bundles" },
	{ id: "COUPONS", label: "Coupons" },
	{ id: "HERO_BANNERS", label: "Hero Banners" },
	{ id: "POPUP_MESSAGES", label: "Popup Messages" },
	{ id: "CUSTOMER_ORDERS", label: "Customer Orders" },
	{ id: "REFUND_REQUESTS", label: "Refund Requests" },
	{ id: "CUSTOMERS_DIRECTORY", label: "Customers Directory" },
	{ id: "SUBSCRIBERS", label: "Subscribers" },
	{ id: "SHIPPING", label: "Shipping & Delivery" },
	{ id: "TAXES", label: "Taxes & VAT" },
	{ id: "STAFF_MANAGEMENT", label: "Staff Management" },
];

export function StaffView({ initialAdmins, currentUserId }: { initialAdmins: any[], currentUserId: string }) {
	const [isPending, startTransition] = useTransition();
	
	const [showAddForm, setShowAddForm] = useState(false);
	const [newName, setNewName] = useState("");
	const [newEmail, setNewEmail] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [newPermissions, setNewPermissions] = useState<string[]>([]);
	
	const [editingAdminId, setEditingAdminId] = useState<string | null>(null);
	const [editPermissions, setEditPermissions] = useState<string[]>([]);
	const [editPassword, setEditPassword] = useState("");

	const handleAddAdmin = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!newEmail.trim() || !newPassword.trim() || !newName.trim()) return;

		startTransition(async () => {
			const res = await createAdminAccount(newName, newEmail, newPassword, newPermissions);
			if (res.success) {
				toast.success(res.message);
				setShowAddForm(false);
				setNewName("");
				setNewEmail("");
				setNewPassword("");
				setNewPermissions([]);
				// Note: In a real app we'd refresh the server data, but here we'll just wait for the router refresh
			} else {
				toast.error(res.message);
			}
		});
	};

	const handleUpdatePermissions = async (adminId: string) => {
		startTransition(async () => {
			const res = await updateAdminPermissions(adminId, editPermissions);
			if (res.success) {
				if (editPassword.trim()) {
					const pwdRes = await updateAdminPassword(adminId, editPassword);
					if (pwdRes.success) {
						toast.success("Permissions and password updated.");
					} else {
						toast.error("Permissions updated, but password change failed: " + pwdRes.message);
					}
				} else {
					toast.success(res.message);
				}
				setEditingAdminId(null);
				setEditPassword("");
			} else {
				toast.error(res.message);
			}
		});
	};

	const handleRevoke = async (adminId: string) => {
		if (!confirm("Are you sure you want to revoke admin access for this user?")) return;
		
		startTransition(async () => {
			const res = await revokeAdminRole(adminId);
			if (res.success) {
				toast.success(res.message);
			} else {
				toast.error(res.message);
			}
		});
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-col justify-between gap-4 rounded-lg border border-slate-200/80 bg-white p-5 shadow-xs sm:flex-row sm:items-center dark:border-slate-800 dark:bg-slate-900">
				<div>
					<div className="flex items-center gap-2">
						<Shield className="h-5 w-5 text-primary" />
						<h1 className="font-extrabold text-slate-900 text-xl dark:text-white">
							Staff Management
						</h1>
					</div>
					<p className="mt-1 text-slate-500 text-sm">
						Manage admin accounts and their access permissions.
					</p>
				</div>
				
				<Button onClick={() => setShowAddForm(true)} disabled={isPending || showAddForm}>
					<Plus className="h-4 w-4 mr-2" /> Add Sub-Admin
				</Button>
			</div>

			{/* Add Admin Form */}
			{showAddForm && (
				<div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
					<div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4 dark:border-slate-800">
						<h3 className="font-bold">Create Sub-Admin Account</h3>
						<Button variant="ghost" size="icon" onClick={() => setShowAddForm(false)}>
							<X className="h-4 w-4" />
						</Button>
					</div>
					<form onSubmit={handleAddAdmin} className="space-y-4">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label className="text-sm font-medium mb-1 block">Full Name</label>
								<Input
									type="text"
									required
									placeholder="Admin's full name..."
									value={newName}
									onChange={(e) => setNewName(e.target.value)}
								/>
							</div>
							<div>
								<label className="text-sm font-medium mb-1 block">Email Address</label>
								<Input
									type="email"
									required
									placeholder="admin@example.com"
									value={newEmail}
									onChange={(e) => setNewEmail(e.target.value)}
								/>
							</div>
						</div>
						
						<div>
							<label className="text-sm font-medium mb-1 block">Password</label>
							<Input
								type="password"
								required
								placeholder="Enter a secure password..."
								value={newPassword}
								onChange={(e) => setNewPassword(e.target.value)}
							/>
						</div>
						
						<div>
							<label className="text-sm font-medium mb-2 block">Permissions</label>
							<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
								{PERMISSIONS_LIST.map((perm) => (
									<label key={perm.id} className="flex items-center gap-2 text-sm p-2 rounded-md border border-slate-100 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50 cursor-pointer">
										<input
											type="checkbox"
											checked={newPermissions.includes(perm.id)}
											onChange={(e) => {
												if (e.target.checked) {
													setNewPermissions([...newPermissions, perm.id]);
												} else {
													setNewPermissions(newPermissions.filter((p) => p !== perm.id));
												}
											}}
											className="rounded border-slate-300 text-primary focus:ring-primary"
										/>
										{perm.label}
									</label>
								))}
							</div>
						</div>
						<div className="flex justify-end">
							<Button type="submit" disabled={isPending}>
								{isPending ? "Creating Account..." : "Create Admin Account"}
							</Button>
						</div>
					</form>
				</div>
			)}

			{/* Admins List */}
			<div className="grid grid-cols-1 gap-4">
				{initialAdmins
					.filter((admin) => !(admin.adminPermissions || []).includes("MASTER"))
					.map((admin) => {
					const isEditing = editingAdminId === admin._id;
					const perms = admin.adminPermissions || [];
					const isCurrentUser = currentUserId === admin._id;

					return (
						<div
							key={admin._id}
							className="rounded-lg border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900"
						>
							<div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
								<div>
									<div className="flex items-center gap-2 mb-1">
										<h3 className="font-bold text-lg text-slate-900 dark:text-white">
											{admin.name || "Unknown"}
										</h3>
										{perms.includes("MASTER") ? (
											<Badge className="bg-purple-500 hover:bg-purple-600">Master</Badge>
										) : (
											<Badge variant="secondary">Sub Admin</Badge>
										)}
										{isCurrentUser && <Badge variant="outline">You</Badge>}
									</div>
									<div className="text-slate-500 text-sm flex items-center gap-1.5">
										<Mail className="h-3.5 w-3.5" /> {admin.email}
									</div>
								</div>
								
								{!isEditing && (
									<div className="flex gap-2">
										<Button
											variant="outline"
											size="sm"
											onClick={() => {
												setEditingAdminId(admin._id);
												setEditPermissions(perms);
												setEditPassword("");
											}}
										>
											Edit Permissions
										</Button>
										{!isCurrentUser && (
											<Button
												variant="destructive"
												size="sm"
												onClick={() => handleRevoke(admin._id)}
												disabled={isPending}
											>
												<Trash2 className="h-4 w-4" />
											</Button>
										)}
									</div>
								)}
							</div>

							{isEditing ? (
								<div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
									<h4 className="text-sm font-medium mb-3">Edit Access</h4>
									<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-4">
										{PERMISSIONS_LIST.map((perm) => (
											<label key={perm.id} className="flex items-center gap-2 text-sm p-2 rounded-md border border-slate-100 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50 cursor-pointer">
												<input
													type="checkbox"
													checked={editPermissions.includes(perm.id)}
													onChange={(e) => {
														if (e.target.checked) {
															setEditPermissions([...editPermissions, perm.id]);
														} else {
															setEditPermissions(editPermissions.filter((p) => p !== perm.id));
														}
													}}
													className="rounded border-slate-300 text-primary focus:ring-primary"
												/>
												{perm.label}
											</label>
										))}
									</div>
									
									<div className="mb-4">
										<label className="text-sm font-medium mb-1 block">Change Password (Optional)</label>
										<Input
											type="password"
											placeholder="Enter new password..."
											value={editPassword}
											onChange={(e) => setEditPassword(e.target.value)}
										/>
										<p className="text-xs text-slate-500 mt-1">Leave blank to keep the current password.</p>
									</div>

									<div className="flex justify-end gap-2">
										<Button variant="ghost" onClick={() => setEditingAdminId(null)}>Cancel</Button>
										<Button onClick={() => handleUpdatePermissions(admin._id)} disabled={isPending}>
											<Save className="h-4 w-4 mr-2" /> Save Changes
										</Button>
									</div>
								</div>
							) : (
								<div className="mt-4 flex flex-wrap gap-1.5">
									{perms.length > 0 ? (
										perms.map((p: string) => (
											<Badge key={p} variant="outline" className="text-xs bg-slate-50 dark:bg-slate-800/50">
												{PERMISSIONS_LIST.find(pl => pl.id === p)?.label || p}
											</Badge>
										))
									) : (
										<span className="text-sm text-slate-400 italic">No specific permissions assigned.</span>
									)}
								</div>
							)}
						</div>
					);
				})}
			</div>
		</div>
	);
}
