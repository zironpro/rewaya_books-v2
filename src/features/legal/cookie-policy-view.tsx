import Link from "next/link";

import {
	LegalPageShell,
	LegalParagraph,
	LegalSection,
} from "@/features/legal/legal-page-shell";

export const CookiePolicyView = () => {
	return (
		<LegalPageShell
			breadcrumbLabel="Cookie Policy"
			footerNote={<p>Contact: privacy@alrewaya.com</p>}
			title={
				<>
					Cookie <span className="font-normal italic">Policy</span>.
				</>
			}
		>
			<LegalSection title="1. What Are Cookies">
				<LegalParagraph>
					Cookies are small text files stored on your device when you visit a
					website. We also use similar technologies such as local storage and
					session storage to help our site function and to understand how it is
					used.
				</LegalParagraph>
			</LegalSection>

			<LegalSection title="2. Strictly Necessary Cookies">
				<LegalParagraph>
					These cookies are required for the site to work. They support features
					such as keeping you signed in, remembering items in your cart, and
					processing checkout through our e-commerce provider. Without
					them, certain parts of the store may not function correctly.
				</LegalParagraph>
			</LegalSection>

			<LegalSection title="3. Analytics (OpenPanel)">
				<LegalParagraph>
					We use{" "}
					<a
						className="text-secondary underline underline-offset-2 hover:text-secondary/80"
						href="https://openpanel.dev/docs"
						rel="noopener noreferrer"
						target="_blank"
					>
						OpenPanel
					</a>{" "}
					to understand how visitors use Al Rewaya. OpenPanel may collect
					information such as pages viewed, navigation paths, browser and device
					type, referral source, and approximate location derived from your IP
					address. We use this data to improve our website and shopping
					experience—not to sell your information for advertising.
				</LegalParagraph>
			</LegalSection>

			<LegalSection title="4. Other Third-Party Cookies">
				<LegalParagraph>
					When you complete a purchase or sign in, our secure payment partners may
					set cookies to process transactions securely. Their use of cookies is
					governed by their own privacy and cookie policies.
				</LegalParagraph>
			</LegalSection>

			<LegalSection title="5. How to Manage Cookies">
				<LegalParagraph>
					You can control or delete cookies through your browser settings. Most
					browsers let you block third-party cookies or clear stored data at any
					time. Blocking strictly necessary cookies may affect checkout and
					account features. To limit analytics tracking, you may use browser
					extensions or privacy settings; we do not currently display a separate
					cookie consent banner on this site.
				</LegalParagraph>
			</LegalSection>

			<LegalSection title="6. Contact">
				<LegalParagraph>
					Questions about this policy? Email privacy@alrewaya.com. For how we
					handle personal data more broadly, see our{" "}
					<Link
						className="text-secondary underline underline-offset-2 hover:text-secondary/80"
						href="/privacy"
					>
						Privacy Policy
					</Link>
					.
				</LegalParagraph>
			</LegalSection>
		</LegalPageShell>
	);
};
