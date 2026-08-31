import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface StatusBannerProps {
	variant?: "error" | "success" | "info";
	children: ReactNode;
	className?: string;
}

const variantClass: Record<
	NonNullable<StatusBannerProps["variant"]>,
	string
> = {
	error: "border-destructive/30 bg-destructive/10 text-destructive",
	success: "border-success/30 bg-success/10 text-success",
	info: "border-border bg-muted/50 text-muted-foreground",
};

export function StatusBanner({
	variant = "info",
	children,
	className,
}: StatusBannerProps) {
	return (
		<div
			className={cn(
				"rounded-lg border px-4 py-3 text-sm",
				variantClass[variant],
				className
			)}
			role={variant === "error" ? "alert" : "status"}
		>
			{children}
		</div>
	);
}
