"use server";

import bcrypt from "bcryptjs";

import { User } from "@/lib/db/models/User";
import connectToDatabase from "@/lib/db/mongodb";

export async function registerUser(
	name: string,
	email: string,
	passwordRaw: string
) {
	try {
		await connectToDatabase();

		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return { status: "error", message: "Email is already registered." };
		}

		const hashedPassword = await bcrypt.hash(passwordRaw, 10);

		const newUser = new User({
			name,
			email,
			password: hashedPassword,
			role: "USER",
		});

		await newUser.save();

		return { status: "success" };
	} catch (error) {
		console.error("Failed to register user", error);
		return {
			status: "error",
			message: "Failed to create account. Please try again.",
		};
	}
}
