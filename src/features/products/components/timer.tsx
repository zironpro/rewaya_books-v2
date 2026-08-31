"use client";

import { useEffect, useState } from "react";

import { Timer } from "lucide-react";

export const CountdownTimer = () => {
	const [timeLeft, setTimeLeft] = useState({
		hours: 0,
		minutes: 0,
		seconds: 0,
	});

	useEffect(() => {
		const calculateTimeLeft = () => {
			const now = new Date();
			const endOfDay = new Date();
			endOfDay.setHours(23, 59, 59, 999);

			const difference = endOfDay.getTime() - now.getTime();

			if (difference > 0) {
				setTimeLeft({
					hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
					minutes: Math.floor((difference / 1000 / 60) % 60),
					seconds: Math.floor((difference / 1000) % 60),
				});
			}
		};

		calculateTimeLeft();
		const timer = setInterval(calculateTimeLeft, 1000);
		return () => clearInterval(timer);
	}, []);

	const format = (n: number) => n.toString().padStart(2, "0");

	return (
		<div className="flex items-center gap-2 rounded-sm border border-mauve-200 bg-card px-2.5 py-1.5">
			<Timer className="animate-pulse text-primary" size={14} />
			<div className="flex items-center gap-1 font-black font-mono text-sm">
				<span className="text-secondary">{format(timeLeft.hours)}</span>
				<span className="text-muted-foreground/50">:</span>
				<span className="text-secondary">{format(timeLeft.minutes)}</span>
				<span className="text-muted-foreground/50">:</span>
				<span className="text-secondary">{format(timeLeft.seconds)}</span>
			</div>
		</div>
	);
};
