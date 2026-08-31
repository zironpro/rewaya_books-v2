import { NextResponse } from "next/server";

import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary by explicitly parsing the URL (Next.js can hide env vars from packages)
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

export async function POST(request: Request) {
	try {
		const formData = await request.formData();
		const file = formData.get("file") as File | null;

		if (!file) {
			return NextResponse.json({ error: "No file provided" }, { status: 400 });
		}

		// Check if Cloudinary is configured
		if (!process.env.CLOUDINARY_URL) {
			return NextResponse.json(
				{ error: "Cloudinary credentials not configured" },
				{ status: 500 }
			);
		}

		const arrayBuffer = await file.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);

		// Upload to Cloudinary using a stream
		const result = await new Promise((resolve, reject) => {
			const uploadStream = cloudinary.uploader.upload_stream(
				{
					folder: "rewaya_books",
					format: "webp", // Force Cloudinary to convert and store the image as WebP
				},
				(error, result) => {
					if (error) reject(error);
					else resolve(result);
				}
			);

			uploadStream.end(buffer);
		});

		return NextResponse.json({ url: (result as any).secure_url });
	} catch (error) {
		console.error("Upload error:", error);
		return NextResponse.json({ error: "Upload failed" }, { status: 500 });
	}
}
