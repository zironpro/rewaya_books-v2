"use client";

import { useEffect, useState } from "react";

import Image from "next/image";
import Link from "next/link";

import {
	ArrowLeft,
	BookOpen,
	ChevronDown,
	ChevronRight,
	Heart,
	Info,
	Package,
	Sparkles,
	Star,
	User,
	Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	Collapsible,
	CollapsiblePanel,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
	Drawer,
	DrawerDescription,
	DrawerHeader,
	DrawerPanel,
	DrawerPopup,
	DrawerTitle,
} from "@/components/ui/drawer";

import { cn } from "@/lib/utils";

import { CATEGORIES, MEGA_MENU_DATA } from "../data";

type MobileNavigationDrawerProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	categories?: any[];
};
function sectionTriggerClass() {
	return cn(
		"group flex w-full items-center justify-between gap-3 rounded-xl border border-stone-200/80 bg-stone-50/60 px-4 py-3.5 text-start font-semibold text-secondary text-sm outline-none transition-colors",
		"hover:border-stone-300 hover:bg-stone-100/80",
		"focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20",
		"aria-expanded:border-stone-300 aria-expanded:bg-white"
	);
}

export function MobileNavigationDrawer({
	open,
	onOpenChange,
	categories,
}: MobileNavigationDrawerProps) {
	const [departmentsOpen, setDepartmentsOpen] = useState(false);

	const isReady = true;
	const isLoggedIn = false;
	const memberDisplayName = "";

	useEffect(() => {
		if (!open) {
			setDepartmentsOpen(false);
		}
	}, [open]);

	const closeAll = () => {
		setDepartmentsOpen(false);
		onOpenChange(false);
	};

	const closeNestedOnly = () => setDepartmentsOpen(false);

	return (
		<Drawer onOpenChange={onOpenChange} open={open} position="bottom">
			<DrawerPopup
				className="z-[60] max-h-[88vh] lg:hidden"
				showBar
				showCloseButton
			>
				<DrawerHeader className="border-stone-100 border-b pb-3">
					<DrawerTitle className="font-bold font-display text-lg">
						Menu
					</DrawerTitle>
					<DrawerDescription className="text-muted-foreground text-xs">
						Shop, categories, and your account
					</DrawerDescription>
				</DrawerHeader>

				<DrawerPanel className="pb-8" scrollFade={false}>
					<div className="space-y-3 pt-1">
						{/* Primary destinations — large tap targets */}
						<div className="grid grid-cols-2 gap-2">
							<Link
								className="flex flex-col gap-2 rounded-xl border border-stone-200 bg-white p-4 font-semibold text-secondary text-sm transition-colors hover:border-primary/35 hover:text-primary"
								href="/shop"
								onClick={closeAll}
							>
								<div className="grid size-10 place-content-center rounded-lg bg-primary/8 text-primary">
									<Sparkles className="size-5" />
								</div>
								Shop all books
							</Link>
							<Link
								className="flex flex-col gap-2 rounded-xl border border-stone-200 bg-white p-4 font-semibold text-secondary text-sm transition-colors hover:border-primary/35 hover:text-primary"
								href="/bundles"
								onClick={closeAll}
							>
								<div className="grid size-10 place-content-center rounded-lg bg-muted text-secondary">
									<Package className="size-5" />
								</div>
								Bundles
							</Link>
						</div>

						<div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
							<Link
								className="flex items-center gap-3 rounded-xl border border-stone-200 px-4 py-3 font-medium text-secondary text-sm transition-colors hover:border-primary/35 hover:bg-stone-50/80 hover:text-primary"
								href="/wishlist"
								onClick={closeAll}
							>
								<Heart className="size-4 shrink-0 text-primary/80" />
								Wishlist
							</Link>
							<Link
								className="flex items-center gap-3 rounded-xl border border-stone-200 px-4 py-3 font-medium text-secondary text-sm transition-colors hover:border-primary/35 hover:bg-stone-50/80 hover:text-primary"
								href="/about"
								onClick={closeAll}
							>
								<span className="grid size-8 shrink-0 place-content-center rounded-md bg-muted text-secondary">
									<Info className="size-4" />
								</span>
								About
							</Link>
							<Link
								className="flex items-center gap-3 rounded-xl border border-primary/25 bg-primary/5 px-4 py-3 font-bold text-primary text-sm transition-colors hover:bg-primary/10"
								href={isLoggedIn ? "/profile" : "/login"}
								onClick={closeAll}
							>
								<User className="size-4 shrink-0" />
								{isReady && isLoggedIn
									? memberDisplayName.split(" ")[0] || "Profile"
									: "Sign in"}
							</Link>
						</div>

						{/* Collapsible: quick category chips */}
						<Collapsible defaultOpen>
							<CollapsibleTrigger className={sectionTriggerClass()}>
								<span>Quick categories</span>
								<ChevronDown
									aria-hidden
									className="size-4 shrink-0 in-aria-expanded:rotate-180 text-muted-foreground transition-transform duration-200"
								/>
							</CollapsibleTrigger>
							<CollapsiblePanel>
								<div className="flex flex-wrap gap-2 px-1 pt-2 pb-1">
									{CATEGORIES.map(({ icon: Icon, ...cat }) => (
										<Link
											className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-3 py-2 font-medium text-secondary text-xs transition-colors hover:border-primary/40 hover:text-primary"
											href={cat.href}
											key={cat.name}
											onClick={closeAll}
										>
											<Icon className="size-3.5 shrink-0 opacity-80" />
											{cat.name}
										</Link>
									))}
								</div>
							</CollapsiblePanel>
						</Collapsible>

						{/* Collapsible: highlights */}
						<Collapsible defaultOpen={false}>
							<CollapsibleTrigger className={sectionTriggerClass()}>
								<span>Discover</span>
								<ChevronDown
									aria-hidden
									className="size-4 shrink-0 in-aria-expanded:rotate-180 text-muted-foreground transition-transform duration-200"
								/>
							</CollapsibleTrigger>
							<CollapsiblePanel>
								<div className="space-y-3 px-1 pt-2 pb-1">
									<Link
										className="flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-stone-100"
										href="/shop"
										onClick={closeAll}
									>
										<div className="grid size-9 shrink-0 place-content-center rounded-full bg-muted text-primary">
											<BookOpen className="size-4" />
										</div>
										<div>
											<p className="font-semibold text-secondary text-sm">
												New releases
											</p>
											<p className="text-muted-foreground text-xs">
												Updated daily
											</p>
										</div>
									</Link>
									<Link
										className="flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-stone-100"
										href="/shop"
										onClick={closeAll}
									>
										<div className="grid size-9 shrink-0 place-content-center rounded-full bg-muted text-secondary">
											<Star className="size-4" />
										</div>
										<div>
											<p className="font-semibold text-secondary text-sm">
												Best sellers
											</p>
											<p className="text-muted-foreground text-xs">Top picks</p>
										</div>
									</Link>
									<Link
										className="flex items-center gap-2 rounded-lg bg-primary/5 px-3 py-2.5 font-bold text-primary text-sm"
										href="/shop"
										onClick={closeAll}
									>
										<Zap className="size-4 shrink-0 fill-current" />
										Sale — up to 40% off
									</Link>
								</div>
							</CollapsiblePanel>
						</Collapsible>

						{/* Collapsible: featured */}
						<Collapsible defaultOpen={false}>
							<CollapsibleTrigger className={sectionTriggerClass()}>
								<span>Collection spotlight</span>
								<ChevronDown
									aria-hidden
									className="size-4 shrink-0 in-aria-expanded:rotate-180 text-muted-foreground transition-transform duration-200"
								/>
							</CollapsibleTrigger>
							<CollapsiblePanel>
								<Link
									className="mt-2 flex gap-4 overflow-hidden rounded-xl border border-stone-200 bg-stone-50/50 p-3 transition-colors hover:border-primary/30"
									href="/shop"
									onClick={closeAll}
								>
									<div className="relative aspect-3/4 w-24 shrink-0 overflow-hidden rounded-lg">
										<Image
											alt=""
											className="object-cover"
											fill
											sizes="96px"
											src={MEGA_MENU_DATA.featured.image}
										/>
										<span className="absolute bottom-2 left-2 bg-primary px-1.5 py-0.5 font-bold text-[10px] text-white">
											{MEGA_MENU_DATA.featured.tag}
										</span>
									</div>
									<div className="flex min-w-0 flex-col justify-center">
										<p className="font-bold text-secondary text-sm leading-snug">
											{MEGA_MENU_DATA.featured.title}
										</p>
										<p className="mt-1 font-semibold text-primary text-xs">
											Discover collection →
										</p>
									</div>
								</Link>
							</CollapsiblePanel>
						</Collapsible>

						{/* Nested departments — opens second drawer (stacked) */}
						<Button
							className="h-auto w-full justify-between gap-3 rounded-xl border border-stone-200 bg-white px-4 py-3.5 font-semibold text-secondary shadow-none hover:bg-stone-50"
							onClick={() => setDepartmentsOpen(true)}
							type="button"
							variant="outline"
						>
							<span className="text-sm">Browse by department</span>
							<ChevronRight
								aria-hidden
								className="size-4 shrink-0 text-muted-foreground"
							/>
						</Button>
					</div>

					{/* Nested drawer: drill-down into mega-menu groups */}
					<Drawer
						onOpenChange={setDepartmentsOpen}
						open={departmentsOpen}
						position="bottom"
					>
						<DrawerPopup
							className="z-[70] max-h-[92vh] lg:hidden"
							showBar
							showCloseButton
						>
							<DrawerHeader className="border-stone-100 border-b pb-3">
								<div className="flex items-center gap-2">
									<Button
										aria-label="Back to main menu"
										className="size-9 shrink-0 rounded-lg"
										onClick={closeNestedOnly}
										size="icon"
										type="button"
										variant="ghost"
									>
										<ArrowLeft className="size-5" />
									</Button>
									<div className="min-w-0">
										<DrawerTitle className="font-bold font-display text-lg leading-tight">
											Departments
										</DrawerTitle>
										<DrawerDescription className="text-muted-foreground text-xs">
											Expand a section, then open a topic in the shop
										</DrawerDescription>
									</div>
								</div>
							</DrawerHeader>

							<DrawerPanel className="pb-10" scrollFade={false}>
								<div className="space-y-2 pt-1">
									<ul className="space-y-0.5 border-stone-100 border-l-2 border-l-primary/25 py-2 ps-4">
										{categories?.map((cat) => (
											<li key={cat.id}>
												<Link
													className="flex items-center gap-2 rounded-md py-2.5 ps-1 font-medium text-secondary text-sm transition-colors hover:text-primary"
													href={cat.href}
													onClick={closeAll}
												>
													<span className="h-1 w-1 shrink-0 rounded-full bg-secondary/35" />
													{cat.name}
												</Link>
											</li>
										))}
									</ul>
								</div>

								<Link
									className="mt-6 flex w-full items-center justify-center rounded-xl border border-primary/20 bg-primary/5 py-3 font-bold text-primary text-sm"
									href="/shop"
									onClick={closeAll}
								>
									View full catalog
								</Link>
							</DrawerPanel>
						</DrawerPopup>
					</Drawer>
				</DrawerPanel>
			</DrawerPopup>
		</Drawer>
	);
}
