const fs = require("fs");
const path = require("path");

const directories = [
	"./src/app/admin",
	"./src/features/admin",
	"./src/components",
];

// Features that were migrated from rewaya-admin
const migratedFeatures = [
	"analytics",
	"bundles",
	"catalog",
	"cms",
	"customers",
	"dashboard",
	"orders", // wait, orders was already there, but we overwrote it or merged it
	"shipping",
	"taxes",
];

function replaceInFile(filePath) {
	const ext = path.extname(filePath);
	if (![".tsx", ".ts"].includes(ext)) return;

	let content = fs.readFileSync(filePath, "utf8");
	let changed = false;

	for (const feature of migratedFeatures) {
		const regex = new RegExp(`@/features/${feature}`, "g");
		if (regex.test(content)) {
			content = content.replace(regex, `@/features/admin/${feature}`);
			changed = true;
		}
	}

	if (changed) {
		fs.writeFileSync(filePath, content, "utf8");
		console.log("Updated:", filePath);
	}
}

function walkDir(dir) {
	if (!fs.existsSync(dir)) return;
	const files = fs.readdirSync(dir);
	for (const file of files) {
		const fullPath = path.join(dir, file);
		if (fs.statSync(fullPath).isDirectory()) {
			walkDir(fullPath);
		} else {
			replaceInFile(fullPath);
		}
	}
}

directories.forEach(walkDir);
console.log("Done!");
