import { Metadata } from "next";
import { CouponsView } from "@/features/admin/coupons/coupons-view";

export const metadata: Metadata = {
	title: "Coupons | Admin",
};

export default function CouponsPage() {
	return <CouponsView />;
}
