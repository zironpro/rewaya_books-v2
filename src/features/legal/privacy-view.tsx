import Link from "next/link";

import {
	LegalPageShell,
	LegalParagraph,
	LegalSection,
} from "@/features/legal/legal-page-shell";

export const PrivacyView = () => {
	return (
		<LegalPageShell
			breadcrumbLabel="Privacy Policy"
			footerNote={<p>Contact: privacy@alrewaya.com</p>}
			title={
				<>
					Privacy <span className="font-normal italic">Policy</span>.
				</>
			}
		>
			<LegalSection title="1. Introduction">
				<LegalParagraph>
					At Al Rewaya, we value your privacy and are committed to protecting
					your personal data. This Privacy Policy outlines how we collect, use,
					and safeguard your information when you visit our platform and
					purchase our curated collections.
				</LegalParagraph>
			</LegalSection>

			<LegalSection title="2. Data Collection">
				<LegalParagraph>
					We collect information that you provide directly to us when you create
					an account, make a purchase, or subscribe to our newsletter. This may
					include your name, email address, shipping address, and payment
					information.
				</LegalParagraph>
			</LegalSection>

			<LegalSection title="3. Analytics & Third-Party Services">
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
					for website analytics. OpenPanel may collect information such as pages
					you visit, how you navigate the site, your browser and device type,
					referral source, and approximate location derived from your IP
					address. This data helps us understand how our store is used and
					improve the shopping experience. We do not sell this information for
					advertising purposes. For more detail on cookies and similar
					technologies, see our{" "}
					<Link
						className="text-secondary underline underline-offset-2 hover:text-secondary/80"
						href="/cookies"
					>
						Cookie Policy
					</Link>
					.
				</LegalParagraph>
				<LegalParagraph>
					When you check out or manage your account, our commerce provider
					processes orders and payments on our behalf and may collect additional
					data under their own policies.
				</LegalParagraph>
			</LegalSection>

			<LegalSection title="4. How We Use Your Data">
				<LegalParagraph>
					Your data allows us to process your orders, provide customer support,
					and send you updates about new arrivals and special offers. We never
					sell your personal information to third parties.
				</LegalParagraph>
			</LegalSection>

			<LegalSection title="5. Data Security">
				<LegalParagraph>
					We implement industry-standard security measures to protect your data.
					All payment transactions are processed through secure, encrypted
					gateways to ensure your financial information remains private.
				</LegalParagraph>
			</LegalSection>

			<LegalSection title="6. Your Rights">
				<LegalParagraph>
					You have the right to access, correct, or delete your personal
					information at any time. You can manage your preferences through your
					account settings or by contacting our support team.
				</LegalParagraph>
			</LegalSection>
		</LegalPageShell>
	);
};
