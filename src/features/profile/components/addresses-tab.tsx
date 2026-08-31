"use client";

import Link from "next/link";

import { MapPin } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AddressesTabProps {
	addresses: any[];
	loading?: boolean;
}

export const AddressesTab = ({
	addresses,
	loading = false,
}: AddressesTabProps) => {
	if (loading) {
		return (
			<div className="py-16 text-center text-sm text-stone-400 md:py-24">
				Loading addresses…
			</div>
		);
	}

	if (addresses.length === 0) {
		return (
			<Card>
				<CardContent className="flex flex-col items-center py-16 text-center md:py-24">
					<MapPin className="mb-4 text-stone-300" size={40} />
					<p className="mb-2 font-bold text-secondary">No saved addresses</p>
					<p className="mb-6 max-w-xs text-sm text-stone-400">
						Add a shipping address in settings or at checkout.
					</p>
					<Button
						asChild
						className="bg-primary hover:bg-primary/90 text-white"
					>
						<Link href="/profile/settings">Go to settings</Link>
					</Button>
				</CardContent>
			</Card>
		);
	}

	return (
		<div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6">
			{addresses.map((address) => (
				<Card
					className={`transition-all duration-300 hover:shadow-md ${
						address.isDefault ? "ring-2 ring-primary ring-offset-2" : ""
					}`}
					key={address.id}
				>
					<CardHeader className="flex flex-row items-start justify-between pb-2">
						<div className="flex items-center gap-3">
							<div className="flex size-10 items-center justify-center rounded-xl bg-stone-50">
								<MapPin className="text-primary" size={20} />
							</div>
							<div>
								<div className="flex items-center gap-2">
									<CardTitle className="font-bold text-lg">
										{address.type}
									</CardTitle>
									{address.isDefault ? (
										<Badge
											className="border-primary/20 bg-primary/5 font-bold text-[10px] text-primary uppercase tracking-wider"
											variant="outline"
										>
											Default
										</Badge>
									) : null}
								</div>
							</div>
						</div>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-1">
							<p className="font-bold text-secondary">{address.name}</p>
							<p className="text-sm text-stone-500">{address.street}</p>
							<p className="text-sm text-stone-500">
								{address.city}, {address.country}
							</p>
							{address.phone && address.phone !== "—" ? (
								<p className="mt-2 text-sm text-stone-500">{address.phone}</p>
							) : null}
						</div>
					</CardContent>
				</Card>
			))}
		</div>
	);
};
