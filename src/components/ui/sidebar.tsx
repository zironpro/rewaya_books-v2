"use client";

import * as React from "react";

import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { PanelLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

const SIDEBAR_COOKIE_NAME = "sidebar:state";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = "16rem";
const SIDEBAR_WIDTH_MOBILE = "18rem";
const SIDEBAR_WIDTH_ICON = "3.5rem";
const SIDEBAR_KEYBOARD_SHORTCUT = "b";

type SidebarContext = {
	state: "expanded" | "collapsed";
	open: boolean;
	setOpen: (open: boolean) => void;
	openMobile: boolean;
	setOpenMobile: (open: boolean) => void;
	isMobile: boolean;
	toggleSidebar: () => void;
};

const SidebarContext = React.createContext<SidebarContext | null>(null);

function useSidebar() {
	const context = React.useContext(SidebarContext);
	if (!context) {
		throw new Error("useSidebar must be used within a SidebarProvider.");
	}
	return context;
}

const SidebarProvider = React.forwardRef<
	HTMLDivElement,
	React.ComponentProps<"div"> & {
		defaultOpen?: boolean;
		open?: boolean;
		onOpenChange?: (open: boolean) => void;
	}
>(
	(
		{
			defaultOpen = true,
			open: openProp,
			onOpenChange: setOpenProp,
			className,
			style,
			children,
			...props
		},
		ref
	) => {
		const isMobile = useIsMobile();
		const [openMobile, setOpenMobile] = React.useState(false);

		// This is the internal state of the sidebar.
		// We use openProp and setOpenProp for controlled state.
		const [_open, _setOpen] = React.useState(defaultOpen);
		const open = openProp ?? _open;

		const setOpen = React.useCallback(
			(value: boolean | ((value: boolean) => boolean)) => {
				const openState = typeof value === "function" ? value(open) : value;
				if (setOpenProp) {
					setOpenProp(openState);
				} else {
					_setOpen(openState);
				}

				// Standard cookie storage for persistence
				document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
			},
			[setOpenProp, open]
		);

		// Helper to toggle the sidebar.
		const toggleSidebar = React.useCallback(() => {
			return isMobile
				? setOpenMobile((open) => !open)
				: setOpen((open) => !open);
		}, [isMobile, setOpen, setOpenMobile]);

		// Keyboard shortcut handler (Ctrl+B / Cmd+B)
		React.useEffect(() => {
			const handleKeyDown = (event: KeyboardEvent) => {
				if (
					event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
					(event.metaKey || event.ctrlKey)
				) {
					event.preventDefault();
					toggleSidebar();
				}
			};

			window.addEventListener("keydown", handleKeyDown);
			return () => window.removeEventListener("keydown", handleKeyDown);
		}, [toggleSidebar]);

		// State calculation for styling dataset attributes
		const state = open ? "expanded" : "collapsed";

		const contextValue = React.useMemo<SidebarContext>(
			() => ({
				state,
				open,
				setOpen,
				isMobile,
				openMobile,
				setOpenMobile,
				toggleSidebar,
			}),
			[state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar]
		);

		return (
			<SidebarContext.Provider value={contextValue}>
				<TooltipProvider delayDuration={0}>
					<div
						className={cn(
							"group/sidebar-wrapper flex min-h-svh w-full text-sidebar-foreground has-[[data-variant=inset]]:bg-sidebar",
							className
						)}
						ref={ref}
						style={
							{
								"--sidebar-width": SIDEBAR_WIDTH,
								"--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
								...style,
							} as React.CSSProperties
						}
						{...props}
					>
						{children}
					</div>
				</TooltipProvider>
			</SidebarContext.Provider>
		);
	}
);
SidebarProvider.displayName = "SidebarProvider";

const Sidebar = React.forwardRef<
	HTMLDivElement,
	React.ComponentProps<"div"> & {
		side?: "left" | "right";
		variant?: "sidebar" | "floating" | "inset";
		collapsible?: "offcanvas" | "icon" | "none";
	}
>(
	(
		{
			side = "left",
			variant = "sidebar",
			collapsible = "icon",
			className,
			children,
			...props
		},
		ref
	) => {
		const { isMobile, state, openMobile, setOpenMobile } = useSidebar();

		if (collapsible === "none") {
			return (
				<aside
					className={cn(
						"sticky top-0 z-20 flex h-svh w-64 shrink-0 flex-col border-sidebar-border border-r bg-sidebar text-sidebar-foreground",
						className
					)}
					ref={ref}
					{...props}
				>
					{children}
				</aside>
			);
		}

		if (isMobile) {
			return (
				<Sheet onOpenChange={setOpenMobile} open={openMobile} {...props}>
					<SheetContent
						className="w-72 border-sidebar-border border-r bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden"
						data-mobile="true"
						data-sidebar="sidebar"
						side={side}
					>
						<div className="flex h-full w-full flex-col">{children}</div>
					</SheetContent>
				</Sheet>
			);
		}

		return (
			<aside
				className={cn(
					"group sticky top-0 z-20 hidden h-svh shrink-0 flex-col border-sidebar-border border-r bg-sidebar text-sidebar-foreground transition-all duration-300 ease-in-out md:flex",
					state === "collapsed" ? "w-16" : "w-64",
					className
				)}
				data-collapsible={state === "collapsed" ? collapsible : ""}
				data-side={side}
				data-state={state}
				data-variant={variant}
				ref={ref}
				{...props}
			>
				<div
					className="flex h-full w-full flex-col bg-sidebar"
					data-sidebar="sidebar"
				>
					{children}
				</div>
			</aside>
		);
	}
);
Sidebar.displayName = "Sidebar";

const SidebarTrigger = React.forwardRef<
	React.ComponentRef<typeof Button>,
	React.ComponentProps<typeof Button>
>(({ className, onClick, ...props }, ref) => {
	const { toggleSidebar } = useSidebar();

	return (
		<Button
			className={cn(
				"h-8 w-8 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800",
				className
			)}
			data-sidebar="trigger"
			onClick={(event) => {
				onClick?.(event);
				toggleSidebar();
			}}
			ref={ref}
			size="icon"
			variant="ghost"
			{...props}
		>
			<PanelLeft className="h-4 w-4" />
			<span className="sr-only">Toggle Sidebar</span>
		</Button>
	);
});
SidebarTrigger.displayName = "SidebarTrigger";

const SidebarRail = React.forwardRef<
	HTMLButtonElement,
	React.ComponentProps<"button">
>(({ className, ...props }, ref) => {
	const { toggleSidebar } = useSidebar();

	return (
		<button
			aria-label="Toggle Sidebar"
			className={cn(
				"absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] hover:after:bg-sidebar-border group-data-[side=left]:-right-4 group-data-[side=right]:left-0 sm:flex",
				"[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize",
				"[[data-side=left][data-collapsible=offcanvas]_&]:-right-2 [[data-side=right][data-collapsible=offcanvas]_&]:-left-2",
				className
			)}
			data-sidebar="rail"
			onClick={toggleSidebar}
			ref={ref}
			tabIndex={-1}
			title="Toggle Sidebar"
			{...props}
		/>
	);
});
SidebarRail.displayName = "SidebarRail";

const SidebarInset = React.forwardRef<
	HTMLDivElement,
	React.ComponentProps<"main">
>(({ className, ...props }, ref) => {
	return (
		<main
			className={cn(
				"relative flex min-h-svh w-full min-w-0 flex-1 flex-col bg-background transition-all duration-300 ease-in-out",
				"peer-data-[variant=inset]:m-2 peer-data-[variant=inset]:min-h-[calc(100svh-theme(spacing.4))] peer-data-[variant=inset]:rounded-lg peer-data-[variant=inset]:shadow-xs peer-data-[variant=inset]:md:peer-data-[state=collapsed]:ml-2 peer-data-[variant=inset]:md:peer-data-[state=expanded]:ml-0",
				className
			)}
			ref={ref}
			{...props}
		/>
	);
});
SidebarInset.displayName = "SidebarInset";

const SidebarInput = React.forwardRef<
	React.ComponentRef<typeof Input>,
	React.ComponentProps<typeof Input>
>(({ className, ...props }, ref) => {
	return (
		<Input
			className={cn(
				"h-8 w-full bg-slate-100 shadow-none focus-visible:ring-1 focus-visible:ring-sidebar-ring dark:bg-slate-800",
				className
			)}
			data-sidebar="input"
			ref={ref}
			{...props}
		/>
	);
});
SidebarInput.displayName = "SidebarInput";

const SidebarHeader = React.forwardRef<
	HTMLDivElement,
	React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
	return (
		<div
			className={cn("flex flex-col gap-2 p-3", className)}
			data-sidebar="header"
			ref={ref}
			{...props}
		/>
	);
});
SidebarHeader.displayName = "SidebarHeader";

