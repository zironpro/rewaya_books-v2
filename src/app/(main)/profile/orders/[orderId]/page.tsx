import { notFound, redirect } from "next/navigation";

import { auth } from "@/auth";
import { OrderDetailPage } from "@/features/profile/pages/order-detail-page";
import { Order } from "@/lib/db/models/Order";
import connectToDatabase from "@/lib/db/mongodb";

export const metadata = {
	title: "Order Details | Rewaya",
	description: "View the details of your order.",
};

export default async function ProfileOrderDetailPage({
	params,
}: {
	params: Promise<{ orderId: string }>;
}) {
	const resolvedParams = await params;
	const session = await auth();

	if (!session?.user?.email) {
		redirect("/login");
	}

	await connectToDatabase();

	try {
		const rawOrder = await Order.findOne({
			_id: resolvedParams.orderId,
			email: session.user.email,
		})
			.populate({
				path: "items.productId",
				select: "isbn",
			})
			.lean();

		if (!rawOrder) {
			notFound();
		}

		// Convert MongoDB ObjectIds to strings to avoid passing complex objects to Client Components
		const serializedOrder = {
			...rawOrder,
			_id: rawOrder._id.toString(),
			userId: rawOrder.userId?.toString(),
			items: rawOrder.items?.map((item: any) => ({
				...item,
				_id: item._id?.toString(),
				productId:
					item.productId?._id?.toString() || item.productId?.toString(),
				isbn: item.productId?.isbn || undefined,
				bundleId: item.bundleId?.toString(),
			})),
		};

		return <OrderDetailPage order={serializedOrder} />;
	} catch (error) {
		// If the ID is malformed or invalid, mongoose will throw a CastError.
		notFound();
	}
}
