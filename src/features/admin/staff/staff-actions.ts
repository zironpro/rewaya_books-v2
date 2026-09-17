"use server";

import { auth } from "@/auth-admin";
import connectToDatabase from "@/lib/db/mongodb";
import { User } from "@/lib/db/models/User";
import { revalidatePath } from "next/cache";

// Verify that the current user is authorized to manage staff
async function verifyMasterAdmin() {
	const session = await auth();
	const userPermissions = (session?.user as any)?.adminPermissions || [];
	if (!userPermissions.includes("MASTER") && !userPermissions.includes("STAFF_MANAGEMENT")) {
		throw new Error("Unauthorized: Only admins with Staff Management permission can perform this action.");
	}
	return session;
}

export async function getAdmins() {
	await verifyMasterAdmin();
	await connectToDatabase();
	
	const admins = await User.find({ role: "ADMIN" }).select("-password").lean();
	return JSON.parse(JSON.stringify(admins));
}

export async function createAdminAccount(name: string, email: string, passwordRaw: string, permissions: string[]) {
	await verifyMasterAdmin();
	await connectToDatabase();
	
	const bcrypt = await import("bcryptjs");

	const existingUser = await User.findOne({ email });
	if (existingUser) {
		return { success: false, message: "A user with this email already exists. Please use a different email." };
	}

	const hashedPassword = await bcrypt.hash(passwordRaw, 10);

	const adminUser = new User({
		name,
		email,
		password: hashedPassword,
		role: "ADMIN",
		adminPermissions: permissions,
		emailVerified: new Date(),
	});

	await adminUser.save();

	revalidatePath("/admin/staff");
	return { success: true, message: "Admin account created successfully." };
}

export async function updateAdminPermissions(userId: string, permissions: string[]) {
	await verifyMasterAdmin();
	await connectToDatabase();

	const user = await User.findById(userId);
	if (!user) {
		return { success: false, message: "Admin not found." };
	}

	user.adminPermissions = permissions;
	await user.save();

	revalidatePath("/admin/staff");
	return { success: true, message: "Permissions updated successfully." };
}

export async function updateAdminPassword(userId: string, newPasswordRaw: string) {
	await verifyMasterAdmin();
	await connectToDatabase();

	const user = await User.findById(userId);
	if (!user) {
		return { success: false, message: "Admin not found." };
	}

	const bcrypt = await import("bcryptjs");
	const hashedPassword = await bcrypt.hash(newPasswordRaw, 10);
	
	user.password = hashedPassword;
	user.passwordChangedAt = new Date(); // Invalidate their session immediately!
	await user.save();

	return { success: true, message: "Password updated successfully." };
}

export async function revokeAdminRole(userId: string) {
	const session = await verifyMasterAdmin();
	await connectToDatabase();

	if ((session?.user as any)?.id === userId) {
		return { success: false, message: "You cannot revoke your own admin access." };
	}

	const user = await User.findById(userId);
	if (!user) {
		return { success: false, message: "Admin not found." };
	}

	user.role = "USER";
	user.adminPermissions = [];
	await user.save();

	revalidatePath("/admin/staff");
	return { success: true, message: "Admin access revoked." };
}
