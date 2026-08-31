import type { ReactNode } from "react";

interface MobileBuyBarProps {
	priceLabel: ReactNode;
	actions: ReactNode;
}

export function MobileBuyBar({ priceLabel, actions }: MobileBuyBarProps) {
	return (
		<div className="fixed inset-x-0 bottom-16 z-50 border-stone-200 border-t bg-white/95 px-4 py-3 backdrop-blur-md md:hidden dark:bg-card/95">
			<div className="container flex items-center gap-4">
				<div className="min-w-0 flex-1">{priceLabel}</div>
				<div className="shrink-0">{actions}</div>
			</div>
		</div>
	);
}
