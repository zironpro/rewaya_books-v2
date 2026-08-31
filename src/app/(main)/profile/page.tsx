import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { OverviewPage } from "@/features/profile/pages/overview-page";
import { Order } from "@/lib/db/models/Order";
import { User } from "@/lib/db/models/User";
import connectToDatabase from "@/lib/db/mongodb";

export const metadata = {
	title: "My Profile | Rewaya",
	description:
		"Manage your account, track orders, and update your preferences.",
};

export default async function ProfilePage() {
	const session = await auth();

	if (!session?.user?.email) {
		redirect("/login");
	}

	await connectToDatabase();
	const userDoc = await User.findOne({ email: session.user.email }).lean();

	if (!userDoc) {
		redirect("/login");
	}

	const serializedUser = {
		name: userDoc.name || "",
		phone: userDoc.phone || "",
		email: userDoc.email || "",
	};

	const rawOrders = await Order.find({ email: session.user.email })
		.sort({ createdAt: -1 })
		.limit(10)
		.lean();

	const formattedOrders = rawOrders.map((o: any) => {
		const totalItems = o.items?.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0) || 0;
		const statusMap: Record<string, string> = {
			DELIVERED: "Delivered",
			SHIPPED: "Shipped",
			CANCELLED: "Cancelled",
			PENDING: "Pending",
		};
		const formattedStatus = statusMap[o.status] || "Pending";

		return {
			id: o._id.toString(),
			orderId: o._id.toString(),
			date: new Date(o.createdAt).toLocaleDateString("en-US", {
				month: "long",
				day: "numeric",
				year: "numeric",
			}),
			status: formattedStatus,
			items: totalItems,
			total: `AED ${o.total.toFixed(2)}`,
		};
	});

	return <OverviewPage initialOrders={formattedOrders} initialUser={serializedUser} />;
}
