/**
 * Seeds bundle products + CMS BundleDetails for AL REWAYA BOOKSTORE.
 *
 * Prerequisites:
 *   - WIX_API_KEY env var (server-only, from manage.wix.com/account/api-keys)
 *   - Site uses Catalog V1
 *
 * Usage:
 *   WIX_API_KEY=xxx node scripts/seed-wix-bundles.mjs
 */

const SITE_ID = "835db726-cfca-4ef4-8305-4002f5f62aef";
const API_KEY = process.env.WIX_API_KEY;

if (!API_KEY) {
	console.error("Set WIX_API_KEY before running this script.");
	process.exit(1);
}

const bundles = [
	{
		slug: "bundle-1",
		title: "Quran & Salah Essentials",
		tag: "Kids Favorite",
		price: 149,
		originalPrice: 165,
		description:
			"<p>Curated kids bundle: Quran stories, Sunnah comics, phonics, and more.</p>",
	},
	{
		slug: "bundle-2",
		title: "Young Readers Starter Pack",
		tag: "Best Value",
		price: 129,
		originalPrice: 145,
		description: "<p>Five essential volumes for early readers.</p>",
	},
	{
		slug: "bundle-3",
		title: "Ramadan & Eid Collection",
		tag: "Seasonal",
		price: 99,
		originalPrice: 120,
		description: "<p>Ramadan journals, stories, and activity books.</p>",
	},
	{
		slug: "bundle-4",
		title: "Arabic Learning Bundle",
		tag: "Education",
		price: 175,
		originalPrice: 195,
		description: "<p>Graded Arabic and Quranic reading foundations.</p>",
	},
	{
		slug: "bundle-5",
		title: "Family Night Library",
		tag: "Family",
		price: 89,
		originalPrice: 105,
		description: "<p>Stories and puzzles for family reading time.</p>",
	},
];

async function wixFetch(url, method, body) {
	const res = await fetch(url, {
		method,
		headers: {
			Authorization: API_KEY,
			"Content-Type": "application/json",
			"wix-site-id": SITE_ID,
		},
		body: body ? JSON.stringify(body) : undefined,
	});
	const text = await res.text();
	if (!res.ok) {
		throw new Error(`${res.status} ${url}: ${text}`);
	}
	return text ? JSON.parse(text) : {};
}

async function ensureBundleDetailsCollection() {
	try {
		await wixFetch("https://www.wixapis.com/wix-data/v2/collections", "POST", {
			collection: {
				id: "BundleDetails",
				displayName: "Bundle Details",
				fields: [
					{ key: "slug", displayName: "Slug", type: "TEXT", required: true },
					{ key: "title", displayName: "Title", type: "TEXT" },
					{ key: "tag", displayName: "Tag", type: "TEXT" },
					{
						key: "originalPrice",
						displayName: "Original Price",
						type: "NUMBER",
					},
					{
						key: "bundleProductId",
						displayName: "Bundle Product ID",
						type: "TEXT",
						required: true,
					},
					{
						key: "includedBookIds",
						displayName: "Included Book IDs (JSON array)",
						type: "TEXT",
					},
				],
				permissions: {
					insert: "ADMIN",
					update: "ADMIN",
					remove: "ADMIN",
					read: "ANYONE",
				},
			},
		});
		console.log("Created BundleDetails collection");
	} catch (e) {
		console.log("BundleDetails collection may already exist:", e.message);
	}
}

async function createBundleProduct(bundle) {
	const { product } = await wixFetch(
		"https://www.wixapis.com/stores/v1/products",
		"POST",
		{
			product: {
				name: bundle.title,
				description: bundle.description,
				visible: true,
				productType: "physical",
				priceData: { price: bundle.price },
			},
		}
	);
	return product;
}

async function insertBundleDetails(bundle, productId, includedBookIds) {
	await wixFetch("https://www.wixapis.com/wix-data/v2/items", "POST", {
		dataCollectionId: "BundleDetails",
		dataItem: {
			data: {
				slug: bundle.slug,
				title: bundle.title,
				tag: bundle.tag,
				originalPrice: bundle.originalPrice,
				bundleProductId: productId,
				includedBookIds: JSON.stringify(includedBookIds),
			},
		},
	});
}

async function main() {
	await ensureBundleDetailsCollection();

	for (const bundle of bundles) {
		console.log(`Creating bundle product: ${bundle.title}`);
		const product = await createBundleProduct(bundle);
		await insertBundleDetails(bundle, product.id, []);
		console.log(`  → product id ${product.id}, slug ${bundle.slug}`);
	}

	console.log("Done. Update includedBookIds in Wix CMS for each bundle row.");
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
