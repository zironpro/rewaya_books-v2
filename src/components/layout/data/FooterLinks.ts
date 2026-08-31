export type FooterNavLink = {
	label: string;
	href: string;
};

export type FooterLinkColumn = {
	id: string;
	ariaLabel: string;
	title: string;
	links: FooterNavLink[];
};

export const FOOTER_SHOP_LINKS: FooterNavLink[] = [
	{ label: "New Arrivals", href: "/shop" },
	{ label: "Bestsellers", href: "/shop" },
	{ label: "Fiction", href: "/shop" },
	{ label: "Non-Fiction", href: "/shop" },
	{ label: "Children's", href: "/shop" },
	{ label: "Gift Cards", href: "/shop" },
	{ label: "Pre-Orders", href: "/shop" },
	{ label: "Sale", href: "/shop" },
];

export const FOOTER_VIEW_ALL_BUNDLES: FooterNavLink = {
	label: "View all bundles",
	href: "/bundles",
};

export const FOOTER_DISCOVER_LINKS: FooterNavLink[] = [
	{ label: "Book Club", href: "/about" },
	{ label: "Reading Guides", href: "/about" },
	{ label: "Author Interviews", href: "/about" },
	{ label: "Blog", href: "/about" },
	{ label: "Curated Sets", href: "/about" },
	{ label: "Recommended Lists", href: "/shop" },
	{ label: "Events", href: "/contact" },
];

export const FOOTER_HELP_LINKS: FooterNavLink[] = [
	{ label: "My Account", href: "/profile" },
	{ label: "Track Order", href: "/profile" },
	{ label: "Returns & Exchanges", href: "/return" },
	{ label: "Shipping Info", href: "/terms" },
	{ label: "FAQs", href: "/contact" },
	{ label: "Contact Us", href: "/contact" },
	{ label: "Accessibility", href: "/accessibility" },
];

/** Discover column is gated by `featureFlags.footerDiscoverSection` (phase 2). */
export const FOOTER_LINK_COLUMNS: FooterLinkColumn[] = [
	{
		id: "shop",
		ariaLabel: "Shop",
		title: "Shop",
		links: FOOTER_SHOP_LINKS,
	},
	{
		id: "discover",
		ariaLabel: "Discover",
		title: "Discover",
		links: FOOTER_DISCOVER_LINKS,
	},
	{
		id: "help",
		ariaLabel: "Help",
		title: "Help",
		links: FOOTER_HELP_LINKS,
	},
];

export function getVisibleFooterLinkColumns(
	showDiscover: boolean
): FooterLinkColumn[] {
	return FOOTER_LINK_COLUMNS.filter(
		(column) => column.id !== "discover" || showDiscover
	);
}

export const FOOTER_LEGAL_LINKS: FooterNavLink[] = [
	{ label: "Terms", href: "/terms" },
	{ label: "Privacy", href: "/privacy" },
	{ label: "Cookie Policy", href: "/cookies" },
	{ label: "Accessibility", href: "/accessibility" },
];

export const FOOTER_STORE = {
	addressLines: [
		"Ajman Jurf 2, Shahba Complex Block A Shop No. 6,",
		"Opposite Habitat School",
		"Ajman, United Arab Emirates",
	],
	hours: "Mon-Sat 07:30AM-5:30PM · Fri 07:30AM-12:00PM, 3:00PM-06:00Pm",
	phone: "+971 58 526 3323",
	tel: "+971 55 332 6919",
	accountsEmail: "accounts@alrewaya.com",
	supportEmail: "basim@alrewaya.com",
} as const;
