import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOrderConfirmationEmail(order: any, customerEmail: string) {
	if (!process.env.RESEND_API_KEY) {
		console.warn("RESEND_API_KEY is not set. Skipping order confirmation email.");
		return;
	}

	const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
	
	try {
		const orderId = order._id.toString();
		const itemsHtml = order.items
			.map(
				(item: any) => `
			<tr>
				<td style="padding: 10px; border-bottom: 1px solid #eaeaea;">${item.title} x ${item.quantity}</td>
				<td style="padding: 10px; border-bottom: 1px solid #eaeaea; text-align: right;">${item.price.toFixed(2)} AED</td>
			</tr>
		`
			)
			.join("");

		const html = `
			<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
				<div style="text-align: center; margin-bottom: 20px;">
					<img src="https://rewayabooks.com/logo-website.png" alt="Rewaya Books Logo" style="max-width: 150px; height: auto;" />
				</div>
				<h1 style="color: #000; text-align: center;">Order Confirmation</h1>
				<p>Hello,</p>
				<p>Thank you for your order! We've received your order and are getting it ready.</p>
				
				<div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
					<h2 style="margin-top: 0;">Order #${orderId}</h2>
					<table style="width: 100%; border-collapse: collapse;">
						${itemsHtml}
					</table>
					
					<div style="margin-top: 20px; text-align: right; font-weight: bold;">
						<p>Shipping: ${order.shippingCost.toFixed(2)} AED</p>
						<p>Tax: ${order.taxAmount.toFixed(2)} AED</p>
						${order.discountAmount > 0 ? `<p>Discount: -${order.discountAmount.toFixed(2)} AED</p>` : ""}
						<p style="font-size: 1.2em;">Total: ${order.total.toFixed(2)} AED</p>
					</div>
				</div>
				
				<p>We'll send you another email when your order ships.</p>
				<p>Thanks,<br/>The Rewaya Team</p>
			</div>
		`;

		const { data, error } = await resend.emails.send({
			from: `Rewaya Orders <${fromEmail}>`,
			to: customerEmail,
			subject: `Order Confirmation - Order #${orderId}`,
			html,
		});

		if (error) {
			console.error("Error sending order confirmation email:", error);
			return null;
		}

		console.log("Order confirmation email sent successfully", data);
		return data;
	} catch (error) {
		console.error("Failed to send order confirmation email:", error);
		return null;
	}
}
