import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db/mongodb";
import { User } from "@/lib/db/models/User";

export async function GET() {
	try {
		await dbConnect();

		const adminEmail = "admin@rewayabooks.com";
		const adminPasswordRaw = "qwerty@rewaya8382";

		// Check if admin already exists
		const existingAdmin = await User.findOne({ email: adminEmail });

		if (existingAdmin) {
			if (!existingAdmin.adminPermissions?.includes("MASTER")) {
				existingAdmin.adminPermissions = ["MASTER"];
				await existingAdmin.save();
				return NextResponse.json({ message: "Admin already exists. Upgraded to MASTER." });
			}
			return NextResponse.json({ message: "Admin already exists and is MASTER." });
		}

		// Hash password
		const hashedPassword = await bcrypt.hash(adminPasswordRaw, 10);

		// Create admin user
		const adminUser = new User({
			name: "Admin",
			email: adminEmail,
			password: hashedPassword,
			role: "ADMIN",
			adminPermissions: ["MASTER"],
			emailVerified: new Date(),
		});

		await adminUser.save();

		return NextResponse.json({ message: "Admin seeded successfully!" });
	} catch (error) {
		console.error("Error seeding admin:", error);
		return NextResponse.json(
			{ error: "Failed to seed admin user" },
			{ status: 500 }
		);
	}
}
