import { Metadata } from "next";

import { ShippingView } from "@/features/admin/shipping/shipping-view";

export const metadata: Metadata = {
	title: "Shipping & Delivery Rates | Rewaya Admin",
	description:
		"Configure multi-country shipping zones, rates in AED, and free delivery thresholds.",
};

export default function ShippingPage() {
	return <ShippingView />;
}
