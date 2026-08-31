import { Suspense } from "react";

import { PageLoading } from "@/components/feedback/page-loading";

import { LoginView } from "@/features/auth/login-view";

export default function LoginPage() {
	return (
		<Suspense
			fallback={
				<main className="flex min-h-svh grow px-4">
					<PageLoading message="Loading sign in…" />
				</main>
			}
		>
			<LoginView />
		</Suspense>
	);
}
