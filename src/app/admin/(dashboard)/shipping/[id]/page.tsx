import { ShippingEditView } from "@/features/admin/shipping/shipping-edit-view";

export default async function ShippingEditPage({
	params,
}: {
	params: { id: string };
}) {
	const { id } = await params;
	return <ShippingEditView shippingId={id} />;
}
