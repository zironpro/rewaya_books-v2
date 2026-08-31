export interface DescriptionLine {
	name?: { translated?: string };
	plainText?: { translated?: string };
	colorInfo?: { translated?: string; code?: string };
}

export interface Availability {
	status?: string;
	quantityAvailable?: number;
}

export interface LineItem {
	_id?: string | null;
	productName?: { translated?: string };
	quantity?: number;
	price?: { amount?: string; formattedConvertedAmount?: string };
	fullPrice?: { formattedConvertedAmount?: string };
	lineItemPrice?: { amount?: string; formattedConvertedAmount?: string };
	image?: string;
	catalogReference?: { catalogItemId?: string; appId?: string };
	descriptionLines?: DescriptionLine[];
	availability?: Availability;
	url?: string | { relativePath?: string; url?: string };
	/** Set server-side when line matches a BookBundles row. */
	isBundle?: boolean;
	bundleSlug?: string;
	/** Rewaya route — `/bundles/{slug}` or `/product/{slug}`. */
	href?: string;
}

export interface CartSummary {
	subtotal?: string;
	discount?: string;
	total?: string;
	shipping?: string;
	discountNames: string[];
}

export const CART_CACHE_KEY = "cart:last-snapshot";

export type CartSnapshot = { lineItems: LineItem[]; summary: CartSummary };

export function formatDescriptionLine(line: DescriptionLine): string {
	const title = line.name?.translated;
	const value = line.plainText?.translated ?? line.colorInfo?.translated;
	if (title && value) return `${title}: ${value}`;
	return title ?? value ?? "";
}

/** First non-empty description line for subtitle (author, options, etc.) */
export function firstDescriptionSubtitle(item: LineItem): string {
	for (const line of item.descriptionLines ?? []) {
		const text = formatDescriptionLine(line);
		if (text) return text;
	}
	return "";
}

export function resolveCartImage(
	image: string | undefined,
	width = 200,
	height = 280
): string | undefined {
	if (!image) return undefined;
	// Process remote or local images if needed
	return image;
}

export function isItemUnavailable(item: LineItem): boolean {
	const status = item.availability?.status;
	return status === "NOT_AVAILABLE" || status === "NOT_FOUND";
}

