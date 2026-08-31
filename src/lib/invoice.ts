import PDFDocument from "pdfkit";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";
import SVGtoPDF from "svg-to-pdfkit";

// Cloudinary is automatically configured if CLOUDINARY_URL is in the environment
cloudinary.config({
	secure: true,
});

export async function generateAndUploadInvoice(
	order: any
): Promise<{ url: string; invoiceNumber: string }> {
	return new Promise((resolve, reject) => {
		const doc = new PDFDocument({ margin: 50 });

		const orderIdStr = order._id ? order._id.toString() : order.id?.toString() || "UNKNOWN";
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

		// Pipe the PDF document directly to Cloudinary
		doc.pipe(uploadStream);

		// --- BUILD PDF CONTENT ---

		// Header
		doc.fontSize(24).font("Helvetica-Bold").text("INVOICE", { align: "right" });
		doc.moveDown(0.5);

		// Company Info (Left) & Invoice Info (Right)
		const startY = doc.y;

		try {
			const logoPath = path.join(process.cwd(), "public", "rewaya-logo.svg");
			const svgContent = fs.readFileSync(logoPath, "utf8");
			SVGtoPDF(doc, svgContent, 50, startY - 10, { width: 120 });
		} catch (e) {
			console.error("Failed to load SVG logo:", e);
			doc.fontSize(16).font("Helvetica-Bold").text("Rewaya Books", 50, startY);
		}

		doc.fontSize(10).font("Helvetica").text("Ajman Jurf 2, Shahba Complex Block A Shop No. 6,", 50, startY + 25);
		doc.text("Opposite Habitat School", 50, startY + 40);
		doc.text("Ajman, United Arab Emirates", 50, startY + 55);
		doc.text("Email: accounts@alrewaya.com", 50, startY + 70);

		doc.text(`Invoice Number: ${invoiceNumber}`, 350, startY, { width: 200, align: "right" });
		doc.text(`Order ID: ${orderIdStr}`, 350, startY + 15, { width: 200, align: "right" });
		doc.text(`Date: ${new Date().toLocaleDateString()}`, 350, startY + 30, { width: 200, align: "right" });
		
		// Move cursor below the absolute positioned text
		doc.y = startY + 110;

		// Bill To
		doc.fontSize(12).font("Helvetica-Bold").text("Bill To:", 50, doc.y);
		doc.fontSize(10).font("Helvetica");
		if (order.shippingAddress) {
			doc.text(`${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`);
			doc.text(`${order.shippingAddress.addressLine1}`);
			if (order.shippingAddress.addressLine2) {
				doc.text(`${order.shippingAddress.addressLine2}`);
			}
			doc.text(`${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postalCode}`);
			doc.text(`${order.shippingAddress.country}`);
			if (order.shippingAddress.phone) {
				doc.text(`Phone: ${order.shippingAddress.phone}`);
			}
		}
		doc.text(`Email: ${order.email}`);
		doc.moveDown(2);

		// Table Header
		doc.font("Helvetica-Bold");
		doc.text("Item", 50, doc.y);
		doc.text("Qty", 350, doc.y, { width: 50, align: "center" });
		doc.text("Price", 400, doc.y, { width: 60, align: "right" });
		doc.text("Total", 470, doc.y, { width: 70, align: "right" });
		
		doc.moveDown(0.5);
		doc.moveTo(50, doc.y).lineTo(540, doc.y).stroke();
		doc.moveDown(0.5);

		// Table Rows
		doc.font("Helvetica");
		let y = doc.y;
		order.items.forEach((item: any) => {
			doc.text(item.title, 50, y, { width: 290 });
			doc.text(item.quantity.toString(), 350, y, { width: 50, align: "center" });
			doc.text(`AED ${item.price.toFixed(2)}`, 400, y, { width: 60, align: "right" });
			doc.text(`AED ${(item.price * item.quantity).toFixed(2)}`, 470, y, { width: 70, align: "right" });
			y += 20;
		});

		doc.y = y;
		doc.moveDown(1);
		doc.moveTo(350, doc.y).lineTo(540, doc.y).stroke();
		doc.moveDown(1);

		// Totals
		const summaryX = 350;
		const summaryW = 190;
		let summaryY = doc.y;

		const subtotal = order.total - (order.shippingCost || 0) - (order.taxAmount || 0) + (order.discountAmount || 0);
		doc.text("Subtotal:", summaryX, summaryY);
		doc.text(`AED ${subtotal.toFixed(2)}`, summaryX, summaryY, { width: summaryW, align: "right" });
		summaryY += 15;

		if (order.discountAmount) {
			doc.text(`Discount:`, summaryX, summaryY);
			doc.text(`-AED ${order.discountAmount.toFixed(2)}`, summaryX, summaryY, { width: summaryW, align: "right" });
			summaryY += 15;
		}

		if (order.shippingCost !== undefined && order.shippingCost !== null) {
			const shippingMethod = order.shippingMethod === "express" ? "Express Shipping" : "Standard Shipping";
			doc.text(`${shippingMethod}:`, summaryX, summaryY);
			doc.text(`AED ${order.shippingCost.toFixed(2)}`, summaryX, summaryY, { width: summaryW, align: "right" });
			summaryY += 15;
		}
		
		if (order.taxAmount) {
			doc.text(`Tax:`, summaryX, summaryY);
			doc.text(`AED ${order.taxAmount.toFixed(2)}`, summaryX, summaryY, { width: summaryW, align: "right" });
			summaryY += 15;
		}

		doc.moveDown(0.5);
		summaryY += 5;
		doc.moveTo(350, summaryY).lineTo(540, summaryY).stroke();
		summaryY += 10;

		doc.font("Helvetica-Bold");
		doc.text("Total:", summaryX, summaryY);
		doc.text(`AED ${order.total.toFixed(2)}`, summaryX, summaryY, { width: summaryW, align: "right" });

		// Footer
		doc.fontSize(10).font("Helvetica").text("Thank you for your business!", 50, 700, { align: "center" });

		// Finalize PDF file
		doc.end();
	});
}
