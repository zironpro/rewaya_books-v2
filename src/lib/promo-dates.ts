const DELIVERY_NOTICE_END = new Date("2026-06-02T00:00:00");

export function isDeliveryNoticeActive(now = new Date()): boolean {
	return now < DELIVERY_NOTICE_END;
}
