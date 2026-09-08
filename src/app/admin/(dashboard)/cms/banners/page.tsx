import { Metadata } from "next";

import { HeroBannersView } from "@/features/admin/cms/hero-banners-view";

export const metadata: Metadata = {
	title: "Hero Banners Carousel | Rewaya Admin",
	description:
		"Manage storefront homepage hero carousel slides and promotional CTAs.",
};

export default function BannersPage() {
	return <HeroBannersView />;
}
