import fs from "fs";
import path from "path";
import Papa from "papaparse";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

// Load environments
dotenv.config({ path: ".env" });
dotenv.config({ path: ".env.local" }); // override with local

// Cloudinary config
if (process.env.CLOUDINARY_URL) {
	const match = process.env.CLOUDINARY_URL.match(
		/cloudinary:\/\/([^:]+):([^@]+)@(.+)/
	);
	if (match) {
		cloudinary.config({
			api_key: match[1],
			api_secret: match[2],
			cloud_name: match[3],
			secure: true,
		});
	}
}

// Ensure DB URL
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
	console.error("MONGODB_URI is not defined");
	process.exit(1);
}

// Schemas
const ProductSchema = new mongoose.Schema(
	{
		title: { type: String, required: true },
		slug: { type: String, required: true, unique: true },
		author: { type: String },
		description: { type: String },
		price: { type: Number, required: true },
		originalPrice: { type: Number },
		stock: { type: Number, default: 0 },
		coverImage: { type: String },
		images: [{ type: String }],
		categoryId: { type: String },
		categorySlug: { type: String },
		categoryName: { type: String },
		isbn: { type: String },
		pages: { type: Number },
		language: { type: String },
		format: { type: String },
		ribbon: { type: String },
		publisher: { type: String },
		sortOrder: { type: Number, default: 0 },
	},
	{ timestamps: true }
);

const CategorySchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		slug: { type: String, required: true, unique: true },
		description: { type: String },
		image: { type: String },
		parentCategory: { type: String },
		isActive: { type: Boolean, default: true },
		sortOrder: { type: Number, default: 0 },
	},
	{ timestamps: true }
);

const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);
const Category = mongoose.models.Category || mongoose.model("Category", CategorySchema);

function slugify(text: string) {
	let slug = text
		.toString()
		.toLowerCase()
		.replace(/\s+/g, "-") // Replace spaces with -
		.replace(/[^\p{L}\p{N}\-]+/gu, "") // Keep letters, numbers, and hyphens (supports Arabic/Unicode)
		.replace(/\-\-+/g, "-") // Replace multiple - with single -
		.replace(/^-+/, "") // Trim - from start of text
		.replace(/-+$/, ""); // Trim - from end of text
        
    if (!slug) {
        slug = "product-" + Date.now().toString(36) + Math.random().toString(36).substring(2, 5);
    }
    return slug;
}

async function uploadImageToCloudinary(imageUrl: string): Promise<string | null> {
    if (!imageUrl) return null;
    
    // Some wix image urls are already full URLs, some are just filenames
    const fullUrl = imageUrl.startsWith('http') ? imageUrl : `https://static.wixstatic.com/media/${imageUrl}`;
    
    try {
        console.log(`Downloading and uploading image: ${fullUrl}`);
        const result = await cloudinary.uploader.upload(fullUrl, {
            folder: "rewaya_books",
            format: "webp",
        });
        return result.secure_url;
    } catch (error) {
        console.error(`Failed to upload image ${fullUrl}:`, error);
        return null;
    }
}

async function clearCloudinaryFolder() {
    try {
        console.log("Fetching images from Cloudinary folder 'rewaya_books'...");
        let next_cursor = null;
        let count = 0;
        
        do {
            const result = await cloudinary.api.resources({
                type: 'upload',
                prefix: 'rewaya_books/',
                max_results: 500,
                next_cursor: next_cursor
            });
            
            const publicIds = result.resources.map((r: any) => r.public_id);
            if (publicIds.length > 0) {
                console.log(`Deleting ${publicIds.length} images...`);
                await cloudinary.api.delete_resources(publicIds);
                count += publicIds.length;
            }
            
            next_cursor = result.next_cursor;
        } while (next_cursor);
        
        console.log(`Successfully deleted ${count} images from Cloudinary.`);
    } catch (error) {
        console.error("Error clearing Cloudinary folder:", error);
    }
}

async function main() {
	try {
		console.log("Connecting to MongoDB...");
		await mongoose.connect(MONGODB_URI as string);
		console.log("Connected.");

		// CLEAR EXISTING DATA
		console.log("Clearing existing products...");
		await Product.deleteMany({});
		console.log("Products cleared.");

        console.log("Clearing existing categories...");
		await Category.deleteMany({});
		console.log("Categories cleared.");

        // Clear Cloudinary
        await clearCloudinaryFolder();

		// READ CSV
		const csvFilePath = path.join(process.cwd(), "catalog_products (2).csv");
		const csvFileContent = fs.readFileSync(csvFilePath, "utf-8");

		const parsed = Papa.parse(csvFileContent, {
			header: true,
			skipEmptyLines: true,
		});

		const rows = parsed.data as any[];
		console.log(`Found ${rows.length} rows in CSV.`);

        const categoryCache = new Map<string, string>(); // slug -> name

		let count = 0;
		for (const row of rows) {
            // Only process actual products (skip variants or placeholders if fieldType is different)
            if (row.fieldType && row.fieldType.toLowerCase() !== 'product') {
                continue;
            }

            const name = row.name?.trim();
            if (!name) continue;

            const baseSlug = slugify(name);
            let slug = baseSlug;
            let slugCounter = 1;
            while (await Product.findOne({ slug })) {
                slug = `${baseSlug}-${slugCounter}`;
                slugCounter++;
            }

            const collectionName = row.collection?.trim() || 'Uncategorized';
            const categorySlug = slugify(collectionName);
            
            // Create category if it doesn't exist
            if (!categoryCache.has(categorySlug)) {
                let cat = await Category.findOne({ slug: categorySlug });
                if (!cat) {
                    cat = await Category.create({
                        name: collectionName,
                        slug: categorySlug,
                    });
                }
                categoryCache.set(categorySlug, collectionName);
            }

            // Extract extra info from additionalInfo columns
            let publisher = "";
            let author = "";
            let language = "";
            let format = "";
            
            // The CSV has additionalInfoTitle1, additionalInfoDescription1 etc.
            for (let i = 1; i <= 6; i++) {
                const title = row[`additionalInfoTitle${i}`]?.trim()?.toLowerCase();
                const desc = row[`additionalInfoDescription${i}`]?.trim();
                if (title && desc) {
                    if (title.includes("publisher")) publisher = desc;
                    else if (title.includes("author")) author = desc;
                    else if (title.includes("language")) language = desc;
                    else if (title.includes("format")) format = desc;
                }
            }

            // Upload image
            const imageUrl = row.productImageUrl?.trim();
            let coverImage = "";
            if (imageUrl) {
                // Upload or fallback to placeholder
                const uploadedUrl = await uploadImageToCloudinary(imageUrl);
                coverImage = uploadedUrl || `https://via.placeholder.com/400x600?text=${encodeURIComponent(name)}`;
            } else {
                coverImage = `https://via.placeholder.com/400x600?text=${encodeURIComponent(name)}`;
            }

            const newProduct = new Product({
                title: name,
                slug,
                description: row.description?.trim() || "",
                price: parseFloat(row.price) || 0,
                stock: parseInt(row.inventory) || 0,
                isbn: row.sku?.trim() || "",
                categoryName: collectionName,
                categorySlug: categorySlug,
                coverImage,
                images: coverImage ? [coverImage] : [],
                publisher,
                author,
                language,
                format,
                ribbon: row.ribbon?.trim() || "",
            });

            await newProduct.save();
            count++;
            console.log(`Imported ${count}: ${name}`);
		}

		console.log(`Successfully imported ${count} products.`);
		process.exit(0);
	} catch (error) {
		console.error("Error running import:", error);
		process.exit(1);
	}
}

main();
