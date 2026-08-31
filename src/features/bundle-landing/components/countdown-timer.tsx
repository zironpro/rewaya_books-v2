"use client";

import Link from "next/link";

import { cn } from "@/lib/utils";

import { formatCountdownTime, useCountdown } from "../hooks/useCountdown";

interface CountdownTimerProps {
	slug: string;
	className?: string;
	/** Default: light card on linen; `dark` for CTA footer */
	variant?: "default" | "dark";
	/** Text before digits (e.g. "Offer may end in") */
	label?: string;
	/** Text after digits; default "left at this price" when label unset */
	suffix?: string;
	size?: "default" | "compact";
}

export function CountdownTimer({
	slug,
	className,
	variant = "default",
	label,
	suffix,
	size = "default",
}: CountdownTimerProps) {
	const suffixText = suffix ?? (label ? undefined : "left at this price");
	const { parts, expired } = useCountdown(slug);

	const box =
		variant === "dark"
			? "border-gold/25 bg-black/25 text-gold"
			: "border-gold bg-white text-primary";

	const compact = size === "compact";

	return (
		<div
			className={cn(
				"mx-auto w-fit rounded-sm border",
				compact ? "px-1.5 py-0.5 text-xs" : "px-2.5 py-1 text-sm",
				box,
				className
			)}
		>
			{expired ? (
				<p className="text-center text-xs leading-relaxed">
					This launch window has ended.{" "}
					<Link
						className="font-medium text-accent underline-offset-2 hover:underline"
						href="/bundles"
					>
						Browse all bundles
					</Link>
				</p>
			) : (
				<div className="flex flex-wrap items-center justify-center gap-1 tabular-nums sm:gap-1.5">
					{label ? (
						<span
							className={cn("opacity-90", compact ? "text-[10px]" : "text-xs")}
						>
							{label}
						</span>
					) : null}
					<span
						className={cn(
							"rounded font-bold",
							compact ? "px-1 py-0.5" : "px-1.5 py-0.5",
							box
						)}
					>
						{formatCountdownTime(parts)}
					</span>

					{suffixText ? (
						<span
							className={cn("opacity-90", compact ? "text-[10px]" : "text-xs")}
						>
							{suffixText}
						</span>
					) : null}
				</div>
			)}
		</div>
	);
}
