import Link from "next/link";

import { FOOTER_STORE } from "@/components/layout/data/FooterLinks";

import {
	LegalPageShell,
	LegalParagraph,
	LegalSection,
} from "@/features/legal/legal-page-shell";

export const AccessibilityView = () => {
	return (
		<LegalPageShell
			breadcrumbLabel="Accessibility Statement"
			footerNote={<p>Contact: {FOOTER_STORE.supportEmail}</p>}
			title={
				<>
					Accessibility <span className="font-normal italic">Statement</span>.
				</>
			}
		>
			<LegalSection title="1. Our Commitment">
				<LegalParagraph>
					Al Rewaya is committed to making our website and in-store experience
					accessible to as many people as possible, including customers with
					disabilities. We aim to follow widely recognised accessibility
					guidelines, including the Web Content Accessibility Guidelines (WCAG)
					2.1 Level AA where practicable.
				</LegalParagraph>
			</LegalSection>

			<LegalSection title="2. Measures We Take">
				<LegalParagraph>
					We work to ensure our site can be navigated by keyboard, uses semantic
					HTML where possible, maintains readable colour contrast, and provides
					alternative text for product imagery. We review new features with
					accessibility in mind and address issues as we identify them.
				</LegalParagraph>
			</LegalSection>

			<LegalSection title="3. Known Limitations">
				<LegalParagraph>
					Some third-party content—such as payment flows powered by our payment
					providers—or older pages may not yet meet our full accessibility
					targets. We continue to improve the site over time and welcome
					feedback on areas that need attention.
				</LegalParagraph>
			</LegalSection>

			<LegalSection title="4. Feedback & Assistance">
				<LegalParagraph>
					If you encounter a barrier on our website or need help placing an
					order, please contact us. Email{" "}
					<a
						className="text-secondary underline underline-offset-2 hover:text-secondary/80"
						href={`mailto:${FOOTER_STORE.supportEmail}`}
					>
						{FOOTER_STORE.supportEmail}
					</a>
					, call{" "}
					<a
						className="text-secondary underline underline-offset-2 hover:text-secondary/80"
						href={`tel:${FOOTER_STORE.phone.replace(/\s/g, "")}`}
					>
						{FOOTER_STORE.phone}
					</a>
					, or visit our{" "}
					<Link
						className="text-secondary underline underline-offset-2 hover:text-secondary/80"
						href="/contact"
					>
						contact page
					</Link>
					. We will do our best to provide the information or support you need
					in a format that works for you.
				</LegalParagraph>
			</LegalSection>
		</LegalPageShell>
	);
};
