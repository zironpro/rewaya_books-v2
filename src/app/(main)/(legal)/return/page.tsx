import { Metadata } from "next";

import { ReturnPolicyView } from "@/features/legal/return-policy-view";

export const metadata: Metadata = {
	title: "Return Policy | Al Rewaya",
	description: "Learn how we return your order at Al Rewaya.",
};

export default function ReturnPage() {
	return <ReturnPolicyView />;
}
