"use client";

import { useState } from "react";

import { OrdersTab } from "@/features/profile/components/orders-tab";
import { ProfilePageHeader } from "@/features/profile/components/profile-page-header";
import { ProfileStatusBanner } from "@/features/profile/components/profile-status-banner";

export const OrdersPage = ({
	initialOrders = [],
}: {
	initialOrders?: any[];
}) => {
	const [orders] = useState<any[]>(initialOrders);
	const [loading] = useState(false);
	const [error] = useState<string | null>(null);

	return (
		<>
			<ProfilePageHeader
				description="Manage and track your previous purchases"
				title="My Orders"
			/>
			{error ? <ProfileStatusBanner message={error} /> : null}
			<OrdersTab loading={loading} orders={orders} />
		</>
	);
};
