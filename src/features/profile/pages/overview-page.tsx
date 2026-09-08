"use client";

import { useState } from "react";

import { OverviewTab } from "@/features/profile/components/overview-tab";
// import type { ProfileOrder } from "@/lib/profile-actions"; // Will define a generic one later

export const OverviewPage = ({
	initialUser,
	initialOrders = [],
}: {
	initialUser: any;
	initialOrders?: any[];
}) => {
	const [orders] = useState<any[]>(initialOrders);
	const [loading] = useState(false);

	const firstName = initialUser.name.split(" ")[0] || "";
	const lastName = initialUser.name.split(" ").slice(1).join(" ") || "";

	return (
		<OverviewTab
			email={initialUser.email}
			firstName={firstName}
			lastName={lastName}
			loading={loading}
			orders={orders}
			phone={initialUser.phone}
		/>
	);
};
