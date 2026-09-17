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
							adminPermissions: Array.from(user.adminPermissions || []),
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
				token.adminPermissions = (user as any).adminPermissions || [];
			}

			if (token.sub) {
				try {
					const { User } = await import("./lib/db/models/User");
					const connectToDatabase = (await import("./lib/db/mongodb")).default;
					await connectToDatabase();
					
					const dbUser = await User.findById(token.sub).select("passwordChangedAt role adminPermissions");
					
					if (!dbUser) {
						return {} as any; // User deleted
					}

					// Invalidate session if password was changed after token issuance
					if (dbUser.passwordChangedAt && token.iat) {
						const passwordChangedTime = Math.floor(dbUser.passwordChangedAt.getTime() / 1000);
						if (token.iat < passwordChangedTime) {
							return {} as any; // Invalid token
						}
					}

					// Auto-refresh permissions
					token.role = dbUser.role;
					token.adminPermissions = Array.from(dbUser.adminPermissions || []);
				} catch (err) {
					console.error("Error validating admin JWT:", err);
				}
			}

			return token;
		},
		async session({ session, token }) {
			if (session.user) {
				(session.user as any).role = token.role;
				(session.user as any).adminPermissions = token.adminPermissions || [];
				(session.user as any).id = token.sub;
			}
			return session;
		},
	},
});
