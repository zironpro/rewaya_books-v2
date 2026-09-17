"use server";

import { auth } from "@/auth-admin";
import connectToDatabase from "@/lib/db/mongodb";
import { User } from "@/lib/db/models/User";
import { revalidatePath } from "next/cache";

export async function changeOwnPassword(currentPasswordRaw: string, newPasswordRaw: string) {
	const session = await auth();
	const userId = (session?.user as any)?.id;

	if (!userId) {
		return { success: false, message: "Unauthorized. Please log in again." };
	}

	await connectToDatabase();
	const user = await User.findById(userId);

	if (!user) {
		return { success: false, message: "User not found." };
	}

	const bcrypt = await import("bcryptjs");
	
	const isValid = await bcrypt.compare(currentPasswordRaw, user.password);
	if (!isValid) {
		return { success: false, message: "Current password is incorrect." };
	}

	const hashedPassword = await bcrypt.hash(newPasswordRaw, 10);
	
	user.password = hashedPassword;
	user.passwordChangedAt = new Date(); // This will trigger the JWT callback to invalidate the session!
	
	await user.save();

	return { success: true, message: "Password updated successfully." };
}
