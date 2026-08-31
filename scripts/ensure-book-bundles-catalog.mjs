/**
 * One-time: attach Wix CATALOG plugin to BookBundles so CMS rows work in cart
 * when bundleProductId is not set on each row.
 *
 * Usage:
 *   WIX_API_KEY=xxx node scripts/ensure-book-bundles-catalog.mjs
 */

import { existsSync, readFileSync } from "fs";

const SITE_ID =
	process.env.NEXT_PUBLIC_WIX_SITE_ID ??
	process.env.WIX_SITE_ID ??
	"835db726-cfca-4ef4-8305-4002f5f62aef";
const API_KEY = process.env.WIX_API_KEY;

for (const file of [".env.local", ".env"]) {
	if (!existsSync(file)) continue;
	for (const line of readFileSync(file, "utf8").split("\n")) {
		const m = line.match(/^([^#=]+)=(.*)$/);
		if (m && !process.env[m[1].trim()])
			process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, "");
	}
}

if (!API_KEY) {
	console.error("Set WIX_API_KEY (server API key from manage.wix.com).");
	process.exit(1);
}

async function wixFetch(url, body) {
	const res = await fetch(url, {
		method: "POST",
		headers: {
			Authorization: API_KEY,
			"Content-Type": "application/json",
			"wix-site-id": SITE_ID,
		},
		body: JSON.stringify(body),
	});
	const text = await res.text();
	if (!res.ok) {
		throw new Error(`${res.status} ${url}: ${text}`);
	}
	return text ? JSON.parse(text) : {};
}

async function main() {
	console.log("Adding CATALOG plugin to BookBundles…");
	try {
		await wixFetch(
			"https://www.wixapis.com/wix-data/v2/collections/add-plugin",
			{
				dataCollectionId: "BookBundles",
				plugin: {
					type: "CATALOG",
					catalogOptions: {
						name: "bundleTitle",
						price: "price",
						description: "overview",
						image: "bundleImage",
						quantity: "quantityAvailable",
					},
				},
			}
		);
		console.log("CATALOG plugin added (or updated).");
	} catch (e) {
		console.error("Failed:", e.message);
		console.log(
			"\nAlternatively, set bundleProductId on each BookBundles row to a Wix Stores product ID."
		);
		process.exit(1);
	}
}

main();
