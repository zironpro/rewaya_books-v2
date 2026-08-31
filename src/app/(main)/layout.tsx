import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { MobileBottomNav } from "@/components/MobileBottomNav";

export default async function MainLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const categories: any[] = [];

	return (
		<>
			<Navbar categories={categories} />
			{children}
			<MobileBottomNav />
			<Footer />
		</>
	);
}
