import { PaymentPage } from "@/features/profile/pages/payment-page";

export const metadata = {
	title: "Payment Methods | Rewaya",
	description: "View payment methods used on past orders.",
};

export default function ProfilePaymentPage() {
	return <PaymentPage />;
}
