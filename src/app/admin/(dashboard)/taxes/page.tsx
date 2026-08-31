import { Metadata } from "next";
import { TaxesView } from "@/features/admin/taxes/taxes-view";

export const metadata: Metadata = {
	title: "Taxes & UAE VAT Settings | Rewaya Admin",
	description:
		"Configure regional VAT rates, Tax Registration Number (TRN), and invoice calculation rules.",
};

export default function TaxesPage() {
	return <TaxesView />;
}
