"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface VerificationFormProps {
	onSubmit: (code: string) => Promise<void>;
	isPending?: boolean;
}

export function VerificationForm({
	onSubmit,
	isPending = false,
}: VerificationFormProps) {
	const [code, setCode] = useState("");

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const trimmed = code.trim();
		if (!trimmed || isPending) return;
		await onSubmit(trimmed);
	};

	return (
		<form
			className="space-y-4 rounded-xl border border-stone-100 bg-stone-50 p-4"
			onSubmit={handleSubmit}
		>
			<p className="font-bold text-secondary text-sm">
				Enter the verification code sent to your email.
			</p>
			<Input
				autoComplete="one-time-code"
				onChange={(e) => setCode(e.target.value)}
				placeholder="123456"
				required
				type="text"
				value={code}
			/>
			<Button
				className="w-full"
				disabled={isPending || !code.trim()}
				type="submit"
			>
				{isPending ? "Verifying…" : "Verify email"}
			</Button>
		</form>
	);
}
