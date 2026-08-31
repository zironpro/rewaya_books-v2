import { Metadata } from "next";
import { OrdersView } from "@/features/admin/orders/orders-view";

export const metadata: Metadata = {
	title: "Customer Orders & Fulfillment | Rewaya Admin",
	description:
		"Track customer orders, payments, and GCC regional fulfillments.",
};

export default function OrdersPage() {
	return <OrdersView />;
}
