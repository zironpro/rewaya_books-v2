import { Metadata } from "next";

import { CustomersView } from "@/features/admin/customers/customers-view";

export const metadata: Metadata = {
	title: "Customers Directory | Rewaya Admin",
	description:
		"Customer account directory, order history, and regional lifetime spend.",
};

export default function CustomersPage() {
	return <CustomersView />;
}