const SidebarFooter = React.forwardRef<
	HTMLDivElement,
	React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
	return (
		<div
			className={cn("mt-auto flex flex-col gap-2 p-3", className)}
			data-sidebar="footer"
			ref={ref}
			{...props}
		/>
	);
});
SidebarFooter.displayName = "SidebarFooter";

const SidebarSeparator = React.forwardRef<
	React.ComponentRef<typeof Separator>,
	React.ComponentProps<typeof Separator>
>(({ className, ...props }, ref) => {
	return (
		<Separator
			className={cn("mx-2 w-auto bg-sidebar-border", className)}
			data-sidebar="separator"
			ref={ref}
			{...props}
		/>
	);
});
SidebarSeparator.displayName = "SidebarSeparator";

const SidebarContent = React.forwardRef<
	HTMLDivElement,
	React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
	return (
		<div
			className={cn(
				"flex min-h-0 flex-1 flex-col gap-2 overflow-auto p-2 group-data-[collapsible=icon]:overflow-hidden",
				className
			)}
			data-sidebar="content"
			ref={ref}
			{...props}
		/>
	);
});
SidebarContent.displayName = "SidebarContent";

const SidebarGroup = React.forwardRef<
	HTMLDivElement,
	React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
	return (
		<div
			className={cn("relative flex w-full min-w-0 flex-col p-1", className)}
			data-sidebar="group"
			ref={ref}
			{...props}
		/>
	);
});
SidebarGroup.displayName = "SidebarGroup";

