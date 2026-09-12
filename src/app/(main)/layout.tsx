import { GlobalPopup } from "@/components/global-popup";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { MobileBottomNav } from "@/components/MobileBottomNav";

import { graphqlClient } from "@/lib/graphql-client";
import { GetCategoriesDocument, GetPopupsDocument } from "@/types/graphql";

export default async function MainLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	let categories: any[] = [];
	let popup = null;
	try {
		const [res, categoriesRes] = await Promise.all([
			graphqlClient.request(GetPopupsDocument),
			graphqlClient.request(GetCategoriesDocument),
		]);
		const now = new Date();
		popup =
			res.popups?.find(
				(p) =>
					p.enabled && (!p.expiresAt || new Date(Number(p.expiresAt)) > now)
			) || null;

		categories = (categoriesRes.categories || [])
			.filter((c: any) => c.status !== "Hidden" && c.status !== "Draft")
			.sort((a: any, b: any) => (a.sort || 0) - (b.sort || 0))
			.map((c: any) => ({
				...c,
				href: `/shop?category=${encodeURIComponent(c.slug || c.id)}`,
			}));
	} catch (error) {
		console.error("Failed to fetch layout data:", error);
	}

	return (
		<>
			<Navbar categories={categories} />
			{children}
			<MobileBottomNav />
			<Footer />
			{popup && <GlobalPopup popup={popup} />}
		</>
	);
}
