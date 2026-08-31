"use client";

import {
	Drawer,
	DrawerHeader,
	DrawerPanel,
	DrawerPopup,
	DrawerTitle,
} from "@/components/ui/drawer";

import { cn } from "@/lib/utils";

interface MobileFilterDrawerProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	title?: string;
	children: React.ReactNode;
	className?: string;
}

export function MobileFilterDrawer({
	open,
	onOpenChange,
	title = "Refine selection",
	children,
	className,
}: MobileFilterDrawerProps) {
	return (
		<Drawer onOpenChange={onOpenChange} open={open} position="bottom">
			<DrawerPopup
				className={cn("z-[60] max-h-[85vh] lg:hidden", className)}
				showBar
				showCloseButton
			>
				<DrawerHeader className="border-stone-100 border-b pb-4">
					<DrawerTitle className="font-bold text-sm">{title}</DrawerTitle>
				</DrawerHeader>
				<DrawerPanel className="pb-20">{children}</DrawerPanel>
			</DrawerPopup>
		</Drawer>
	);
}
