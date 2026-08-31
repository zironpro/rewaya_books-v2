type MetaCustomData = {
	content_ids?: string[];
	content_name?: string;
	content_category?: string;
	content_type?: string;
	value?: number;
	currency?: string;
	em?: string;
} & Record<string, unknown>;

type FbqFunction = {
	(command: string, eventName: string, data?: Record<string, unknown>): void;
	callMethod?: (...args: unknown[]) => void;
	queue?: unknown[];
	loaded?: boolean;
	version?: string;
	push?: (...args: unknown[]) => void;
};

declare global {
	interface Window {
		fbq?: FbqFunction;
	}
}

/**
 * Generate a stable event_id for deduplication between browser and server events.
 */
export function generateEventId(): string {
	return crypto.randomUUID();
}

/**
 * Types for Meta event payloads.
 */
export interface MetaEventPayload {
	event_name: string;
	event_time?: number;
	action_source?: string;
	event_source_url?: string;
	event_id: string;
	user_data?: {
		em?: string; // hashed email
		client_ip_address?: string;
		client_user_agent?: string;
		fbp?: string;
		fbc?: string;
	};
	custom_data?: MetaCustomData;
}

/**
 * Track a Meta event on the client (browser) and also forward it to the server for CAPI.
 *
 * @param eventName The Meta event name (e.g., 'ViewContent', 'AddToCart').
 * @param payload Additional data for the event.
 */
export async function trackMetaEvent(
	eventName: string,
	payload: Omit<MetaEventPayload, "event_name" | "event_id">
) {
	if (typeof window === "undefined") return; // safety
	const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
	if (!pixelId) {
		console.warn("Meta Pixel ID not configured");
		return;
	}

	const eventId = generateEventId();

	// Fire browser pixel event if fbq is available
	if (typeof window.fbq === "function") {
		window.fbq("track", eventName, { ...payload, event_id: eventId });
	} else {
		console.warn("fbq not available");
	}

	// Forward to server for CAPI
	try {
		const response = await fetch("/api/meta/events", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			keepalive: true,
			body: JSON.stringify({
				event_name: eventName,
				event_id: eventId,
				...payload,
			}),
		});
		if (!response.ok) {
			const body = await response.text().catch(() => "");
			console.error(
				`Meta CAPI forward failed (${response.status}):`,
				body || "No response body"
			);
		}
	} catch (err) {
		console.error("Failed to forward Meta event to CAPI", err);
	}
}
