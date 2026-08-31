import { createHash } from "crypto";

/**
 * Extract client IP address from request headers.
 */
export function getClientIp(req: Request): string | undefined {
	const forwarded = req.headers.get("x-forwarded-for");
	if (forwarded) return forwarded.split(",")[0].trim();
	const ip = req.headers.get("x-real-ip");
	return ip ?? undefined;
}

/**
 * Extract client user agent from request headers.
 */
export function getUserAgent(req: Request): string | undefined {
	return req.headers.get("user-agent") ?? undefined;
}

/**
 * Retrieve Facebook _fbp cookie value.
 */
export function getFbp(req: Request): string | undefined {
	const cookie = req.headers.get("cookie");
	if (!cookie) return undefined;
	const match = cookie.match(/_fbp=([^;]+)/);
	return match ? match[1] : undefined;
}

/**
 * Retrieve Facebook _fbc cookie value.
 */
export function getFbc(req: Request): string | undefined {
	const cookie = req.headers.get("cookie");
	if (!cookie) return undefined;
	const match = cookie.match(/_fbc=([^;]+)/);
	return match ? match[1] : undefined;
}

/**
 * Hash email address using SHA-256 and return hex string.
 */
export function hashEmail(email: string): string {
	const lower = email.trim().toLowerCase();
	return createHash("sha256").update(lower).digest("hex");
}

/**
 * Enrich Meta event payload with server‑side data.
 * @param payload The incoming client payload (may include event_id).
 * @param req The incoming request.
 */
export function enrichMetaPayload(
	payload: Record<string, unknown>,
	req: Request
) {
	const user_data: Record<string, unknown> = {};
	const ip = getClientIp(req);
	if (ip) user_data.client_ip_address = ip;
	const ua = getUserAgent(req);
	if (ua) user_data.client_user_agent = ua;
	const fbp = getFbp(req);
	if (fbp) user_data.fbp = fbp;
	const fbc = getFbc(req);
	if (fbc) user_data.fbc = fbc;
	// If email is provided in custom_data.em, hash it.
	const customData = payload.custom_data;
	if (typeof customData === "object" && customData !== null) {
		const email = (customData as { em?: unknown }).em;
		if (typeof email === "string" && email.length > 0) {
			user_data.em = hashEmail(email);
		}
	}
	return { ...payload, user_data };
}
