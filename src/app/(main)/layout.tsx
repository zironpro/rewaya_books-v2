import { GlobalPopup } from "@/components/global-popup";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { MobileBottomNav } from "@/components/MobileBottomNav";

import { graphqlClient } from "@/lib/graphql-client";
import { GetPopupsDocument } from "@/types/graphql";

export default async function MainLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const categories: any[] = [];
	let popup = null;
	try {
		const res = await graphqlClient.request(GetPopupsDocument);
		const now = new Date();
		popup =
			res.popups?.find(
				(p) =>
					p.enabled && (!p.expiresAt || new Date(Number(p.expiresAt)) > now)
			) || null;
	} catch (error) {
		console.error("Failed to fetch popups:", error);
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
