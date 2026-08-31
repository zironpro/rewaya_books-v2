import type { ReactNode } from "react";

interface AuthFormLayoutProps {
	title: string;
	subtitle?: string;
	children: ReactNode;
	footer?: ReactNode;
}

export function AuthFormLayout({
	title,
	subtitle,
	children,
	footer,
}: AuthFormLayoutProps) {
	return (
		<div className="mx-auto w-full max-w-md space-y-6">
			<div className="space-y-1 text-center">
				<h1 className="font-display font-semibold text-2xl text-secondary">
					{title}
				</h1>
				{subtitle ? (
					<p className="text-muted-foreground text-sm">{subtitle}</p>
				) : null}
			</div>
			{children}
			{footer}
		</div>
	);
}
