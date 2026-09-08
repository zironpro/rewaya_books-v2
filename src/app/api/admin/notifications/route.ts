import { NextRequest, NextResponse } from "next/server";

import { Notification } from "@/lib/db/models/Notification";
import connectToDatabase from "@/lib/db/mongodb";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
	try {
		await connectToDatabase();

		// Fetch latest 50 notifications
		const notifications = await Notification.find({})
			.sort({ createdAt: -1 })
			.limit(50);

		return NextResponse.json({ notifications });
	} catch (error) {
		console.error("Error fetching notifications:", error);
		return NextResponse.json(
			{ error: "Failed to fetch notifications" },
			{ status: 500 }
		);
	}
}

export async function PATCH(req: NextRequest) {
	try {
		await connectToDatabase();

		// Mark all unread notifications as read
		await Notification.updateMany({ read: false }, { read: true });

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Error updating notifications:", error);
		return NextResponse.json(
			{ error: "Failed to update notifications" },
			{ status: 500 }
		);
	}
}
