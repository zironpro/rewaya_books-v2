"use server";

import { signIn } from "@/auth-admin";
import { AuthError } from "next-auth";

import { isRedirectError } from "next/dist/client/components/redirect";

export async function adminSignIn(formData: FormData) {
	try {
		const credentials = Object.fromEntries(formData.entries());
		await signIn("credentials", { ...credentials, redirect: false });
		return { success: true };
	} catch (error) {
		if (isRedirectError(error)) {
			return { success: true };
		}
		if (error instanceof AuthError) {
			switch (error.type) {
				case "CredentialsSignin":
					return { error: "Invalid email or password. Please try again." };
				default:
					return { error: "An unexpected error occurred. Please try again later." };
			}
		}
		return { error: "An unexpected error occurred. Please try again later." };
	}
}

export async function adminSignOut() {
	const { signOut } = await import("@/auth-admin");
	await signOut({ redirectTo: "/admin/login" });
}
