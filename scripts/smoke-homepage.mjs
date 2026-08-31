import { createClient, OAuthStrategy } from "@wix/sdk";
import { catalogVersioning, collections, products } from "@wix/stores";
import { existsSync, readFileSync } from "fs";

for (const file of [".env.local", ".env"]) {
	if (!existsSync(file)) continue;
	for (const line of readFileSync(file, "utf8").split("\n")) {
		const m = line.match(/^([^#=]+)=(.*)$/);
		if (m && !process.env[m[1].trim()])
			process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, "");
	}
}

const ALL = "00000000-000000-000000-000000000001";
const client = createClient({
	modules: { products, collections, catalogVersioning },
	auth: OAuthStrategy({ clientId: process.env.WIX_CLIENT_ID }),
	headers: { "wix-site-id": process.env.NEXT_PUBLIC_WIX_SITE_ID },
});

const cats = [];
let offset = 0;
while (true) {
	const { items } = await client.collections
		.queryCollections()
		.limit(100)
		.skip(offset)
		.find();
	for (const c of items) {
		if (c._id === ALL || c.name === "All Products") continue;
		cats.push({ id: c._id, name: c.name, slug: c.slug });
	}
	offset += items.length;
	if (items.length < 100) break;
}
console.log("categories", cats.length);

const slugs = ["islamic", "todays-deals", "best-sellers", "children-books"];
for (const slug of slugs) {
	const cat = cats.find((c) => c.slug === slug);
	if (!cat) {
		console.log(slug, "MISSING");
		continue;
	}
	const { items } = await client.products
		.queryProducts()
		.hasSome("collectionIds", [cat.id])
		.limit(12)
		.find();
	console.log(slug, "→", items.length, "products", items[0]?.name);
}
