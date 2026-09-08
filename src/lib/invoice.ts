import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";
import PDFDocument from "pdfkit";
import SVGtoPDF from "svg-to-pdfkit";

// Cloudinary is automatically configured if CLOUDINARY_URL is in the environment
cloudinary.config({
	secure: true,
});

export async function generateAndUploadInvoice(
	order: any
): Promise<{ url: string; invoiceNumber: string }> {
	return new Promise((resolve, reject) => {
		const doc = new PDFDocument({ margin: 50, size: "A4" });

		const orderIdStr = order._id
			? order._id.toString()
			: order.id?.toString() || "UNKNOWN";
		const invoiceNumber = `INV-${orderIdStr.slice(-6).toUpperCase()}-${Date.now().toString().slice(-4)}`;

		const uploadStream = cloudinary.uploader.upload_stream(
			{
				folder: "rewaya/invoices",
				public_id: invoiceNumber,
				resource_type: "image", // Cloudinary restricts raw by default, but allows PDFs as image
				format: "pdf",
			},
			(error, result) => {
				if (error) return reject(error);
				if (result) {
					resolve({ url: result.secure_url, invoiceNumber });
				} else {
					reject(new Error("No result from Cloudinary"));
				}
			}
		);

		doc.pipe(uploadStream);

		// --- BUILD PDF CONTENT ---
		const startY = 50;

		// Logo
		try {
			const logoPath = path.join(process.cwd(), "public", "rewaya-logo.svg");
			const svgContent = fs.readFileSync(logoPath, "utf8");
			SVGtoPDF(doc, svgContent, 50, startY, { width: 120 });
		} catch (e) {
			console.error("Failed to load SVG logo:", e);
			doc
				.fillColor("#000000")
				.fontSize(18)
				.font("Helvetica-Bold")
				.text("REWAYA BOOKS", 50, startY + 10);
		}

		// Invoice Title & Date
		doc
			.fillColor("#000000")
			.fontSize(28)
			.font("Helvetica-Bold")
			.text("INVOICE", 350, startY, { width: 195, align: "right" });
		doc
			.fontSize(9)
			.font("Helvetica-Bold")
			.text(
				`DATE. ${new Date().toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" }).replace(/\//g, ".")}`,
				350,
				startY + 30,
				{ width: 195, align: "right" }
			);

		// Gray Box for Addresses
		const boxY = startY + 70;
		doc.rect(50, boxY, 495, 140).fill("#F4F4F4");

		doc.fillColor("#000000").fontSize(9).font("Helvetica-Bold");
		doc.text("INVOICE TO", 70, boxY + 20);
		doc.text("SHIP TO", 300, boxY + 20);

		let name = "Customer";
		let addressText = "";
		let phone = "";

		if (order.shippingAddress) {
			name =
				`${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`.toUpperCase();
			addressText = `${order.shippingAddress.addressLine1}\n`;
			if (order.shippingAddress.addressLine2)
				addressText += `${order.shippingAddress.addressLine2}\n`;
			addressText += `${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postalCode}\n`;
			addressText += `${order.shippingAddress.country}`;
			if (order.shippingAddress.phone) phone = order.shippingAddress.phone;
		}

		doc
			.font("Helvetica-Bold")
			.fontSize(10)
			.text(name, 70, boxY + 40);
		doc
			.font("Helvetica")
			.fillColor("#666666")
			.fontSize(9)
			.text(addressText, 70, boxY + 55, { width: 200, lineGap: 2 });
		if (phone) doc.text(phone, 70, doc.y + 5);

		doc
			.fillColor("#000000")
			.font("Helvetica-Bold")
			.fontSize(10)
			.text(name, 300, boxY + 40);
		doc
			.font("Helvetica")
			.fillColor("#666666")
			.fontSize(9)
			.text(addressText, 300, boxY + 55, { width: 200, lineGap: 2 });
		if (phone) doc.text(phone, 300, doc.y + 5);

		// Date & Invoice No Row
		let currentY = boxY + 160;
		doc.fillColor("#666666").font("Helvetica").fontSize(9);
		const formattedDate = new Date()
			.toLocaleDateString("en-US", {
				day: "numeric",
				month: "long",
				year: "numeric",
			})
			.toUpperCase();
		doc.text(`DATE: ${formattedDate}`, 50, currentY);

		doc
			.fillColor("#000000")
			.font("Helvetica-Bold")
			.text(`INVOICE NO: ${invoiceNumber}`, 350, currentY, {
				width: 195,
				align: "right",
			});

		// Table Header
		currentY += 20;
		doc
			.moveTo(50, currentY)
			.lineTo(545, currentY)
			.lineWidth(1)
			.strokeColor("#000000")
			.stroke();
		currentY += 10;

		doc.font("Helvetica-Bold").fontSize(8);
		doc.text("NO", 50, currentY);
		doc.text("ITEM DESCRIPTION", 80, currentY);
		doc.text("PRICE", 330, currentY, { width: 60, align: "right" });
		doc.text("QUANTITY", 400, currentY, { width: 60, align: "center" });
		doc.text("TOTAL", 475, currentY, { width: 70, align: "right" });

		currentY += 15;
		doc
			.moveTo(50, currentY)
			.lineTo(545, currentY)
			.lineWidth(0.5)
			.strokeColor("#DDDDDD")
			.stroke();
		currentY += 15;

		// Table Rows
		doc.font("Helvetica").fillColor("#666666").fontSize(9);
		order.items.forEach((item: any, index: number) => {
			doc.text(`${index + 1}.`, 50, currentY);
			doc.text(item.title, 80, currentY, { width: 230 });

			const titleHeight = doc.heightOfString(item.title, { width: 230 });

			doc.text(`AED ${item.price.toFixed(2)}`, 330, currentY, {
				width: 60,
				align: "right",
			});
			doc.text(item.quantity.toString(), 400, currentY, {
				width: 60,
				align: "center",
			});
			doc.text(
				`AED ${(item.price * item.quantity).toFixed(2)}`,
				475,
				currentY,
				{ width: 70, align: "right" }
			);

			currentY += Math.max(titleHeight, 15) + 10;
			doc
				.moveTo(50, currentY)
				.lineTo(545, currentY)
				.lineWidth(0.5)
				.strokeColor("#EEEEEE")
				.stroke();
			currentY += 15;
		});

		// Totals and Due
		let preSummaryY = currentY;
		const summaryX = 330;
		const summaryW = 215;
		const subtotal =
			order.total -
			(order.shippingCost || 0) -
			(order.taxAmount || 0) +
			(order.discountAmount || 0);

		// Right side (Totals)
		doc.fillColor("#000000").font("Helvetica-Bold").fontSize(9);
		doc.text("SUBTOTAL:", summaryX, currentY);
		doc
			.font("Helvetica")
			.text(`AED ${subtotal.toFixed(2)}`, summaryX + 70, currentY, {
				width: summaryW - 70,
				align: "right",
			});
		currentY += 15;

		if (order.discountAmount) {
			doc.font("Helvetica-Bold").text("DISCOUNT:", summaryX, currentY);
			doc
				.font("Helvetica")
				.text(
					`-AED ${order.discountAmount.toFixed(2)}`,
					summaryX + 70,
					currentY,
					{ width: summaryW - 70, align: "right" }
				);
			currentY += 15;
		}

		if (order.shippingCost !== undefined && order.shippingCost !== null) {
			doc.font("Helvetica-Bold").text("SHIPPING:", summaryX, currentY);
			doc
				.font("Helvetica")
				.text(`AED ${order.shippingCost.toFixed(2)}`, summaryX + 70, currentY, {
					width: summaryW - 70,
					align: "right",
				});
			currentY += 15;
		}

		if (order.taxAmount) {
			doc.font("Helvetica-Bold").text("TAX:", summaryX, currentY);
			doc
				.font("Helvetica")
				.text(`AED ${order.taxAmount.toFixed(2)}`, summaryX + 70, currentY, {
					width: summaryW - 70,
					align: "right",
				});
			currentY += 15;
		}

		currentY += 5;
		doc
			.moveTo(summaryX, currentY)
			.lineTo(545, currentY)
			.lineWidth(0.5)
			.strokeColor("#CCCCCC")
			.stroke();
		currentY += 10;

		doc.font("Helvetica-Bold");
		doc.text("GRAND TOTAL:", summaryX, currentY);
		doc.text(`AED ${order.total.toFixed(2)}`, summaryX + 80, currentY, {
			width: summaryW - 80,
			align: "right",
		});

		// Left side (Total Due)
		doc
			.fillColor("#000000")
			.font("Helvetica-Bold")
			.fontSize(10)
			.text("TOTAL", 50, preSummaryY);
		doc.rect(50, preSummaryY + 15, 180, 45).fill("#FAFAFA");
		doc
			.fillColor("#000000")
			.font("Helvetica")
			.fontSize(18)
			.text(`AED ${order.total.toFixed(2)}`, 65, preSummaryY + 28);

		// Bottom Section
		currentY = Math.max(currentY + 40, preSummaryY + 90);

		doc.fontSize(10).font("Helvetica-Bold").text("Payment Info:", 50, currentY);
		doc.font("Helvetica").fillColor("#666666").fontSize(9);

		let paymentInfoText = `Method: ${order.paymentMethod === "stripe" ? "Credit Card (Stripe)" : "Cash on Delivery"}\n`;
		if (order.isPaid) {
			paymentInfoText += "Status: Paid\n";
		}
		if (order.stripeTransactionId) {
			paymentInfoText += `Transaction ID: ${order.stripeTransactionId}`;
		}
		doc.text(paymentInfoText, 50, currentY + 15, { width: 250, lineGap: 3 });

		// Authorization
		doc
			.fillColor("#000000")
			.font("Helvetica-Bold")
			.fontSize(10)
			.text("AUTHORIZATION", 350, currentY);
		doc.font("Helvetica").fillColor("#666666").fontSize(9);
		doc.text("This is a computer generated invoice.", 350, currentY + 15);
		doc.text("No physical signature is required.", 350, currentY + 28);

		// Footer
		doc
			.fillColor("#000000")
			.font("Helvetica-Bold")
			.fontSize(10)
			.text("Questions?", 50, 740);
		doc.font("Helvetica").fillColor("#666666").fontSize(9);
		doc.text("Email us at accounts@alrewaya.com", 50, 755);

		doc.fillColor("#999999").fontSize(8);
		doc.text(
			"Rewaya Books • Ajman Jurf 2, Shahba Complex Block A Shop No. 6, Opposite Habitat School • Ajman, UAE",
			50,
			780
		);

		doc.end();
	});
}
