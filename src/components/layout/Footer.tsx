import Link from "next/link";

import { LeafIcon, RotateCcwIcon, ShieldCheckIcon } from "lucide-react";

import { Separator } from "@/components/ui/separator";

import { Logo } from "@/assets/logo";

import { SOCIAL_LINKS } from "@/constants/site-config";
import { featureFlags } from "@/lib/feature-flags";
import { cn } from "@/lib/utils";

import { NewsletterForm } from "./components/newsletter-form";
import {
	FOOTER_LEGAL_LINKS,
	FOOTER_STORE,
	FOOTER_VIEW_ALL_BUNDLES,
	type FooterNavLink,
	getVisibleFooterLinkColumns,
} from "./data/FooterLinks";

const linkClass =
	"block py-0.5 font-sans text-muted-foreground text-sm transition-all duration-150 hover:text-secondary-foreground hover:translate-x-0.5";

const columnTitleClass =
	"mb-5 font-heading font-semibold text-accent text-xs uppercase tracking-widest";

function FooterNavLinks({ links }: { links: FooterNavLink[] }) {
	return (
		<div className="flex flex-col gap-1">
			{links.map((item) => (
				<Link className={linkClass} href={item.href} key={item.label}>
					{item.label}
				</Link>
			))}
		</div>
	);
}

export async function Footer() {
	const year = new Date().getFullYear();

	const footerLinkColumns = getVisibleFooterLinkColumns(
		featureFlags.footerDiscoverSection
	);

	const bundleDealLinks: FooterNavLink[] = [FOOTER_VIEW_ALL_BUNDLES];

	return (
		<footer className="bg-tertiary text-tertiary-foreground" role="contentinfo">
			<section
				aria-labelledby="footer-newsletter-heading"
				className="border-border/20 border-b bg-secondary/20 py-14"
			>
				<div className="container mx-auto">
					<div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
						<div>
							<h2
								className="font-display text-3xl text-secondary-foreground"
								id="footer-newsletter-heading"
							>
								A new chapter begins in your inbox.
							</h2>
							<p className="mt-2 max-w-md font-sans text-muted-foreground text-sm italic">
								New arrivals, reading guides & exclusive offers weekly.
							</p>
						</div>
						<div className="w-full max-w-md shrink-0 lg:max-w-sm">
							<NewsletterForm />
						</div>
					</div>
				</div>
			</section>

			<div className="container mx-auto py-16">
				<div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-12">
					<div className="sm:col-span-2 lg:col-span-3">
						<Link href="/" title="Rewaya Books">
							<Logo />
						</Link>
						<div aria-hidden className="mt-3 mb-4 h-0.5 w-8 bg-accent" />
						<p className="font-display text-lg text-muted italic">
							Curated reads for curious minds.
						</p>
						<p className="mt-4 text-balance font-sans text-muted-foreground text-sm leading-relaxed">
							We bring together Islamic scholarship, world literature, and books
							for every stage of life chosen with care for readers everywhere.
						</p>
						<div className="mt-6 flex flex-wrap gap-3">
							{SOCIAL_LINKS.map(({ href, label, Icon }) => (
								<Link
									aria-label={label}
									className={cn(
										"inline-flex size-9 items-center justify-center rounded-sm border border-muted-foreground text-muted-foreground transition-colors duration-200",
										"hover:bg-accent hover:text-accent-foreground"
									)}
									href={href}
									key={label}
									rel="noopener noreferrer"
									target="_blank"
								>
									<Icon size={18} />
								</Link>
							))}
						</div>
					</div>

					<div className="grid gap-10 sm:col-span-2 sm:grid-cols-2 lg:col-span-6 lg:grid-cols-3 lg:gap-x-8">
						{footerLinkColumns.map((column) => (
							<nav aria-label={column.ariaLabel} key={column.id}>
								<p className={columnTitleClass}>{column.title}</p>
								<FooterNavLinks links={column.links} />
							</nav>
						))}
						{bundleDealLinks.length > 1 ? (
							<nav aria-label="Bundle deals">
								<p className={columnTitleClass}>Bundle Deals</p>
								<FooterNavLinks links={bundleDealLinks} />
							</nav>
						) : null}
					</div>

					<div className="sm:col-span-3">
						<nav aria-label="Visit us">
							<p className={columnTitleClass}>Visit Us</p>
							<address className="not-italic">
								{FOOTER_STORE.addressLines.map((line) => (
									<p
										className="text-balance font-sans text-muted-foreground text-sm"
										key={line}
									>
										{line}
									</p>
								))}
								<p className="mt-3 font-sans text-muted-foreground text-sm">
									{FOOTER_STORE.hours}
								</p>
								<p className="mt-3 font-sans text-muted-foreground text-sm">
									<Link
										className="underline-offset-2 transition-colors hover:text-secondary-foreground hover:underline"
										href={`tel:${FOOTER_STORE.phone}`}
									>
										{FOOTER_STORE.phone}
									</Link>
								</p>
								<p className="mt-3 font-sans text-muted-foreground text-sm">
									<Link
										className="underline-offset-2 transition-colors hover:text-secondary-foreground hover:underline"
										href={`tel:${FOOTER_STORE.tel}`}
									>
										{FOOTER_STORE.tel}
									</Link>
								</p>
								<p className="mt-3 font-sans text-muted-foreground text-sm">
									<Link
										className="underline-offset-2 transition-colors hover:text-secondary-foreground hover:underline"
										href={`mailto:${FOOTER_STORE.accountsEmail}`}
									>
										{FOOTER_STORE.accountsEmail}
									</Link>
								</p>
								<p className="mt-3 font-sans text-muted-foreground text-sm">
									<Link
										className="underline-offset-2 transition-colors hover:text-secondary-foreground hover:underline"
										href={`mailto:${FOOTER_STORE.supportEmail}`}
									>
										{FOOTER_STORE.supportEmail}
									</Link>
								</p>
							</address>
						</nav>
					</div>
				</div>
			</div>

			<Separator className="opacity-20" />

			<div className="container mx-auto py-6">
				<div className="flex flex-col items-center gap-6 lg:flex-row lg:justify-between">
					<p className="font-sans text-muted-foreground text-xs">
						© {year} Rewaya Books. All rights reserved.
					</p>
					<div className="flex flex-col items-center gap-4 md:flex-row">
						<p className="flex items-center gap-1.5 font-sans text-muted-foreground text-xs">
							<ShieldCheckIcon
								aria-hidden
								className="size-3.5 shrink-0 text-accent"
							/>
							Secure checkout
						</p>
						<p className="flex items-center gap-1.5 font-sans text-muted-foreground text-xs">
							<RotateCcwIcon
								aria-hidden
								className="size-3.5 shrink-0 text-accent"
							/>
							Free returns
						</p>
						<p className="flex items-center gap-1.5 font-sans text-muted-foreground text-xs">
							<LeafIcon aria-hidden className="size-3.5 shrink-0 text-accent" />
							Carbon neutral shipping
						</p>
					</div>
					<nav
						aria-label="Legal"
						className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 font-sans text-muted-foreground text-xs"
					>
						{FOOTER_LEGAL_LINKS.map((item, index) => (
							<span className="inline-flex items-center gap-3" key={item.label}>
								{index > 0 ? (
									<span aria-hidden className="font-bold text-muted-foreground">
										·
									</span>
								) : null}
								<Link
									className="transition-colors hover:text-secondary-foreground"
									href={item.href}
								>
									{item.label}
								</Link>
							</span>
						))}
					</nav>
				</div>
			</div>
		</footer>
	);
}
