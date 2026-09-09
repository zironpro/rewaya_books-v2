import { MongoDBAdapter } from "@auth/mongodb-adapter";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import clientPromise from "./lib/db/mongodb-client";

export const { handlers, auth, signIn, signOut } = NextAuth({
	basePath: "/api/auth-admin",
	adapter: MongoDBAdapter(clientPromise),
	providers: [
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
					// Enforce role boundaries - only ADMIN allowed
					if (user.role !== "ADMIN") {
						throw new Error("Access denied. Admin privileges required.");
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
		maxAge: 4 * 60 * 60, // 4 hours
	},
	cookies: {
		sessionToken: {
			name: `admin-rewaya-session`,
			options: {
				httpOnly: true,
				sameSite: "lax",
				path: "/",
				secure: process.env.NODE_ENV === "production",
			},
		},
	},
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.role = (user as any).role || "USER";
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
