import type { BundlePresentation } from "@/domain/bundle";
import type { Bundle } from "@/domain/catalog";
import { cn } from "@/lib/utils";

import "./styles/bundleAnimations.css";

import { BookGallerySection } from "./components/book-gallery-section";
import { BooksBreakdownSection } from "./components/books-breakdown-section";
import { BundleFaqSection } from "./components/bundle-faq-section";
import { CtaSection } from "./components/cta-section";
import { HeroSection } from "./components/hero-section";
import { MinimalNav } from "./components/minimal-nav";
import { OverviewSection } from "./components/overview-section";
import { RelatedBundlesSection } from "./components/related-bundles-section";
import { SocialProofSection } from "./components/social-proof-section";
import { StickyCheckoutBar } from "./components/sticky-checkout-bar";

interface BundleLandingPageProps {
	bundle: BundlePresentation;
	relatedBundles: Bundle[];
	productVariantId?: string | null;
}

export function BundleLandingPage({
	bundle,
	relatedBundles,
	productVariantId,
}: BundleLandingPageProps) {
	// const priceLabel = `AED ${bundle.price} · was ${bundle.originalPrice}`;
	const priceLabel = `AED ${bundle.price}`;

	console.log(productVariantId, "variant id from landing page props");

	return (
		<main className={cn("bundle-page pb-20 md:pb-0")}>
			<MinimalNav
				bundleName={bundle.name}
				priceLabel={priceLabel}
				productVariantId={productVariantId}
			/>
			<HeroSection bundle={bundle} productVariantId={productVariantId} />
			<BookGallerySection bundle={bundle} />
			<OverviewSection bundle={bundle} />
			<BooksBreakdownSection bundle={bundle} />
			<SocialProofSection bundle={bundle} />
			<RelatedBundlesSection bundles={relatedBundles} />
			<BundleFaqSection bundle={bundle} />
			<CtaSection bundle={bundle} productVariantId={productVariantId} />
			<StickyCheckoutBar bundle={bundle} />
		</main>
	);
}
