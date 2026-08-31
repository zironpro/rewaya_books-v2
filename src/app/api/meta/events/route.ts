import { NextResponse } from "next/server";

import { enrichMetaPayload } from "@/lib/analytics/meta-server";

type IncomingEventPayload = Record<string, unknown> & {
	event_name?: string;
	event_id?: string;
	event_time?: number;
	action_source?: string;
	event_source_url?: string;
};

const META_GRAPH_VERSION = "v20.0";

export async function POST(req: Request) {
	const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
	const accessToken = process.env.META_API_ACCESS_TOKEN;

	if (!pixelId || !accessToken) {
		return NextResponse.json(
			{ error: "Meta Pixel is not configured on the server" },
			{ status: 503 }
		);
	}

	let payload: IncomingEventPayload;
	try {
		payload = (await req.json()) as IncomingEventPayload;
	} catch {
		return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
	}

	if (
		typeof payload.event_name !== "string" ||
		payload.event_name.length === 0
	) {
		return NextResponse.json(
			{ error: "event_name is required" },
			{ status: 400 }
		);
	}

	if (typeof payload.event_id !== "string" || payload.event_id.length === 0) {
		return NextResponse.json(
			{ error: "event_id is required" },
			{ status: 400 }
		);
	}

	const normalizedPayload = {
		...payload,
		event_time:
			typeof payload.event_time === "number"
				? Math.floor(payload.event_time)
				: Math.floor(Date.now() / 1000),
		action_source:
			typeof payload.action_source === "string"
				? payload.action_source
				: "website",
		event_source_url:
			typeof payload.event_source_url === "string"
				? payload.event_source_url
				: (req.headers.get("referer") ?? undefined),
	};

	const enrichedPayload = enrichMetaPayload(normalizedPayload, req);

	try {
		const metaResponse = await fetch(
			`https://graph.facebook.com/${META_GRAPH_VERSION}/${pixelId}/events`,
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					data: [enrichedPayload],
					access_token: accessToken,
				}),
			}
		);

		const metaResult = (await metaResponse.json().catch(() => null)) as Record<
			string,
			unknown
		> | null;

		if (!metaResponse.ok) {
			return NextResponse.json(
				{
					error: "Meta CAPI request failed",
					meta: metaResult,
				},
				{ status: metaResponse.status }
			);
		}

		return NextResponse.json({ ok: true, meta: metaResult });
	} catch (error) {
		console.error("Meta CAPI route failed", error);
		return NextResponse.json(
			{ error: "Failed to send event to Meta CAPI" },
			{ status: 500 }
		);
	}
}
