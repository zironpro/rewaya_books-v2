import { RefundDetailView } from "@/features/admin/refunds/refund-detail-view";

export const metadata = {
	title: "Refund Request Details | Admin Dashboard",
};

export default async function RefundDetailPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	return <RefundDetailView id={id} />;
}
