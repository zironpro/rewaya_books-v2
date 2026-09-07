"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

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
		if (popup.expiresAt && new Date(Number(popup.expiresAt)) < new Date()) return;

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
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle className="text-2xl font-bold">{popup.title}</DialogTitle>
					{popup.description && (
						<DialogDescription className="text-base mt-2">
							{popup.description}
						</DialogDescription>
					)}
				</DialogHeader>
				
				{popup.countdownText && (
					<div className="mt-3 flex items-center justify-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 px-4 py-1.5 text-amber-800 text-sm font-semibold dark:border-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
						{popup.countdownText}
					</div>
				)}

				{popup.image && (
					<div className="mt-4 flex justify-center">
						<img src={popup.image} alt={popup.title} className="rounded-md max-h-64 object-contain" />
					</div>
				)}
				
				{popup.ctaLabel && popup.ctaHref && (
					<div className="mt-6 flex justify-center">
						<Link href={popup.ctaHref} onClick={() => setOpen(false)}>
							<Button size="lg" className="px-8 font-semibold">
								{popup.ctaLabel}
							</Button>
						</Link>
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
}
