"use client";

import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const NewsletterForm = () => {
	return (
		<form
			className="flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-3"
			onSubmit={(e) => {
				e.preventDefault();
			}}
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
				/>
			</div>
			<Button type="submit" variant="default">
				Subscribe
				<ArrowRight aria-hidden className="size-3.5" />
			</Button>
		</form>
	);
};
