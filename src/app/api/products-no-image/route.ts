import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongodb";
import { Product } from "@/lib/db/models/Product";

export async function GET() {
	try {
		await dbConnect();

		// Find products where coverImage is missing, null, or empty string
		const products = await Product.find({
			$or: [
				{ coverImage: { $exists: false } },
				{ coverImage: null },
				{ coverImage: "" },
			],
		}).select("title slug coverImage images price");

		return NextResponse.json({
			message: "Successfully fetched products without images",
			count: products.length,
			products,
		});
	} catch (error) {
		console.error("Error fetching products without images:", error);
		return NextResponse.json(
			{ error: "Failed to fetch products without images" },
			{ status: 500 }
		);
	}
}
