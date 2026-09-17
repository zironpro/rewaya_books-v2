import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db/mongodb";
import { Subscriber } from "@/lib/db/models/Subscriber";

export async function GET(req: Request) {
	const { searchParams } = new URL(req.url);
	const email = searchParams.get("email");

	if (!email) {
		return new NextResponse("Invalid request", { status: 400 });
	}

	try {
		await connectToDatabase();
		const subscriber = await Subscriber.findOneAndUpdate(
			{ email: email.toLowerCase() },
			{ status: "unsubscribed" }
		);

		return new NextResponse(
			`
			<html>
				<head>
					<title>Unsubscribed</title>
					<style>
						body { font-family: sans-serif; text-align: center; padding: 50px; background: #fafafa; }
						.card { background: white; padding: 40px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); max-width: 400px; margin: 0 auto; }
					</style>
				</head>
				<body>
					<div class="card">
						<h2>You've been unsubscribed.</h2>
						<p>You will no longer receive marketing emails from Rewaya Books.</p>
						<br/>
						<a href="/" style="color: #007bff; text-decoration: none;">Return to Store</a>
					</div>
				</body>
			</html>
			`,
			{
				status: 200,
				headers: { "Content-Type": "text/html" },
			}
		);
	} catch (error) {
		console.error("Unsubscribe error:", error);
		return new NextResponse("Internal Server Error", { status: 500 });
	}
}
