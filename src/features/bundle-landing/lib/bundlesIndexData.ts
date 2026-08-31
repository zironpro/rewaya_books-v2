import {
	type BundlePresentation,
	bundleToPresentation,
	type Review,
} from "@/domain/bundle";
import type { Bundle, Faq } from "@/domain/catalog";
import { getBundleReviews } from "@/lib/bundle-reviews-data";

export interface BundleBookSlide {
	id: string;
	title: string;
	image: string;
	bundleId: string;
	bundleTitle: string;
}

export interface BundlesIndexPageData {
	bundles: Bundle[];
	bundlePresentations: BundlePresentation[];
	featuredBundle: Bundle | null;
	featuredPresentation: BundlePresentation | null;
	maxSavings: number;
	bookSlides: BundleBookSlide[];
	faqs: Faq[];
	reviews: Review[];
}

const CAMPAIGN_TIMER_FAQ: Faq = {
	id: "campaign-timer-faq",
	question: "How long is this bundle price available?",
	answer:
		"This campaign uses a limited window while the countdown runs in your browser session (typically 24 hours from your first visit). Add your bundle to cart before the timer ends to lock in the bundle price shown today.",
};

export function getFeaturedBundle(bundles: Bundle[]): Bundle | null {
	if (bundles.length === 0) {
		return null;
	}

	let featured = bundles[0];
	let maxSave = featured.originalPrice - featured.price;

	for (const bundle of bundles) {
		const save = bundle.originalPrice - bundle.price;
		if (save > maxSave) {
			maxSave = save;
			featured = bundle;
		}
	}

	return featured;
}

export function getMaxSavings(bundles: Bundle[]): number {
	return bundles.reduce(
		(max, b) => Math.max(max, b.originalPrice - b.price),
		0
	);
}

export function getAllBundleBookSlides(bundles: Bundle[]): BundleBookSlide[] {
	const slides: BundleBookSlide[] = [];

	for (const bundle of bundles) {
		for (const book of bundle.books) {
			slides.push({
				id: `${bundle.id}-${book.id}`,
				title: book.title,
				image: book.image,
				bundleId: bundle.id,
				bundleTitle: bundle.title,
			});
		}
	}

	return slides;
}

export function getAggregatedFaqs(bundles: Bundle[]): Faq[] {
	const seen = new Set<string>();
	const merged: Faq[] = [];

	for (const bundle of bundles) {
		for (const faq of bundle.faqs) {
			if (seen.has(faq.question)) continue;
			seen.add(faq.question);
			merged.push(faq);
		}
	}

	const hasTimerFaq = merged.some((f) => f.id === CAMPAIGN_TIMER_FAQ.id);
	if (!hasTimerFaq) {
		merged.push(CAMPAIGN_TIMER_FAQ);
	}

	return merged;
}

export function getAggregatedReviews(bundles: Bundle[], limit = 6): Review[] {
	const reviews: Review[] = [];

	for (const bundle of bundles) {
		reviews.push(...getBundleReviews(bundle.id));
	}

	return reviews.slice(0, limit);
}

export function buildBundlesIndexPageData(
	bundles: Bundle[]
): BundlesIndexPageData {
	const featuredBundle = getFeaturedBundle(bundles);
	const featuredPresentation = featuredBundle
		? bundleToPresentation(featuredBundle)
		: null;

	return {
		bundles,
		bundlePresentations: bundles.map(bundleToPresentation),
		featuredBundle,
		featuredPresentation,
		maxSavings: getMaxSavings(bundles),
		bookSlides: getAllBundleBookSlides(bundles),
		faqs: getAggregatedFaqs(bundles),
		reviews: getAggregatedReviews(bundles),
	};
}
