import { Metadata } from "next";

import { CouponCreateView } from "@/features/admin/coupons/coupon-create-view";

export const metadata: Metadata = {
	title: "Create Coupon | Admin",
};

export default function CreateCouponPage() {
	return <CouponCreateView />;
}
