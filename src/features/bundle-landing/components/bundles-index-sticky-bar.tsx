"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";

import { formatCountdownTime, useCountdown } from "../hooks/useCountdown";

interface BundlesIndexStickyBarProps {
	featuredSlug: string;
}

export function BundlesIndexStickyBar({
	featuredSlug,
}: BundlesIndexStickyBarProps) {
	const { parts, mounted } = useCountdown(featuredSlug);

	return (
		<div className="fixed inset-x-0 bottom-0 z-50 border-border border-t bg-card/95 px-4 py-3 backdrop-blur-md">
			<div className="container flex items-center justify-between gap-3">
				<div className="min-w-0">
					<p className="font-semibold text-secondary text-sm">Buy soon</p>
					<p className="text-muted-foreground text-xs tabular-nums">
						Offer ending{" "}
						{mounted ? (
							<span className="font-bold text-primary">
								{formatCountdownTime(parts)}
							</span>
						) : (
							<span>--h --m --s</span>
						)}
					</p>
				</div>
				<Button
					className="campaign-shimmer shrink-0"
					nativeButton={false}
					render={<Link href="#bundles" />}
					size="sm"
				>
					Buy the bundle now
				</Button>
			</div>
		</div>
	);
}
