import { Metadata } from "next";

import { BundleDetailView } from "@/features/admin/bundles/bundle-detail-view";

export const metadata: Metadata = {
	title: "Bundle Details | Rewaya Admin",
	description: "View and edit bundle details",
};

export default function BundleDetailPage() {
	return <BundleDetailView />;
}
