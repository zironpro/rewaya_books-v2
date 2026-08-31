import { Metadata } from "next";
import { CouponEditView } from "@/features/admin/coupons/coupon-edit-view";

export const metadata: Metadata = {
	title: "Edit Coupon | Admin",
};

export default async function EditCouponPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const resolvedParams = await params;
	return <CouponEditView id={resolvedParams.id} />;
}
