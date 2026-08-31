import { items } from "@wix/data";
import { createClient, OAuthStrategy } from "@wix/sdk";
import { existsSync, readFileSync } from "fs";

const WIX_STORES_APP_ID = "215238eb-22a5-4c36-9e7b-e7c08025e04e";
const WIX_CMS_CATALOG_APP_ID = "e593b0bd-b783-45b8-97c2-873d42aacaf4";

for (const file of [".env.local", ".env"]) {
	if (!existsSync(file)) continue;
	for (const line of readFileSync(file, "utf8").split("\n")) {
		const m = line.match(/^([^#=]+)=(.*)$/);
		if (m && !process.env[m[1].trim()])
			process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, "");
	}
}

function parseCmsProductIdField(raw) {
	if (!raw) return undefined;
	if (typeof raw === "string") {
		const id = raw.trim();
		return id || undefined;
	}
	if (Array.isArray(raw) && raw.length > 0) {
		return parseCmsProductIdField(raw[0]);
	}
	if (typeof raw === "object") {
		const obj = raw;
		const id = obj._id ?? obj.id ?? obj.productId;
		if (id != null) {
			const s = String(id).trim();
			return s || undefined;
		}
	}
	return undefined;
}

function resolveBundleCheckout(bundleProductId, cmsCatalogItemId) {
	const storesId = bundleProductId?.trim();
	if (storesId) {
		return {
			checkoutCatalogItemId: storesId,
			checkoutCatalogAppId: WIX_STORES_APP_ID,
			path: "stores",
		};
	}
	return {
		checkoutCatalogItemId: cmsCatalogItemId,
		checkoutCatalogAppId: WIX_CMS_CATALOG_APP_ID,
		path: "cms-catalog",
	};
}

const clientId =
	process.env.WIX_CLIENT_ID ?? process.env.NEXT_PUBLIC_WIX_CLIENT_ID;
if (!clientId) {
	console.error("Set WIX_CLIENT_ID or NEXT_PUBLIC_WIX_CLIENT_ID in .env.local");
	process.exit(1);
}

const client = createClient({
	modules: { items },
	auth: OAuthStrategy({ clientId }),
	headers: { "wix-site-id": process.env.NEXT_PUBLIC_WIX_SITE_ID },
});

const { items: rows } = await client.items
	.query("BookBundles")
	.include("bundleProducts")
	.limit(10)
	.find();

console.log("BookBundles count:", rows.length);
console.log("---");

for (const item of rows) {
	const data = item.data ?? {};
	const bundleProductId = parseCmsProductIdField(
		data.bundleProductId ??
			data.bundle_product_id ??
			data.wixProductId ??
			data.bundleProduct ??
			data.bundle_product
	);
	const checkout = resolveBundleCheckout(bundleProductId, item._id);

	console.log("\n=== Row", item._id, "===");
	console.log("data keys:", Object.keys(data));
	console.log("raw data:", JSON.stringify(data, null, 2));
	console.log("parsed bundleProductId:", bundleProductId ?? "(none)");
	console.log("resolveBundleCheckout:", checkout);
}
