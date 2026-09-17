import { FAQView } from "@/features/faq/faq-view";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Frequently Asked Questions | Rewaya Books",
	description:
		"Find answers to common questions about shipping, returns, orders, and more at Rewaya Books.",
};

export default function FAQPage() {
	return <FAQView />;
}
