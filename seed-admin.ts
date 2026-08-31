import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function createAdmin() {
	const { User } = await import("./src/lib/db/models/User.js");
	const connectToDatabase = (await import("./src/lib/db/mongodb.js")).default;

	await connectToDatabase();

	const email = "admin@example.com";
	const password = "password";
	const hashedPassword = await bcrypt.hash(password, 10);

	const existingUser = await User.findOne({ email });
	if (existingUser) {
		console.log("Admin user already exists. Updating password...");
		existingUser.password = hashedPassword;
		await existingUser.save();
		console.log("Password updated!");
	} else {
		const admin = new User({
			name: "Admin",
			email,
			password: hashedPassword,
			role: "ADMIN",
		});

		await admin.save();
		console.log("Admin user created successfully!");
	}
	process.exit(0);
}

createAdmin().catch(console.error);
