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
}

export function GlobalPopup({ popup }: { popup: PopupData }) {
	const [open, setOpen] = useState(false);

	useEffect(() => {
		if (!popup) return;
		
		const hasSeen = localStorage.getItem("hasSeenPopup");
		if (!hasSeen) {
			const delay = (popup.delaySeconds || 5) * 1000;
			const timer = setTimeout(() => {
				setOpen(true);
				localStorage.setItem("hasSeenPopup", "true");
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
