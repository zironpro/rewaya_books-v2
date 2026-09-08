"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

interface PopupData {
	title: string;
	description?: string | null;
	image?: string | null;
	ctaLabel?: string | null;
	ctaHref?: string | null;
	delaySeconds?: number | null;
	expiresAt?: string | null;
	countdownText?: string | null;
}

export function GlobalPopup({ popup }: { popup: PopupData }) {
	const [open, setOpen] = useState(false);

	useEffect(() => {
		if (!popup) return;

		// Don't show if the popup has expired
		if (popup.expiresAt && new Date(Number(popup.expiresAt)) < new Date())
			return;

		const hasSeen = sessionStorage.getItem("hasSeenPopup");
		if (!hasSeen) {
			const delay = (popup.delaySeconds || 5) * 1000;
			const timer = setTimeout(() => {
				setOpen(true);
				sessionStorage.setItem("hasSeenPopup", "true");
			}, delay);
			return () => clearTimeout(timer);
		}
	}, [popup]);

	return (
		<Dialog onOpenChange={setOpen} open={open}>
			<DialogContent className="overflow-hidden border-2 border-[#1A1815] bg-white p-0 sm:max-w-md dark:border-white/15 dark:bg-[#100F0D]">
				{/* corner registration marks */}
				<span className="pointer-events-none absolute top-2.5 left-2.5 h-3 w-3 border-[#1A1815] border-t-2 border-l-2 dark:border-white/40" />
				<span className="pointer-events-none absolute top-2.5 right-2.5 h-3 w-3 border-[#1A1815] border-t-2 border-r-2 dark:border-white/40" />
				<span className="pointer-events-none absolute bottom-2.5 left-2.5 h-3 w-3 border-[#1A1815] border-b-2 border-l-2 dark:border-white/40" />
				<span className="pointer-events-none absolute right-2.5 bottom-2.5 h-3 w-3 border-[#1A1815] border-r-2 border-b-2 dark:border-white/40" />

				{popup.image && (
					<div className="aspect-video w-full overflow-hidden">
						<img
							alt={popup.title}
							className="h-full w-full object-cover"
							src={popup.image}
						/>
					</div>
				)}

				<div
					className={`border-[#1A1815]/15 dark:border-white/10 ${popup.image ? "border-t border-dashed" : ""}`}
				/>

				<div className="px-7 py-6">
					<DialogHeader className="items-start text-left">
						<DialogTitle className="font-bold text-2xl text-[#1A1815] leading-tight tracking-tight dark:text-[#EDEAE3]">
							{popup.title}
						</DialogTitle>
						{popup.description && (
							<DialogDescription className="mt-1.5 text-[#1A1815]/70 text-base leading-snug dark:text-[#EDEAE3]/65">
								{popup.description}
							</DialogDescription>
						)}
					</DialogHeader>

					{popup.countdownText && (
						<div className="mt-4 inline-flex items-center gap-2 border border-[#B0332B] px-2.5 py-1 font-mono text-[#B0332B] text-xs tracking-tight">
							<span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#B0332B]" />
							{popup.countdownText}
						</div>
					)}

					{popup.ctaLabel && popup.ctaHref && (
						<div className="mt-6">
							<Link href={popup.ctaHref} onClick={() => setOpen(false)}>
								<Button
									className="w-full rounded-sm bg-[#1A1815] font-semibold text-white hover:bg-[#1A1815]/90 dark:bg-[#EDEAE3] dark:text-[#100F0D] dark:hover:bg-[#EDEAE3]/90"
									size="lg"
								>
									{popup.ctaLabel}
								</Button>
							</Link>
						</div>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}
