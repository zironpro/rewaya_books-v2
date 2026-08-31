import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface EmptyStateProps {
	title: string;
	description?: string;
	action?: ReactNode;
	className?: string;
}

export function EmptyState({
	title,
	description,
	action,
	className,
}: EmptyStateProps) {
	return (
		<div
			className={cn(
				"flex flex-col items-center justify-center gap-3 py-16 text-center",
				className
			)}
		>
			<p className="font-semibold text-lg text-secondary">{title}</p>
			{description ? (
				<p className="max-w-md text-muted-foreground text-sm">{description}</p>
			) : null}
			{action}
		</div>
	);
}
