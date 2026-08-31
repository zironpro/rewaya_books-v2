import { ProfileLayout } from "@/features/profile/profile-layout";

export default function ProfileRouteLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return <ProfileLayout>{children}</ProfileLayout>;
}
