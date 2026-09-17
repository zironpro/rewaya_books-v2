"use client";

import { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { toastManager } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const NewsletterForm = () => {
	const [email, setEmail] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!email) return;

		setLoading(true);
		try {
			const res = await fetch("/api/subscribe", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email }),
			});
			const data = await res.json();

			if (!res.ok) {
				throw new Error(data.error || "Failed to subscribe");
			}

			toastManager.add({
				title: "Subscribed!",
				description: "You've successfully subscribed to our newsletter.",
				type: "success",
			});
			setEmail("");
		} catch (error: any) {
			toastManager.add({
				title: "Subscription Failed",
				description: error.message,
				type: "error",
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<form
			className="flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-3"
			onSubmit={handleSubmit}
		>
			<div className="min-w-0 flex-1">
				<label className="sr-only" htmlFor="newsletter-email">
					Email address
				</label>
				<Input
					autoComplete="email"
					id="newsletter-email"
					name="email"
					placeholder="you@example.com"
					required
					type="email"
					onChange={(e) => setEmail(e.target.value)}
					value={email}
					disabled={loading}
				/>
			</div>
			<Button type="submit" variant="default" disabled={loading}>
				{loading ? "Subscribing..." : "Subscribe"}
				{loading ? (
					<Loader2 className="size-3.5 animate-spin" />
				) : (
					<ArrowRight aria-hidden className="size-3.5" />
				)}
			</Button>
		</form>
	);
};
