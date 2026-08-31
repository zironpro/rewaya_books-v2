import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface PurchasePanelShellProps {
	children: ReactNode;
	className?: string;
}

/** Sticky buy-box card used on product and bundle PDPs. */
export function PurchasePanelShell({
	children,
	className,
}: PurchasePanelShellProps) {
	return (
		<aside className={cn(className)}>
			<div className="rounded-xl border border-border bg-card p-5 shadow-sm/2 lg:sticky lg:top-28">
				{children}
			</div>
		</aside>
	);
}
