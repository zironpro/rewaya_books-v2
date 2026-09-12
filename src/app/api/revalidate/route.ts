import { revalidatePath } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

// Secret token to protect this endpoint.
// Set REVALIDATE_SECRET in your environment variables (Vercel, .env.local, etc.)
const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET;

export async function POST(req: NextRequest) {
	// Require secret token if one is configured
	if (REVALIDATE_SECRET) {
		const authHeader = req.headers.get("authorization");
		const token = authHeader?.replace("Bearer ", "");
		if (token !== REVALIDATE_SECRET) {
			return NextResponse.json(
				{ error: "Unauthorized" },
				{ status: 401 }
			);
		}
	}

	// Revalidate all public-facing product pages
	revalidatePath("/", "layout");   // busts home + layout for all pages
	revalidatePath("/shop", "page");
	revalidatePath("/bundles", "page");

	return NextResponse.json({
		revalidated: true,
		timestamp: new Date().toISOString(),
	});
}

// Also allow GET for easy manual triggering with a secret query param
// e.g. /api/revalidate?secret=your-secret
export async function GET(req: NextRequest) {
	const secret = req.nextUrl.searchParams.get("secret");

	if (REVALIDATE_SECRET && secret !== REVALIDATE_SECRET) {
		return NextResponse.json(
			{ error: "Unauthorized" },
			{ status: 401 }
		);
	}

	revalidatePath("/", "layout");
	revalidatePath("/shop", "page");
	revalidatePath("/bundles", "page");

	return NextResponse.json({
		revalidated: true,
		timestamp: new Date().toISOString(),
	});
}