/** Rewaya product routes use `/product/<slug>`. */
export function resolveProductHref(item: LineItem): string | undefined {
	const url = item.url;
	if (!url) return undefined;
	const str = typeof url === "string" ? url : (url.relativePath ?? url.url);
	if (!str) return undefined;
	const match = str.match(/\/product-page\/([^/?#]+)/);
	return match ? `/product/${match[1]}` : undefined;
}

/** Bundle or book link for cart line title/image. */
export function resolveLineItemHref(item: LineItem): string | undefined {
	if (item.href) return item.href;
	if (item.isBundle && item.bundleSlug) {
		return `/bundles/${item.bundleSlug}`;
	}
	return resolveProductHref(item);
}

export function readCartSnapshot(): CartSnapshot | null {
	if (typeof window === "undefined") return null;
	try {
		const raw = window.sessionStorage.getItem(CART_CACHE_KEY);
		if (!raw) return null;
		const parsed = JSON.parse(raw);
		if (!Array.isArray(parsed?.lineItems)) return null;
		
		// Repair malformed items from older sessions
		const repairedItems = parsed.lineItems.map((item: any) => {
			const priceNum = typeof item.price === "object" ? Number(item.price?.amount || 0) : Number(item.price || 0);
			const qty = item.quantity || 1;
			
			return {
				...item,
				price: typeof item.price === "object" && item.price?.formattedConvertedAmount ? item.price : {
					amount: priceNum.toString(),
					formattedConvertedAmount: `AED ${priceNum.toFixed(2)}`
				},
				lineItemPrice: typeof item.lineItemPrice === "object" && item.lineItemPrice?.formattedConvertedAmount ? item.lineItemPrice : {
					amount: (priceNum * qty).toString(),
					formattedConvertedAmount: `AED ${(priceNum * qty).toFixed(2)}`
				},
				productName: item.productName || { translated: item.title || "Product" }
			};
		});

		// Repair summary if missing
		let summary = parsed.summary || { discountNames: [] };
		if (!summary.subtotal || summary.subtotal === "0") {
			const subtotal = repairedItems.reduce((acc: number, item: any) => acc + (Number(item.price.amount) * (item.quantity || 1)), 0);
			summary = {
				...summary,
				subtotal: `AED ${subtotal.toFixed(2)}`,
				total: `AED ${subtotal.toFixed(2)}`
			};
		}

		return { lineItems: repairedItems, summary } as CartSnapshot;
	} catch {
		return null;
	}
}

export function writeCartSnapshot(snapshot: CartSnapshot): void {
	if (typeof window === "undefined") return;
	try {
		window.sessionStorage.setItem(CART_CACHE_KEY, JSON.stringify(snapshot));
	} catch {
		/* storage full / denied */
	}
}

export function countLineItems(items: LineItem[]): number {
	return items.reduce((sum, item) => sum + (item.quantity ?? 0), 0);
}

function parseCurrencyAmount(value?: string): number | undefined {
	if (!value) return undefined;
	const normalized = value.replace(/[^0-9.,-]+/g, "").replace(/,/g, "");
	const parsed = Number(normalized);
	return Number.isFinite(parsed) ? parsed : undefined;
}

function formatCurrencyAmount(amount: number, currency = "AED") {
	try {
		return new Intl.NumberFormat(undefined, {
			style: "currency",
			currency,
		}).format(amount);
	} catch {
		return amount.toFixed(2);
	}
}

export function extractSummary(
	cart:
		| {
				priceSummary?: {
					subtotal?: { formattedConvertedAmount?: string };
					discount?: { formattedConvertedAmount?: string };
					total?: { formattedConvertedAmount?: string };
					shipping?: { amount?: string; formattedConvertedAmount?: string };
				};
				appliedDiscounts?: Array<{
					discountName?: string;
					coupon?: { name?: string };
					merchantDiscount?: { discountName?: string };
				}>;
				lineItems?: Array<{ lineItemPrice?: { amount?: string } }>;
				currency?: string;
		  }
		| undefined
): CartSummary {
	const ps = cart?.priceSummary;
	let subtotal = ps?.subtotal?.formattedConvertedAmount;
	const discount = ps?.discount?.formattedConvertedAmount;
	const total = ps?.total?.formattedConvertedAmount;

	if (!subtotal && cart?.lineItems?.length) {
		const sum = cart.lineItems.reduce((acc, item) => {
			const amt = item.lineItemPrice?.amount;
			return amt ? acc + Number(amt) : acc;
		}, 0);
		if (sum > 0) {
			subtotal = formatCurrencyAmount(sum, cart.currency ?? "AED");
		}
	}

	const parsedSubtotal = parseCurrencyAmount(subtotal);
	const parsedDiscount = parseCurrencyAmount(discount);
	const parsedTotal = parseCurrencyAmount(total);

	let shipping: string | undefined;
	const cartShipping = ps?.shipping;

	if (cartShipping) {
		const amt = Number(cartShipping.amount || "0");
		shipping = amt === 0 ? "Free" : cartShipping.formattedConvertedAmount;
	} else if (
		typeof parsedSubtotal === "number" &&
		typeof parsedTotal === "number"
	) {
		const shippingAmount = parsedTotal - parsedSubtotal + (parsedDiscount ?? 0);
		if (!Number.isNaN(shippingAmount)) {
			shipping =
				shippingAmount === 0
					? "Free"
					: formatCurrencyAmount(shippingAmount, cart?.currency ?? "AED");
		}
	}

	const discountNames = (cart?.appliedDiscounts ?? [])
		.map(
			(d) =>
				d?.discountName || d?.coupon?.name || d?.merchantDiscount?.discountName
		)
		.filter((name): name is string => Boolean(name));

	return { subtotal, discount, total, shipping, discountNames };
}

/** Persist cart snapshot from any API response. */
export function syncCartResponse(cart: unknown): CartSnapshot {
	const lineItems = ((cart as { lineItems?: LineItem[] })?.lineItems ??
		[]) as LineItem[];
	const summary = extractSummary(cart as Parameters<typeof extractSummary>[0]);
	const snapshot = { lineItems, summary };
	writeCartSnapshot(snapshot);
	return snapshot;
}
