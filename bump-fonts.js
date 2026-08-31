const fs = require("fs");
const path = require("path");

const directories = ["./src/app/admin", "./src/features/admin"];

function bumpFontSizes(filePath) {
	const ext = path.extname(filePath);
	if (![".tsx", ".ts"].includes(ext)) return;

	let content = fs.readFileSync(filePath, "utf8");
	let changed = false;

	// Replace font size classes safely in one pass to prevent double-bumping
	const newContent = content.replace(
		/\btext-(xs|sm|base|lg)\b/g,
		(match, size) => {
			changed = true;
			switch (size) {
				case "xs":
					return "text-sm";
				case "sm":
					return "text-base";
				case "base":
					return "text-lg";
				case "lg":
					return "text-xl";
				default:
					return match;
			}
		}
	);

	if (changed && newContent !== content) {
		fs.writeFileSync(filePath, newContent, "utf8");
		console.log("Bumped fonts in:", filePath);
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
			bumpFontSizes(fullPath);
		}
	}
}

directories.forEach(walkDir);
console.log("Done!");
