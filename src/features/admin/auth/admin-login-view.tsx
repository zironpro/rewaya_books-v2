"use client";

import * as React from "react";
import { useState } from "react";

import { useRouter } from "next/navigation";

import { AlertCircle, Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AdminLoginView() {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError(null);

		try {
			const result = await signIn("credentials", {
				redirect: false,
				email,
				password,
				isAdminAttempt: "true",
			});

			if (result?.error) {
				setError("Invalid email or password. Please try again.");
			} else {
				router.push("/admin");
				router.refresh(); // Ensure layout session is re-evaluated
			}
		} catch (err) {
			setError("An unexpected error occurred. Please try again later.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 dark:bg-slate-950">
			<Card className="w-full max-w-md border-slate-200 shadow-xl dark:border-slate-800">
				<CardHeader className="space-y-1 pb-6 text-center">
					<div className="mb-4 flex justify-center">
						<img
							alt="Rewaya Admin"
							className="h-16 w-16 rounded-xl object-contain"
							src="/logo.png"
						/>
					</div>
					<CardTitle className="font-bold text-2xl tracking-tight">
						Rewaya Portal
					</CardTitle>
					<CardDescription className="text-slate-500 dark:text-slate-400">
						Enter your credentials to access the dashboard
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form className="space-y-4" onSubmit={handleSubmit}>
						{error && (
							<Alert className="mb-4" variant="destructive">
								<AlertCircle className="h-4 w-4" />
								<AlertTitle>Error</AlertTitle>
								<AlertDescription>{error}</AlertDescription>
							</Alert>
						)}

						<div className="space-y-2">
							<Label htmlFor="email">Email Address</Label>
							<Input
								className="bg-white dark:bg-slate-900"
								disabled={isLoading}
								id="email"
								onChange={(e) => setEmail(e.target.value)}
								placeholder="admin@rewaya.com"
								required
								type="email"
								value={email}
							/>
						</div>
						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<Label htmlFor="password">Password</Label>
							</div>
							<Input
								className="bg-white dark:bg-slate-900"
								disabled={isLoading}
								id="password"
								onChange={(e) => setPassword(e.target.value)}
								required
								type="password"
								value={password}
							/>
						</div>
						<Button
							className="w-full bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
							disabled={isLoading}
							type="submit"
						>
							{isLoading ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Authenticating...
								</>
							) : (
								"Sign In"
							)}
						</Button>
					</form>
				</CardContent>
				<CardFooter className="flex justify-center border-slate-100 border-t pt-6 dark:border-slate-800">
					<p className="text-slate-500 text-sm dark:text-slate-400">
						Protected area. Authorized personnel only.
					</p>
				</CardFooter>
			</Card>
		</div>
	);
}
