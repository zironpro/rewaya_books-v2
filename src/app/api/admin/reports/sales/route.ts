import { NextRequest, NextResponse } from "next/server";

import PDFDocument from "pdfkit";

import { Order } from "@/lib/db/models/Order";
import connectToDatabase from "@/lib/db/mongodb";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
	try {
		await connectToDatabase();

		const { searchParams } = new URL(req.url);
		const startDateParam = searchParams.get("startDate");
		const endDateParam = searchParams.get("endDate");

		if (!startDateParam || !endDateParam) {
			return NextResponse.json(
				{ error: "startDate and endDate are required" },
				{ status: 400 }
			);
		}

		const startDate = new Date(startDateParam);
		const endDate = new Date(endDateParam);

		// Set end date to end of day
		endDate.setHours(23, 59, 59, 999);

		const orders = await Order.find({
			createdAt: {
				$gte: startDate,
				$lte: endDate,
			},
		}).sort({ createdAt: 1 });

		// Calculate Totals
		let totalRevenue = 0;
		let totalShipping = 0;
		let totalTaxes = 0;
		let totalDiscounts = 0;

		let totalCompleted = 0;
		let totalPending = 0;
		let totalShipped = 0;

		orders.forEach((o) => {
			totalRevenue += o.total || 0;
			totalShipping += o.shippingCost || 0;
			totalTaxes += o.taxAmount || 0;
			totalDiscounts += o.discountAmount || 0;

			if (o.status === "DELIVERED") totalCompleted++;
			else if (o.status === "PENDING") totalPending++;
			else if (o.status === "SHIPPED") totalShipped++;
		});

		// Create PDF
		const doc = new PDFDocument({ margin: 50, size: "A4" });

		// Collect PDF chunks
		const chunks: Uint8Array[] = [];
		doc.on("data", (chunk) => chunks.push(chunk));

		// End promise to return the final buffer
		const pdfPromise = new Promise<Buffer>((resolve) => {
			doc.on("end", () => resolve(Buffer.concat(chunks)));
		});

		// Render Header
		doc.fontSize(20).font("Helvetica-Bold").text("Sales Report");
		doc
			.fontSize(12)
			.font("Helvetica")
			.text(
				`Period: ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}`
			);
		doc.moveDown(2);

		// Render Summary
		doc
			.fontSize(14)
			.font("Helvetica-Bold")
			.text("Summary", { underline: true });
		doc.moveDown(0.5);
		doc.fontSize(10).font("Helvetica");
		doc.text(`Total Orders: ${orders.length}`);
		doc.text(`Total Completed: ${totalCompleted}`);
		doc.text(`Total Shipped: ${totalShipped}`);
		doc.text(`Total Pending: ${totalPending}`);
		doc.text(`Total Revenue: AED ${totalRevenue.toFixed(2)}`);
		doc.text(`Total Shipping: AED ${totalShipping.toFixed(2)}`);
		doc.text(`Total Discounts: AED ${totalDiscounts.toFixed(2)}`);
		doc.moveDown(2);

		// Render Table Header
		doc
			.fontSize(12)
			.font("Helvetica-Bold")
			.text("Order Details", { underline: true });
		doc.moveDown(1);

		const tableTop = doc.y;
		doc.fontSize(10).font("Helvetica-Bold");
		doc.text("Date", 50, tableTop);
		doc.text("Order ID", 150, tableTop);
		doc.text("Customer", 250, tableTop);
		doc.text("Status", 400, tableTop);
		doc.text("Total", 480, tableTop, { align: "right", width: 60 });

		doc
			.moveTo(50, tableTop + 15)
			.lineTo(540, tableTop + 15)
			.stroke();

		let y = tableTop + 25;
		doc.font("Helvetica");

		// Render Orders
		orders.forEach((order) => {
			if (y > 750) {
				doc.addPage();
				y = 50;
			}
			const dateStr = order.createdAt
				? new Date(order.createdAt).toLocaleDateString()
				: "Unknown";
			const orderIdStr = order._id
				? order._id.toString().slice(-6).toUpperCase()
				: "N/A";
			const customerName = order.shippingAddress?.firstName
				? `${order.shippingAddress.firstName} ${order.shippingAddress.lastName || ""}`
				: order.email;

			doc.text(dateStr, 50, y);
			doc.text(orderIdStr, 150, y);
			doc.text(customerName.slice(0, 25), 250, y);
			doc.text(order.status, 400, y);
			doc.text(`AED ${(order.total || 0).toFixed(2)}`, 480, y, {
				align: "right",
				width: 60,
			});

			y += 20;
		});

		doc.end();

		const pdfBuffer = await pdfPromise;

		return new NextResponse(pdfBuffer, {
			status: 200,
			headers: {
				"Content-Type": "application/pdf",
				"Content-Disposition": `attachment; filename="sales_report_${startDate.toISOString().split("T")[0]}_${endDate.toISOString().split("T")[0]}.pdf"`,
			},
		});
	} catch (error) {
		console.error("Sales report generation error:", error);
		return NextResponse.json(
			{ error: "Failed to generate report" },
			{ status: 500 }
		);
	}
}
