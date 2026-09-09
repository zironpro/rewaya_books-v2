import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { OrdersPage } from "@/features/profile/pages/orders-page";
import { Order } from "@/lib/db/models/Order";
import connectToDatabase from "@/lib/db/mongodb";

export const metadata = {
	title: "My Orders | Rewaya",
	description: "View and track your order history.",
};

export default async function ProfileOrdersPage() {
	const session = await auth();

	if (!session?.user?.email) {
		redirect("/login");
	}

	await connectToDatabase();

	const rawOrders = await Order.find({ email: session.user.email })
		.sort({ createdAt: -1 })
		.lean();

	const formattedOrders = rawOrders.map((o: any) => {
		const totalItems =
			o.items?.reduce(
				(sum: number, item: any) => sum + (item.quantity || 1),
				0
			) || 0;
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
			createdAt: o.createdAt.toISOString(),
			deliveredAt: o.deliveredAt ? o.deliveredAt.toISOString() : null,
			status: formattedStatus,
			items: totalItems,
			total: `AED ${o.total.toFixed(2)}`,
		};
	});

	return <OrdersPage initialOrders={formattedOrders} />;
}
