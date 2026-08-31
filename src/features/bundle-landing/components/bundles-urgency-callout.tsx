"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { AlarmClock } from "@/assets/icons/alarm-clock";

import { BundlesCampaignActions } from "./bundles-campaign-actions";

interface BundlesUrgencyCalloutProps {
	featuredSlug: string;
}

export function BundlesUrgencyCallout({
	featuredSlug,
}: BundlesUrgencyCalloutProps) {
	return (
		<section className="container py-8 md:py-10">
			<Card className="campaign-shimmer relative rounded-xl bg-secondary shadow-md">
				<CardContent className="relative z-10 flex flex-col items-center gap-4 p-9 text-center md:flex-row md:justify-between md:text-left">
					<div className="relative z-20 flex flex-col items-center gap-3 md:flex-row">
						<div className="flex size-24 items-center justify-center rounded-full bg-gold text-card/90">
							<AlarmClock
								animateOnView
								animateOnViewOnce={false}
								loop
								size={42}
							/>
						</div>
						<div className="space-y-2">
							<div className="flex flex-col items-center gap-2 md:flex-row">
								<h2 className="font-bold font-display text-2xl text-secondary-foreground uppercase md:text-3xl">
									Get your bundle soon
								</h2>
								<BundlesCampaignActions
									countdownVariant="dark"
									featuredSlug={featuredSlug}
									variant="countdown-compact"
								/>
							</div>
							<p className="font-light text-base text-muted/80">
								Bundle pricing is limited while the timer runs.
							</p>
						</div>
					</div>
					<Button
						className="campaign-shimmer shrink-0"
						nativeButton={false}
						render={<Link href="#bundles" />}
						size="lg"
					>
						Buy the bundle now
					</Button>
					<div
						aria-hidden
						className="pointer-events-none absolute inset-0 opacity-[0.07]"
						style={{
							backgroundImage:
								"repeating-linear-gradient(-135deg, transparent, transparent 3px, rgba(255,255,255,0.65) 3px, rgba(255,255,255,0.65) 4px)",
						}}
					/>
				</CardContent>
			</Card>
		</section>
	);
}
