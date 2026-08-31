"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { LogOut, LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface NavItem {
	href: string;
	label: string;
	icon: LucideIcon;
}

interface ProfileSidebarProps {
	navItems: NavItem[];
	onLogout?: () => void;
	isLoggingOut?: boolean;
	user: {
		name: string;
		email: string;
		avatar: string;
	};
}

function isNavActive(pathname: string, href: string): boolean {
	if (href === "/profile") {
		return pathname === "/profile";
	}
	return pathname === href || pathname.startsWith(`${href}/`);
}

export const ProfileSidebar = ({
	navItems,
	onLogout,
	isLoggingOut = false,
	user,
}: ProfileSidebarProps) => {
	const pathname = usePathname();

	return (
		<aside className="w-full shrink-0 lg:w-80">
			<div className="sticky top-28 space-y-6 lg:top-32 lg:space-y-8">
				<div className="flex items-center gap-4 rounded-lg border border-stone-100 bg-stone-50 p-5">
					<div className="relative size-16 overflow-hidden rounded-full border-2 border-white shadow-soft">
						<Image
							alt="User Avatar"
							className="object-cover"
							fill
							src={user.avatar}
						/>
					</div>
					<div className="min-w-0">
						<h2 className="truncate font-bold text-secondary">{user.name}</h2>
						<p className="truncate text-sm text-stone-400">{user.email}</p>
					</div>
				</div>

				<nav className="scrollbar-none flex items-center gap-2.5 overflow-x-auto px-1 pb-2 [-ms-overflow-style:none] lg:flex-col lg:items-stretch lg:overflow-visible lg:px-0 lg:pb-0 [&::-webkit-scrollbar]:hidden">
					{navItems.map((item) => {
						const active = isNavActive(pathname, item.href);
						return (
							<Link
								className={cn(
									"flex shrink-0 items-center gap-3 rounded-2xl px-5 py-3.5 text-left transition-all duration-300 lg:shrink lg:px-6 lg:py-4",
									active
										? "bg-primary text-white shadow-heavy"
										: "text-secondary hover:bg-stone-50"
								)}
								href={item.href}
								key={item.href}
							>
								<item.icon size={18} />
								<span className="font-bold text-sm">{item.label}</span>
							</Link>
						);
					})}
					<div className="ml-2 shrink-0 border-stone-100 border-l pl-6 lg:mt-6 lg:ml-0 lg:border-t lg:border-l-0 lg:pt-6 lg:pl-0">
						<button
							className="flex w-full shrink-0 items-center gap-3 rounded-2xl px-5 py-3.5 text-left text-red-500 transition-colors hover:bg-red-50 disabled:opacity-50 lg:px-6 lg:py-4"
							disabled={isLoggingOut}
							onClick={onLogout}
							type="button"
						>
							<LogOut size={18} />
							<span className="font-bold text-sm">
								{isLoggingOut ? "Signing out…" : "Sign Out"}
							</span>
						</button>
					</div>
				</nav>
			</div>
		</aside>
	);
};
