"use client";

import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

import Breadcrumbs from "@/components/layout/Breadcrumbs";

import { ProfileSidebar } from "@/features/profile/components/profile-sidebar";
import { profileNavItems } from "@/features/profile/data/profile-data";

const PROFILE_SHELL = "grow pt-8 pb-28 md:pb-16";

function breadcrumbItems(pathname: string) {
	if (pathname === "/profile") {
		return [{ label: "My Profile" }];
	}
	if (pathname.startsWith("/profile/orders/") && pathname.length > "/profile/orders/".length) {
		return [
			{ label: "My Profile", href: "/profile" },
			{ label: "Orders", href: "/profile/orders" },
			{ label: "Order Details" }
		];
	}
	const segment = pathname.split("/").pop() ?? "";
	const labels: Record<string, string> = {
		orders: "Orders",
		addresses: "Addresses",
		payment: "Payment",
		settings: "Settings",
	};
	const label = labels[segment] ?? "My Profile";
	return [{ label: "My Profile", href: "/profile" }, { label }];
}

export const ProfileLayout = ({ children }: { children: React.ReactNode }) => {
	const pathname = usePathname();

	const { data: session, status } = useSession();
	
	const isPending = status === "loading";
	const memberDisplayName = session?.user?.name || "User";
	const memberEmail = session?.user?.email || "";
	const memberAvatar = session?.user?.image || "";
	const logout = async () => {
		await signOut({ callbackUrl: "/" });
	};

	const user = {
		name: memberDisplayName,
		email: memberEmail,
		avatar: memberAvatar,
	};

	return (
		<main className={PROFILE_SHELL}>
			<div className="container">
				<Breadcrumbs
					className="mb-6 md:mb-8"
					items={breadcrumbItems(pathname)}
				/>

				<div className="flex flex-col gap-8 lg:flex-row lg:gap-10">
					<ProfileSidebar
						isLoggingOut={isPending}
						navItems={profileNavItems}
						onLogout={logout}
						user={user}
					/>

					<section className="min-w-0 flex-1 space-y-6 lg:space-y-8">
						{children}
					</section>
				</div>
			</div>
		</main>
	);
};
