import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

export default function BundleMarketingLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<>
			<Navbar showActions={false} showCategories={false} showSearch={false} />
			{children}
			<Footer />
		</>
	);
}
