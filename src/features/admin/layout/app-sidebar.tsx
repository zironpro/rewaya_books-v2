"use client";

import * as React from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
	BookOpen,
	Image,
	Layers,
	LayoutDashboard,
	LogOut,
	MessageSquare,
	Package,
	Percent,
	RefreshCcw,
	ShoppingBag,
	Ticket,
	TrendingUp,
	Truck,
	Users,
} from "lucide-react";
import { signOut } from "next-auth/react";

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
	SidebarSeparator,
	useSidebar,
} from "@/components/ui/sidebar";

const ADMIN_URL = "/admin";

// Navigation Items Structure
const navItems = [
	{
		title: "Overview",
		items: [
			{
				title: "Dashboard",
				url: ADMIN_URL,
				icon: LayoutDashboard,
				badge: null,
			},
			{
				title: "Sales Analytics",
				url: `${ADMIN_URL}/analytics`,
				icon: TrendingUp,
				badge: "Live",
			},
		],
	},
	{
		title: "Catalog Management",
		items: [
			{
				title: "Books Catalog",
				url: `${ADMIN_URL}/catalog/books`,
				icon: BookOpen,
				badge: "12.6k",
			},
			{
				title: "Categories & Genres",
				url: `${ADMIN_URL}/catalog/categories`,
				icon: Layers,
				badge: "24",
			},
			{
				title: "Book Bundles",
				url: `${ADMIN_URL}/bundles`,
				icon: Package,
				badge: "Promo",
			},
			{
				title: "Coupons",
				url: `${ADMIN_URL}/coupons`,
				icon: Ticket,
				badge: null,
			},
		],
	},
	{
		title: "Storefront CMS",
		items: [
			// {
			// 	title: "Homepage Sections",
			// 	url: `${ADMIN_URL}/cms/sections`,
			// 	icon: Sliders,
			// 	badge: null,
			// },
			{
				title: "Hero Banners",
				url: `${ADMIN_URL}/cms/banners`,
				icon: Image,
				badge: null,
			},
			{
				title: "Popup Messages",
				url: `${ADMIN_URL}/cms/popups`,
				icon: MessageSquare,
				badge: null,
			},
		],
	},
	{
		title: "Sales & Customers",
		items: [
			{
				title: "Customer Orders",
				url: `${ADMIN_URL}/orders`,
				icon: ShoppingBag,
				badge: "1,420",
			},
			{
				title: "Refund Requests",
				url: `${ADMIN_URL}/refunds`,
				icon: RefreshCcw,
				badge: null,
			},
			{
				title: "Customers Directory",
				url: `${ADMIN_URL}/customers`,
				icon: Users,
				badge: "3.8k",
			},
		],
	},
	{
		title: "Store Operations",
		items: [
			{
				title: "Shipping & Delivery",
				url: `${ADMIN_URL}/shipping`,
				icon: Truck,
				badge: "GCC",
			},
			{
				title: "Taxes & VAT",
				url: `${ADMIN_URL}/taxes`,
				icon: Percent,
				badge: "5% VAT",
			},
		],
	},
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const pathname = usePathname();
	const { isMobile, setOpenMobile } = useSidebar();

	const handleLinkClick = () => {
		if (isMobile) {
			setOpenMobile(false);
		}
	};

	return (
		<Sidebar
			className="border-slate-200 border-r bg-white dark:border-slate-800 dark:bg-slate-950"
			collapsible="icon"
			{...props}
		>
			{/* Sidebar Header: Official Rewaya Logo */}
			<SidebarHeader className="p-4 pt-6 pb-2">
				<div className="flex w-full items-center justify-center">
					<Link
						className="flex w-full items-center justify-center overflow-hidden py-1"
						href="/"
					>
						{/* Icon for Collapsed Mode */}
						<img
							alt="Rewaya"
							className="hidden h-10 w-10 shrink-0 rounded-lg object-contain group-data-[collapsible=icon]:block"
							src="/logo.png"
						/>
						{/* Full Logo & Badge for Expanded Mode */}
						<div className="flex w-full items-center justify-center overflow-hidden group-data-[collapsible=icon]:hidden">
							<img
								alt="Rewaya Bookstores"
								className="h-10 w-auto shrink-0 object-contain transition-all dark:brightness-200 dark:invert"
								src="/rewaya-logo.svg"
							/>
						</div>
					</Link>
				</div>
			</SidebarHeader>

			<SidebarSeparator />

			{/* Sidebar Content: Grouped Navigation Links */}
			<SidebarContent className="px-2">
				{navItems.map((group) => (
					<SidebarGroup key={group.title}>
						<SidebarGroupLabel className="text-slate-400 text-sm uppercase tracking-wider dark:text-slate-500">
							{group.title}
						</SidebarGroupLabel>
						<SidebarGroupContent>
							<SidebarMenu>
								{group.items.map((item) => {
									const Icon = item.icon;
									const isActive = pathname === item.url;

									return (
										<SidebarMenuItem key={item.title}>
											<SidebarMenuButton
												asChild
												isActive={isActive}
												tooltip={item.title}
											>
												<Link
													className="flex w-full items-center justify-between"
													href={item.url}
													onClick={handleLinkClick}
												>
													<div className="flex items-center gap-3 overflow-hidden">
														<Icon className="h-4 w-4 shrink-0" />
														<span className="truncate">{item.title}</span>
													</div>
												</Link>
											</SidebarMenuButton>
										</SidebarMenuItem>
									);
								})}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				))}
			</SidebarContent>

			<SidebarSeparator />

			{/* Sidebar Footer: Logout */}
			<SidebarFooter className="p-3">
				<button
					className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-500 py-2.5 font-semibold text-white shadow-sm transition-colors hover:bg-red-600 group-data-[collapsible=icon]:p-2"
					onClick={() => signOut({ callbackUrl: "/admin/login" })}
					title="Log out"
				>
					<LogOut className="h-4 w-4 shrink-0" />
					<span className="truncate group-data-[collapsible=icon]:hidden">
						Logout
					</span>
				</button>
			</SidebarFooter>

			<SidebarRail />
		</Sidebar>
	);
}
