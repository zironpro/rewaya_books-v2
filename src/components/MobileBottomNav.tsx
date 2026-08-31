"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Grid, Home, type LucideIcon, ShoppingBag, User } from "lucide-react";

import { useCartCount } from "@/hooks/use-cart-count";
import { cn } from "@/lib/utils";

type NavItem = {
	label: string;
	icon: LucideIcon;
	href: string;
	badge?: number;
	activePrefixes?: string[];
};

function isNavItemActive(pathname: string, item: NavItem): boolean {
	const prefixes = item.activePrefixes ?? [item.href];

	return prefixes.some((prefix) => {
		if (prefix === "/") return pathname === "/";
		return pathname === prefix || pathname.startsWith(`${prefix}/`);
	});
}

export function MobileBottomNav() {
	const pathname = usePathname();
	const cartCount = useCartCount();
	const isReady = true;
	const isLoggedIn = false;
	const memberDisplayName = "";

	const navItems: NavItem[] = [
		{ label: "Home", icon: Home, href: "/" },
		{
			label: "Shop",
			icon: Grid,
			href: "/shop",
			activePrefixes: ["/shop", "/product", "/bundle", "/bundles"],
		},
		{ label: "Cart", icon: ShoppingBag, href: "/cart", badge: cartCount },
		{
			label:
				isReady && isLoggedIn
					? memberDisplayName.split(" ")[0] || "Profile"
					: "Profile",
			icon: User,
			href: isLoggedIn ? "/profile" : "/login",
			activePrefixes: ["/login", "/signup", "/profile"],
		},
	];

	return (
		<div className="fixed right-0 bottom-0 left-0 z-50 border-stone-100 border-t bg-card/95 backdrop-blur-lg md:hidden">
			<div className="flex h-16 items-center justify-around px-2">
				{navItems.map((item) => {
					const isActive = isNavItemActive(pathname, item);
					const Icon = item.icon;

					return (
						<Link
							className="group relative flex h-full w-full flex-col items-center justify-center"
							href={item.href}
							key={item.label}
						>
							<div className="flex flex-col items-center">
								<div className="relative">
									<Icon
										className={cn(isActive ? "text-primary" : "text-stone-400")}
										size={20}
										strokeWidth={isActive ? 2 : 1.2}
									/>
									{item.label === "Cart" &&
										item.badge != null &&
										item.badge > 0 && (
											<span className="absolute -top-2 -right-2 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-primary px-1 font-bold text-[9px] text-white ring-2 ring-white">
												{item.badge}
											</span>
										)}
								</div>

								<span
									className={cn(
										"mt-0.5 font-medium text-xs",
										isActive ? "text-primary" : "text-muted-foreground"
									)}
								>
									{item.label}
								</span>
							</div>
						</Link>
					);
				})}
			</div>
		</div>
	);
}
