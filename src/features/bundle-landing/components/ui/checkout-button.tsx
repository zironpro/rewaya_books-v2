"use client";

import { Button } from "@/components/ui/button";

interface CheckoutButtonProps extends React.ComponentProps<typeof Button> {
	children: React.ReactNode;
	productVariantId?: string | null;
}

export const CheckoutButton = ({
	children,
	productVariantId,
	...props
}: CheckoutButtonProps) => {
	function handleCheckout() {
		// Dummy handler
	}

	return (
		<Button onClick={handleCheckout} {...props}>
			{children}
		</Button>
	);
};
