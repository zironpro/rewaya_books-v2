import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import dbConnect from "@/lib/db/mongodb";
import { Product } from "@/lib/db/models/Product";

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

export const maxDuration = 60; // Allow maximum execution time on Vercel
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
	const url = new URL(request.url);
	const action = url.searchParams.get("action");

	try {
		await dbConnect();

		if (action !== "run") {
			// Return a simple HTML page that auto-fetches batches until done
			const totalRemaining = await Product.countDocuments({
				coverImage: { $regex: /static\.wixstatic\.com/i },
			});
			
			const html = `
				<!DOCTYPE html>
				<html>
				<head>
					<title>Image Sync</title>
					<style>
						body { font-family: system-ui, sans-serif; padding: 40px; max-width: 600px; margin: 0 auto; background: #09090b; color: #fafafa; }
						.progress { background: #27272a; border-radius: 8px; padding: 20px; margin-top: 20px; }
						.bar { background: #3f3f46; height: 12px; border-radius: 6px; overflow: hidden; margin-bottom: 10px; }
						.fill { background: #3b82f6; height: 100%; width: 0%; transition: width 0.3s; }
						.log { font-family: monospace; background: #000; padding: 10px; border-radius: 6px; height: 200px; overflow-y: auto; font-size: 12px; color: #a1a1aa; }
					</style>
				</head>
				<body>
					<h2>Cloudinary Image Sync</h2>
					<p>Total remaining to sync: <b id="total">${totalRemaining}</b></p>
					<button id="startBtn" style="padding: 10px 20px; background: #fafafa; color: #000; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">Start Auto-Sync</button>
					
					<div class="progress" style="display: none;" id="progressContainer">
						<div class="bar"><div class="fill" id="fill"></div></div>
						<p id="status">Starting...</p>
						<div class="log" id="log"></div>
					</div>

					<script>
						const startBtn = document.getElementById("startBtn");
						const progressContainer = document.getElementById("progressContainer");
						const fill = document.getElementById("fill");
						const status = document.getElementById("status");
						const log = document.getElementById("log");
						
						let initialTotal = ${totalRemaining};

						function appendLog(msg) {
							log.innerHTML += '<div>' + msg + '</div>';
							log.scrollTop = log.scrollHeight;
						}

						async function runBatch() {
							try {
								appendLog("Processing batch of 20...");
								const res = await fetch("?action=run");
								const data = await res.json();
								
								if (data.error) throw new Error(data.error);
								
								const remaining = data.remaining;
								const processed = initialTotal - remaining;
								const percent = Math.min(100, Math.round((processed / initialTotal) * 100));
								
								fill.style.width = percent + "%";
								status.innerText = remaining + " products remaining...";
								appendLog("Batch success! Processed " + data.successCount + " (Failed: " + data.failedCount + ")");
								
								if (remaining > 0) {
									setTimeout(runBatch, 500); // slight pause before next batch
								} else {
									status.innerText = "Sync Complete!";
									fill.style.width = "100%";
									fill.style.background = "#22c55e";
									appendLog("All images have been successfully uploaded to Cloudinary!");
								}
							} catch (e) {
								status.innerText = "Error occurred. Auto-retrying in 3 seconds...";
								appendLog("<span style='color: #ef4444'>Error: " + e.message + "</span>");
								setTimeout(runBatch, 3000);
							}
						}

						startBtn.onclick = () => {
							startBtn.style.display = "none";
							progressContainer.style.display = "block";
							runBatch();
						};
					</script>
				</body>
				</html>
			`;
			return new NextResponse(html, { headers: { "Content-Type": "text/html" } });
		}

		// API Logic (action === "run")
		// Find products that still have Wix URLs (bumped batch size to 20 for speed)
		const batchSize = 20;
		const products = await Product.find({
			coverImage: { $regex: /static\.wixstatic\.com/i },
		}).limit(batchSize);

		if (products.length === 0) {
			return NextResponse.json({
				message: "No products found with Wix URLs. All images are synced!",
				processed: 0,
				remaining: 0
			});
		}

		let successCount = 0;
		let failedCount = 0;

		for (const product of products) {
			const imageUrl = product.coverImage;
			
			if (imageUrl && !imageUrl.includes("placeholder.com")) {
				try {
					const result = await cloudinary.uploader.upload(imageUrl, {
						folder: "rewaya_books",
						format: "webp",
					});
					
					product.coverImage = result.secure_url;
					if (product.images && product.images.length > 0) {
						product.images = [result.secure_url];
					}
					await product.save();
					successCount++;
				} catch (uploadError) {
					product.coverImage = "";
					if (product.images && product.images.length > 0) {
						product.images = [];
					}
					await product.save();
					failedCount++;
				}
			} else {
				product.coverImage = "";
				if (product.images && product.images.length > 0) {
					product.images = [];
				}
				await product.save();
				successCount++;
			}
		}

		const remaining = await Product.countDocuments({
			coverImage: { $regex: /static\.wixstatic\.com/i },
		});

		return NextResponse.json({
			message: `Batch complete.`,
			successCount,
			failedCount,
			remaining,
		});

	} catch (error: any) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}
