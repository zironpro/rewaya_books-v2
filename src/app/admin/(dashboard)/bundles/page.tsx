import { Metadata } from "next";
import { BundlesView } from "@/features/admin/bundles/bundles-view";

export const metadata: Metadata = {
	title: "Book Bundles Manager | Rewaya Admin",
	description:
		"Configure marketing content bundles, strikethrough savings, and included titles.",
};

export default function BundlesPage() {
	return <BundlesView />;
}
