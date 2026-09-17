import { Metadata } from "next";

import { SubscribersView } from "@/features/admin/subscribers/subscribers-view";

export const metadata: Metadata = {
	title: "Newsletter Subscribers | Rewaya Admin",
	description: "Manage newsletter subscribers and mailing lists.",
};

export default function SubscribersPage() {
	return <SubscribersView />;
}
