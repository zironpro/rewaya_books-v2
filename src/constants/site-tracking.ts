/** Hostname of the OpenPanel script / collector (HTTPS and WSS). */
export const OPENPANEL_COLLECTOR_HOST = "analytics.zironpro.ae" as const;

export const OPENPANEL_SCRIPT_ORIGIN =
	`https://${OPENPANEL_COLLECTOR_HOST}` as const;

export const OPENPANEL_WEBSOCKET_ORIGIN =
	`wss://${OPENPANEL_COLLECTOR_HOST}` as const;

export const OPENPANEL_SCRIPT_PATH = "/op1.js" as const;

export function getOpenPanelScriptSrc(): string {
	return `${OPENPANEL_SCRIPT_ORIGIN}${OPENPANEL_SCRIPT_PATH}`;
}
