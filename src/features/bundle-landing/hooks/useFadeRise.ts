"use client";

import { useEffect, useRef, useState } from "react";

/**
 * IntersectionObserver hook: adds `is-visible` to the element for CSS transitions.
 */
export function useFadeRise<T extends HTMLElement = HTMLDivElement>(options?: {
	rootMargin?: string;
	threshold?: number;
}) {
	const ref = useRef<T | null>(null);
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;

		const obs = new IntersectionObserver(
			(entries) => {
				for (const e of entries) {
					if (e.isIntersecting) {
						setVisible(true);
						obs.unobserve(e.target);
					}
				}
			},
			{
				rootMargin: options?.rootMargin ?? "0px 0px -8% 0px",
				threshold: options?.threshold ?? 0.12,
			}
		);

		obs.observe(el);
		return () => obs.disconnect();
	}, [options?.rootMargin, options?.threshold]);

	return { ref, visible };
}
