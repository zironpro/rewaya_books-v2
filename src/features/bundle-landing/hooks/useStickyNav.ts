"use client";

import { useEffect, useState } from "react";

export const BUNDLE_HERO_ID = "bundle-hero";

/**
 * When the hero leaves the viewport, sticky chrome (nav + mobile bar) can appear.
 */
export function useStickyNav() {
	const [pastHero, setPastHero] = useState(false);

	useEffect(() => {
		const hero = document.getElementById(BUNDLE_HERO_ID);
		if (!hero) return;

		const obs = new IntersectionObserver(
			([entry]) => {
				setPastHero(!entry.isIntersecting);
			},
			{ rootMargin: "-48px 0px 0px 0px", threshold: 0 }
		);

		obs.observe(hero);
		return () => obs.disconnect();
	}, []);

	return { pastHero };
}
