import Link from "next/link";

import { Button } from "@/components/ui/button";

export function CartEmpty() {
	return (
		<div className="border-stone-100 border-y py-20 text-center">
			<p className="mb-8 text-sm text-stone-400">
				Your bag is currently empty.
			</p>
			<Button nativeButton={false} render={<Link href="/shop" />}>
				Explore the Library
			</Button>
		</div>
	);
}
