"use client";

import { useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

import { PaymentTab } from "@/features/profile/components/payment-tab";
import { ProfilePageHeader } from "@/features/profile/components/profile-page-header";

export const PaymentPage = () => {
	const router = useRouter();
	const [methods] = useState<any[]>([]);
	const [loading] = useState(false);

	const handleAddCard = () => {
		router.push("/cart");
	};

	return (
		<>
			<ProfilePageHeader
				action={
					<Button
						className="h-12 gap-2 rounded-2xl px-6"
						onClick={handleAddCard}
						variant="premium"
					>
						<Plus size={18} />
						Add new card
					</Button>
				}
				description="Cards from past orders and checkout"
				title="Payment Methods"
			/>
			<PaymentTab
				loading={loading}
				onAddCard={handleAddCard}
				paymentMethods={methods}
			/>
			<p className="text-center text-stone-400 text-xs">
				<Link className="text-primary underline" href="/cart">
					Go to cart
				</Link>{" "}
				to complete checkout and save a payment method.
			</p>
		</>
	);
};
