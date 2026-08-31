"use server";

import { auth } from "@/auth";
import connectToDatabase from "@/lib/db/mongodb";
import { User } from "@/lib/db/models/User";

export async function updateUserProfile(data: {
	firstName: string;
	lastName: string;
	nickname: string;
	phone: string;
}) {
	try {
		const session = await auth();
		if (!session?.user?.email) {
			return { status: "error", message: "Unauthorized" };
		}

		await connectToDatabase();

		const name = `${data.firstName.trim()} ${data.lastName.trim()}`.trim();

		await User.updateOne(
			{ email: session.user.email },
			{
				$set: {
					name,
					nickname: data.nickname.trim(),
					phone: data.phone.trim(),
				},
			}
		);

		return { status: "success", message: "Profile updated successfully." };
	} catch (error) {
		console.error("Failed to update profile", error);
		return { status: "error", message: "Failed to update profile. Please try again." };
	}
}
