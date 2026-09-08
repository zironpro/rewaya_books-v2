import Link from "next/link";

import { Button } from "@/components/ui/button";

import { ClearCartEffect } from "@/features/cart/components/clear-cart-effect";

export default async function ThankYouPage({
	searchParams,
}: {
	searchParams: Promise<{ orderId?: string }>;
}) {
	const { orderId } = await searchParams;

	return (
		<main className="container grow py-24 text-center">
			<ClearCartEffect />
			<h1 className="font-serif text-4xl text-secondary">Thank you</h1>
			<p className="mx-auto mt-4 max-w-md text-muted-foreground">
				Your order has been received. We appreciate your trust in Rewaya Books.
			</p>
			{orderId ? (
				<p className="mt-6 font-medium text-secondary text-sm">
					Order reference: <span className="text-primary">{orderId}</span>
				</p>
			) : null}
			<div className="mt-10 flex flex-wrap justify-center gap-4">
				<Button asChild>
					<Link href="/shop">Continue shopping</Link>
				</Button>
				<Button asChild variant="outline">
					<Link href="/profile/orders">View orders</Link>
				</Button>
			</div>
		</main>
	);
}