const SidebarGroupLabel = React.forwardRef<
	HTMLDivElement,
	React.ComponentProps<"div"> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
	const Comp = asChild ? Slot : "div";

	return (
		<Comp
			className={cn(
				"flex h-8 shrink-0 items-center rounded-md px-2 font-semibold text-slate-500 text-sm outline-none transition-[margin,opaicty] duration-200 ease-linear focus-visible:ring-2 focus-visible:ring-sidebar-ring dark:text-slate-400 [&>svg]:size-4 [&>svg]:shrink-0",
				"group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0",
				className
			)}
			data-sidebar="group-label"
			ref={ref}
			{...props}
		/>
	);
});
SidebarGroupLabel.displayName = "SidebarGroupLabel";

const SidebarGroupAction = React.forwardRef<
	HTMLButtonElement,
	React.ComponentProps<"button"> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
	const Comp = asChild ? Slot : "button";

	return (
		<Comp
			className={cn(
				"absolute top-3.5 right-3 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-slate-500 outline-none transition-transform hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-2 focus-visible:ring-sidebar-ring dark:hover:bg-slate-800 dark:hover:text-white [&>svg]:size-4 [&>svg]:shrink-0",
				"group-data-[collapsible=icon]:hidden",
				className
			)}
			data-sidebar="group-action"
			ref={ref}
			{...props}
		/>
	);
});
SidebarGroupAction.displayName = "SidebarGroupAction";

const SidebarGroupContent = React.forwardRef<
	HTMLDivElement,
	React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
	<div
		className={cn("w-full text-sm", className)}
		data-sidebar="group-content"
		ref={ref}
		{...props}
	/>
));
SidebarGroupContent.displayName = "SidebarGroupContent";

const SidebarMenu = React.forwardRef<
	HTMLUListElement,
	React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
	<ul
		className={cn("flex w-full min-w-0 flex-col gap-1", className)}
		data-sidebar="menu"
		ref={ref}
		{...props}
	/>
));
SidebarMenu.displayName = "SidebarMenu";

const SidebarMenuItem = React.forwardRef<
	HTMLLIElement,
	React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
	<li
		className={cn("group/menu-item relative", className)}
		data-sidebar="menu-item"
		ref={ref}
		{...props}
	/>
));
SidebarMenuItem.displayName = "SidebarMenuItem";

