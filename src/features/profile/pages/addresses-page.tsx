"use client";

import { useState } from "react";

import Link from "next/link";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

import { AddressesTab } from "@/features/profile/components/addresses-tab";
import { ProfilePageHeader } from "@/features/profile/components/profile-page-header";

export const AddressesPage = ({ initialAddresses = [] }: { initialAddresses?: any[] }) => {
	const [addresses] = useState<any[]>(initialAddresses);
	const [loading] = useState(false);

	return (
		<>
			<ProfilePageHeader
				action={
					<Button
						asChild
						className="h-12 gap-2 rounded-2xl px-6 bg-primary hover:bg-primary/90 text-white"
					>
						<Link href="/profile/settings">
							<Plus size={18} />
							Add address
						</Link>
					</Button>
				}
				description="Manage your shipping and billing addresses"
				title="My Addresses"
			/>
			<AddressesTab addresses={addresses} loading={loading} />
		</>
	);
};
