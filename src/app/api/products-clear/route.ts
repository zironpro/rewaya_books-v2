import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import dbConnect from "@/lib/db/mongodb";
import { Product } from "@/lib/db/models/Product";

// Initialize Cloudinary config
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

async function clearCloudinaryFolder() {
	try {
		console.log("Fetching images from Cloudinary folder 'rewaya_books'...");
		let next_cursor = null;
		let count = 0;

		do {
			const result = await cloudinary.api.resources({
				type: "upload",
				prefix: "rewaya_books/",
				max_results: 500,
				next_cursor: next_cursor,
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
		return count;
	} catch (error) {
		console.error("Error clearing Cloudinary folder:", error);
		throw error;
	}
}

export async function GET() {
	try {
		await dbConnect();

		console.log("Clearing existing products...");
		const deletedProducts = await Product.deleteMany({});
		console.log(`Products cleared: ${deletedProducts.deletedCount}`);

		console.log("Clearing Cloudinary images...");
		const deletedImagesCount = await clearCloudinaryFolder();

		return NextResponse.json({
			message: "Successfully cleared products and images.",
			deletedProducts: deletedProducts.deletedCount,
			deletedImages: deletedImagesCount,
		});
	} catch (error) {
		console.error("Error clearing products and images:", error);
		return NextResponse.json(
			{ error: "Failed to clear products and images" },
			{ status: 500 }
		);
	}
}
