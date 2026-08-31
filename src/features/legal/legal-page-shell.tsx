import type { ReactNode } from "react";

import Breadcrumbs from "@/components/layout/Breadcrumbs";

type LegalPageShellProps = {
	breadcrumbLabel: string;
	title: ReactNode;
	children: ReactNode;
	lastUpdated?: string;
	footerNote?: ReactNode;
};

export function LegalPageShell({
	breadcrumbLabel,
	title,
	children,
	lastUpdated = "May 23, 2026",
	footerNote,
}: LegalPageShellProps) {
	return (
		<main className="grow pt-6 pb-28 md:pb-16">
			<div className="container">
				<Breadcrumbs className="mb-6" items={[{ label: breadcrumbLabel }]} />

				<div className="mx-auto max-w-3xl">
					<span className="mb-6 block font-semibold text-muted-foreground text-sm">
						Legal Information
					</span>
					<h1 className="mb-12 font-black font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
						{title}
					</h1>

					<div className="prose prose-stone max-w-none space-y-12">
						{children}

						<div className="mt-20 border-stone-100 border-t pt-12 text-stone-400">
							<p>Last updated: {lastUpdated}</p>
							{footerNote ? <div className="mt-2">{footerNote}</div> : null}
						</div>
					</div>
				</div>
			</div>
		</main>
	);
}

export function LegalSection({
	title,
	children,
}: {
	title: string;
	children: ReactNode;
}) {
	return (
		<section>
			<h2 className="mb-6 font-serif text-3xl text-secondary">{title}</h2>
			{children}
		</section>
	);
}

export function LegalParagraph({ children }: { children: ReactNode }) {
	return <p className="text-lg text-stone-500 leading-relaxed">{children}</p>;
}
