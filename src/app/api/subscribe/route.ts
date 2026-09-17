import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db/mongodb";
import { Subscriber } from "@/lib/db/models/Subscriber";
import { sendWelcomeEmail } from "@/lib/email";

export async function POST(req: Request) {
	try {
		const { email } = await req.json();

		if (!email || typeof email !== "string" || !email.includes("@")) {
			return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
		}

		await connectToDatabase();

		let subscriber = await Subscriber.findOne({ email: email.toLowerCase() });

		if (subscriber) {
			if (subscriber.status === "subscribed") {
				return NextResponse.json({ message: "Already subscribed" });
			} else {
				// Resubscribe them
				subscriber.status = "subscribed";
				await subscriber.save();
			}
		} else {
			// New subscriber
			subscriber = await Subscriber.create({ email: email.toLowerCase() });
		}

		// Send welcome email asynchronously
		await sendWelcomeEmail(subscriber.email).catch(console.error);

		return NextResponse.json({ message: "Successfully subscribed" });
	} catch (error) {
		console.error("Subscription error:", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}

export async function GET(req: Request) {
	try {
		await connectToDatabase();
		const subscribers = await Subscriber.find().sort({ createdAt: -1 });
		return NextResponse.json(subscribers);
	} catch (error) {
		console.error("Failed to fetch subscribers:", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
