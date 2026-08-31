import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { AddressesPage } from "@/features/profile/pages/addresses-page";
import { User } from "@/lib/db/models/User";
import connectToDatabase from "@/lib/db/mongodb";

export const metadata = {
	title: "My Addresses | Rewaya",
	description: "Manage your shipping and billing addresses.",
};

export default async function ProfileAddressesPage() {
	const session = await auth();
	
	if (!session?.user?.email) {
		redirect("/login");
	}
	
	await connectToDatabase();
	
	const user = await User.findOne({ email: session.user.email }).lean();
	
	let addresses: any[] = [];
	if (user?.shippingAddress && user.shippingAddress.firstName) {
		addresses.push({
			id: "shipping",
			type: "Shipping Address",
			isDefault: true,
			name: `${user.shippingAddress.firstName} ${user.shippingAddress.lastName}`.trim(),
			street: `${user.shippingAddress.addressLine1} ${user.shippingAddress.addressLine2 || ""}`.trim(),
			city: `${user.shippingAddress.city || ""} ${user.shippingAddress.postalCode || ""}`.trim(),
			country: user.shippingAddress.country || "UAE",
			phone: user.phone || "—",
		});
	}

	return <AddressesPage initialAddresses={addresses} />;
}
