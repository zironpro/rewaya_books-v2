"use client";

import { useState, useTransition } from "react";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { signIn } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { registerUser } from "./auth-actions";

export const SignupView = () => {
	const router = useRouter();

	const [fullName, setFullName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [isPending, startTransition] = useTransition();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);

		startTransition(async () => {
			const result = await registerUser(
				fullName.trim(),
				email.trim(),
				password
			);
			if (result.status === "success") {
				// Log the user in immediately after successful signup
				const signInResult = await signIn("credentials", {
					redirect: false,
					email: email.trim(),
					password,
					isAdminAttempt: "false",
				});

				if (signInResult?.error) {
					setError(
						"Account created, but couldn't sign in. Please log in manually."
					);
				} else {
					router.push("/");
					router.refresh();
				}
			} else {
				setError(result.message || "Something went wrong.");
			}
		});
	};

	return (
		<main className="grid min-h-svh grid-cols-1 lg:grid-cols-[450px_1fr] xl:grid-cols-[500px_1fr]">
			{/* Left Column - Form */}
			<div className="flex flex-col justify-center border-stone-100 border-r bg-white px-8 py-12 sm:px-16">
				<div className="mx-auto w-full max-w-[400px]">
					<Link className="mb-12 inline-block" href="/">
						<Image
							alt="Rewaya Books"
							height={55}
							src="/rewaya-logo.svg"
							width={160}
						/>
					</Link>
					<h1 className="mb-2 font-bold font-serif text-3xl text-slate-900">
						Join the Circle
					</h1>
					<p className="mb-8 text-slate-600">
						Already have an account?{" "}
						<Link
							className="font-bold text-primary transition-colors hover:underline"
							href="/login"
						>
							Log In
						</Link>
					</p>

					<Button
						className="mb-6 h-11 w-full font-medium text-base"
						onClick={() => signIn("google", { callbackUrl: "/" })}
						type="button"
						variant="outline"
					>
						<svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
							<path
								d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
								fill="#4285F4"
							/>
							<path
								d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
								fill="#34A853"
							/>
							<path
								d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
								fill="#FBBC05"
							/>
							<path
								d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
								fill="#EA4335"
							/>
							<path d="M1 1h22v22H1z" fill="none" />
						</svg>
						Google
					</Button>

					<div className="relative mb-6">
						<div className="absolute inset-0 flex items-center">
							<span className="w-full border-slate-200 border-t" />
						</div>
						<div className="relative flex justify-center text-xs uppercase">
							<span className="bg-white px-2 text-slate-500">
								Or with email and password
							</span>
						</div>
					</div>

					{error && (
						<p className="mb-4 rounded-md bg-red-50 p-3 text-red-600 text-sm">
							{error}
						</p>
					)}

					<form className="space-y-6" onSubmit={handleSubmit}>
						<div className="space-y-2">
							<label
								className="font-bold text-slate-700 text-sm"
								htmlFor="signup-name"
							>
								Full Name
							</label>
							<Input
								className="h-11"
								disabled={isPending}
								id="signup-name"
								onChange={(e) => setFullName(e.target.value)}
								placeholder="Full Name"
								required
								type="text"
								value={fullName}
							/>
						</div>

						<div className="space-y-2">
							<label
								className="font-bold text-slate-700 text-sm"
								htmlFor="signup-email"
							>
								Email Address
							</label>
							<Input
								className="h-11"
								disabled={isPending}
								id="signup-email"
								onChange={(e) => setEmail(e.target.value)}
								placeholder="email@example.com"
								required
								type="email"
								value={email}
							/>
						</div>

						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<label
									className="font-bold text-slate-700 text-sm"
									htmlFor="signup-password"
								>
									Password
								</label>
							</div>
							<Input
								className="h-11"
								disabled={isPending}
								id="signup-password"
								onChange={(e) => setPassword(e.target.value)}
								placeholder="••••••••"
								required
								type="password"
								value={password}
							/>
						</div>

						<Button
							className="h-11 w-full font-bold text-base"
							disabled={isPending}
							type="submit"
						>
							{isPending ? "Signing up..." : "Sign Up"}
						</Button>
					</form>

					<p className="mt-8 text-slate-500 text-xs leading-relaxed">
						By creating an account, you agree to our <br />
						<Link
							className="font-semibold text-slate-700 hover:underline"
							href="/terms"
						>
							Terms of Service
						</Link>{" "}
						and{" "}
						<Link
							className="font-semibold text-slate-700 hover:underline"
							href="/privacy"
						>
							Privacy Policy
						</Link>
						.
					</p>
				</div>
			</div>

			{/* Right Column - Promotional Text */}
			<div className="relative hidden flex-col justify-center overflow-hidden bg-primary p-12 text-white lg:flex xl:p-24">
				<div className="relative z-10 max-w-lg">
					<h2 className="mb-6 font-bold font-serif text-4xl leading-tight lg:text-5xl">
						Become a part of our global community.
					</h2>
					<p className="mb-8 text-lg text-stone-300 leading-relaxed">
						Sign up today to connect with fellow book lovers, gain access to
						exclusive early releases, and explore curated collections tailored
						specifically to your taste.
					</p>
					<div className="mb-12">
						<p className="font-medium text-stone-200">
							As a new member, use code{" "}
							<span className="rounded bg-white/20 px-2 py-1 font-bold text-white">
								WELCOME20
							</span>{" "}
							for 20% off your first order!
						</p>
					</div>
					<Link
						className="inline-flex items-center font-bold text-white hover:underline"
						href="/shop"
					>
						Explore the catalog <span className="ml-2">→</span>
					</Link>
				</div>
				{/* Decorative shapes */}
				<div className="pointer-events-none absolute -right-24 -bottom-24 h-[500px] w-[500px] rounded-full bg-[#E8C288]/10 mix-blend-screen blur-3xl" />
				<div className="pointer-events-none absolute top-1/4 -right-12 h-64 w-64 rounded-full bg-[#78938A]/20 mix-blend-screen blur-3xl" />
			</div>
		</main>
	);
};
