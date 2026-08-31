import { Truck } from "lucide-react";

import { isDeliveryNoticeActive } from "@/lib/promo-dates";

export function DeliveryNoticeBanner() {
	if (!isDeliveryNoticeActive()) {
		return null;
	}

	return (
		<div
			className="mb-8 flex gap-3 rounded-md border border-amber-300 bg-amber-100 px-4 py-3 text-amber-950 text-sm"
			role="status"
		>
			<Truck aria-hidden className="mt-0.5 size-4 shrink-0" />
			<p>
				Delivery usually takes 2-3 days. Kindly note that Eid holidays may
				affect the delivery timeline slightly.
			</p>
		</div>
	);
}
