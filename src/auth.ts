import NextAuth from "next-auth";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import clientPromise from "./lib/db/mongodb-client";

export const { handlers, auth, signIn, signOut } = NextAuth({
	adapter: MongoDBAdapter(clientPromise),
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		}),
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" },
				isAdminAttempt: { type: "hidden" },
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password) return null;

				const { User } = await import("./lib/db/models/User");
				const connectToDatabase = (await import("./lib/db/mongodb")).default;
				const bcrypt = await import("bcryptjs");

				await connectToDatabase();
				const user = await User.findOne({ email: credentials.email });

				if (user && user.password) {
					// Enforce role boundaries
					if (credentials.isAdminAttempt === "true" && user.role !== "ADMIN") {
						throw new Error("Access denied. Admin privileges required.");
					}
					if (credentials.isAdminAttempt === "false" && user.role === "ADMIN") {
						throw new Error("Admin accounts must use the admin portal.");
					}
					const isValid = await bcrypt.compare(
						credentials.password as string,
						user.password
					);
					if (isValid) {
						return {
							id: user._id.toString(),
							name: user.name,
							email: user.email,
							role: user.role,
						} as any;
					}
				}

				return null;
			},
		}),
	],
	session: {
		strategy: "jwt",
	},
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.role = (user as any).role || "USER"; // Default to USER for OAuth signups
			}
			return token;
		},
		async session({ session, token }) {
			if (session.user) {
				(session.user as any).role = token.role;
				(session.user as any).id = token.sub;
			}
			return session;
		},
	},
});
