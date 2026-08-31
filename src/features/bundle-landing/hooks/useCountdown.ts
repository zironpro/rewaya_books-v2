"use client";

import { useEffect, useState } from "react";

const TWENTY_FOUR_H_MS = 24 * 60 * 60 * 1000;

export interface CountdownParts {
	h: string;
	m: string;
	s: string;
}

/** Compact display with unit labels, e.g. "23h 45m 30s". */
export function formatCountdownTime({ h, m, s }: CountdownParts) {
	return `${h}h ${m}m ${s}s`;
}

function storageKey(slug: string) {
	return `bundle-offer-end-${slug}`;
}

function clampParts(ms: number): CountdownParts {
	const sec = Math.max(0, Math.floor(ms / 1000));
	const h = Math.floor(sec / 3600);
	const m = Math.floor((sec % 3600) / 60);
	const s = sec % 60;
	return {
		h: h.toString().padStart(2, "0"),
		m: m.toString().padStart(2, "0"),
		s: s.toString().padStart(2, "0"),
	};
}

/**
 * Session-scoped 24h countdown per slug. SSR shows neutral placeholder;
 * client hydrates from sessionStorage without mismatch (placeholder until mounted).
 */
export function useCountdown(slug: string) {
	const [mounted, setMounted] = useState(false);
	const [expired, setExpired] = useState(false);
	const [parts, setParts] = useState<CountdownParts>({
		h: "--",
		m: "--",
		s: "--",
	});

	useEffect(() => {
		setMounted(true);
		const key = storageKey(slug);
		let end = Number.NaN;
		try {
			const raw = sessionStorage.getItem(key);
			end = raw ? Number.parseInt(raw, 10) : Number.NaN;
			if (!Number.isFinite(end) || end <= Date.now()) {
				end = Date.now() + TWENTY_FOUR_H_MS;
				sessionStorage.setItem(key, String(end));
			}
		} catch {
			end = Date.now() + TWENTY_FOUR_H_MS;
		}

		const tick = () => {
			const left = end - Date.now();
			if (left <= 0) {
				setExpired(true);
				setParts({ h: "00", m: "00", s: "00" });
				return;
			}
			setExpired(false);
			setParts(clampParts(left));
		};

		tick();
		const id = window.setInterval(tick, 1000);
		return () => window.clearInterval(id);
	}, [slug]);

	return {
		parts: mounted ? parts : { h: "--", m: "--", s: "--" },
		expired: mounted && expired,
		mounted,
	};
}
