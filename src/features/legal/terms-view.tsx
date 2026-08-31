import {
	LegalPageShell,
	LegalParagraph,
	LegalSection,
} from "@/features/legal/legal-page-shell";

export const TermsView = () => {
	return (
		<LegalPageShell
			breadcrumbLabel="Terms and Conditions"
			footerNote={<p>Legal Team: legal@alrewaya.com</p>}
			title={
				<>
					Terms & <span className="font-normal italic">Conditions</span>.
				</>
			}
		>
			<LegalSection title="1. Agreement to Terms">
				<LegalParagraph>
					By accessing or using the Al Rewaya platform, you agree to be bound by
					these Terms and Conditions. If you do not agree with any part of these
					terms, you must not use our services.
				</LegalParagraph>
			</LegalSection>

			<LegalSection title="2. Intellectual Property">
				<LegalParagraph>
					The content, design, and identity of Al Rewaya are the exclusive
					property of Al Rewaya. You may not reproduce, distribute, or create
					derivative works from any part of our platform without explicit
					written permission.
				</LegalParagraph>
			</LegalSection>

			<LegalSection title="3. User Accounts">
				<LegalParagraph>
					When you create an account with us, you must provide accurate and
					complete information. You are responsible for maintaining the
					confidentiality of your account and password.
				</LegalParagraph>
			</LegalSection>

			<LegalSection title="4. Purchases and Payment">
				<LegalParagraph>
					All prices are in AED unless otherwise stated. We reserve the right to
					change prices at any time without notice. By placing an order, you
					represent that you have the legal right to use the chosen payment
					method.
				</LegalParagraph>
			</LegalSection>

			<LegalSection title="5. Limitation of Liability">
				<LegalParagraph>
					Al Rewaya shall not be liable for any indirect, incidental, special,
					consequential, or punitive damages resulting from your access to or
					use of our platform or products.
				</LegalParagraph>
			</LegalSection>
		</LegalPageShell>
	);
};
