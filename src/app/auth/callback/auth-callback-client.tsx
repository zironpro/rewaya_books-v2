"use client";

import { useEffect, useRef, useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

export function AuthCallbackClient({
	oauthDataFromServer: _oauthDataFromServer,
}: {
	oauthDataFromServer: any | null;
}) {
	const _router = useRouter();
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [redirectTo, _setRedirectTo] = useState("/");
	const authPromise = useRef<Promise<void> | null>(null);

	useEffect(() => {
		async function verifyLogin() {
			window.location.href = "/";
		}

		if (!authPromise.current) {
			authPromise.current = verifyLogin();
		}

		authPromise.current.catch((e) => {
			setErrorMessage(
				e instanceof Error ? e.message : "Could not complete sign-in."
			);
		});
	}, []);

	return (
		<main className="flex min-h-svh items-center justify-center px-4">
			<div className="w-full max-w-md rounded-md border border-stone-100 bg-white p-8 text-center">
				{errorMessage ? (
					<>
						<p className="mb-6 text-red-600 text-sm">{errorMessage}</p>
						<Link
							className="font-bold text-primary text-sm hover:underline"
							href={redirectTo.startsWith("/login") ? redirectTo : "/login"}
						>
							Back to login
						</Link>
					</>
				) : (
					<p className="font-bold text-secondary text-sm">
						Completing sign-in…
					</p>
				)}
			</div>
		</main>
	);
}