const sidebarMenuButtonVariants = cva(
	"peer/menu-button flex w-full items-center gap-3 overflow-hidden rounded-lg p-2 text-left font-medium text-sm outline-none transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-semibold data-[active=true]:text-sidebar-primary [&>svg]:size-4 [&>svg]:shrink-0",
	{
		variants: {
			variant: {
				default:
					"text-slate-700 hover:bg-slate-100 data-[active=true]:bg-primary/10 data-[active=true]:text-primary dark:text-slate-200 dark:data-[active=true]:bg-primary/20 dark:data-[active=true]:text-primary-foreground dark:hover:bg-slate-800/80",
				outline:
					"bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]",
			},
			size: {
				default: "h-9 text-base",
				sm: "h-8 text-sm",
				lg: "group-data-[collapsible=icon]:!p-0 h-12 text-base",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	}
);

const SidebarMenuButton = React.forwardRef<
	HTMLButtonElement,
	React.ComponentProps<"button"> & {
		asChild?: boolean;
		isActive?: boolean;
		tooltip?: string | React.ComponentProps<typeof TooltipContent>;
	} & VariantProps<typeof sidebarMenuButtonVariants>
>(
	(
		{
			asChild = false,
			isActive = false,
			variant = "default",
			size = "default",
			tooltip,
			className,
			...props
		},
		ref
	) => {
		const Comp = asChild ? Slot : "button";
		const { isMobile, state } = useSidebar();

		const button = (
			<Comp
				className={cn(sidebarMenuButtonVariants({ variant, size }), className)}
				data-active={isActive}
				data-sidebar="menu-button"
				data-size={size}
				ref={ref}
				{...props}
			/>
		);

		if (!tooltip) {
			return button;
		}

		if (typeof tooltip === "string") {
			tooltip = {
				children: tooltip,
			};
		}

		return (
			<Tooltip>
				<TooltipTrigger asChild>{button}</TooltipTrigger>
				<TooltipContent
					align="center"
					hidden={state !== "collapsed" || isMobile}
					side="right"
					{...tooltip}
				/>
			</Tooltip>
		);
	}
);
SidebarMenuButton.displayName = "SidebarMenuButton";

const SidebarMenuAction = React.forwardRef<
	HTMLButtonElement,
	React.ComponentProps<"button"> & {
		asChild?: boolean;
		showOnHover?: boolean;
	}
>(({ className, asChild = false, showOnHover = false, ...props }, ref) => {
	const Comp = asChild ? Slot : "button";

	return (
		<Comp
			className={cn(
				"absolute top-1.5 right-1 flex aspect-square w-6 items-center justify-center rounded-md p-0 text-slate-500 outline-none transition-transform hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-2 focus-visible:ring-sidebar-ring dark:hover:bg-slate-800 dark:hover:text-white [&>svg]:size-4 [&>svg]:shrink-0",
				"peer-data-[size=sm]/menu-button:top-1",
				"peer-data-[size=default]/menu-button:top-1.5",
				"peer-data-[size=lg]/menu-button:top-2.5",
				"group-data-[collapsible=icon]:hidden",
				showOnHover &&
					"group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 md:opacity-0",
				className
			)}
			data-sidebar="menu-action"
			ref={ref}
			{...props}
		/>
	);
});
SidebarMenuAction.displayName = "SidebarMenuAction";

const SidebarMenuSub = React.forwardRef<
	HTMLUListElement,
	React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
	<ul
		className={cn(
			"mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-sidebar-border border-l px-2.5 py-0.5",
			"group-data-[collapsible=icon]:hidden",
			className
		)}
		data-sidebar="menu-sub"
		ref={ref}
		{...props}
	/>
));
SidebarMenuSub.displayName = "SidebarMenuSub";

const SidebarMenuSubItem = React.forwardRef<
	HTMLLIElement,
	React.ComponentProps<"li">
>(({ ...props }, ref) => <li ref={ref} {...props} />);
SidebarMenuSubItem.displayName = "SidebarMenuSubItem";

const SidebarMenuSubButton = React.forwardRef<
	HTMLAnchorElement,
	React.ComponentProps<"a"> & {
		asChild?: boolean;
		size?: "sm" | "md";
		isActive?: boolean;
	}
>(({ asChild = false, size = "md", isActive, className, ...props }, ref) => {
	const Comp = asChild ? Slot : "a";

	return (
		<Comp
			className={cn(
				"flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 font-medium text-slate-600 text-xs outline-none hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-2 focus-visible:ring-sidebar-ring active:bg-slate-100 disabled:pointer-events-none disabled:opacity-50 data-[active=true]:font-semibold data-[active=true]:text-primary dark:text-slate-400 dark:data-[active=true]:text-primary-foreground dark:hover:bg-slate-800 dark:hover:text-white",
				size === "sm" && "text-[11px]",
				size === "md" && "text-xs",
				className
			)}
			data-active={isActive}
			data-sidebar="menu-sub-button"
			data-size={size}
			ref={ref}
			{...props}
		/>
	);
});
SidebarMenuSubButton.displayName = "SidebarMenuSubButton";

export {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupAction,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarInput,
	SidebarInset,
	SidebarMenu,
	SidebarMenuAction,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
	SidebarProvider,
	SidebarRail,
	SidebarSeparator,
	SidebarTrigger,
	useSidebar,
};
