import { Metadata } from "next";

import { HomepageSectionsView } from "@/features/admin/cms/homepage-sections-view";

export const metadata: Metadata = {
	title: "Homepage CMS Sections | Rewaya Admin",
	description:
		"Configure dynamic storefront category sections, badges, and limits.",
};

export default function SectionsPage() {
	return <HomepageSectionsView />;
}
