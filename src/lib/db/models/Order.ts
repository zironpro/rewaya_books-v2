import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: false,
		}, // optional for guest checkout
		email: { type: String, required: true },
		status: {
			type: String,
			enum: ["PENDING", "SHIPPED", "DELIVERED", "CANCELLED"],
			default: "PENDING",
		},
		items: [
			{
				productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
				bundleId: { type: mongoose.Schema.Types.ObjectId, ref: "Bundle" },
				title: { type: String, required: true },
				price: { type: Number, required: true },
				quantity: { type: Number, required: true },
			},
		],
		total: { type: Number, required: true },
		shippingCost: { type: Number, default: 0 },
		taxAmount: { type: Number, default: 0 },
		couponCode: { type: String },
		discountAmount: { type: Number, default: 0 },
		paymentMethod: { type: String, enum: ["COD", "Stripe"], default: "Stripe" },
		shippingMethod: {
			type: String,
			enum: ["standard", "express"],
			default: "standard",
		},
		isPaid: { type: Boolean, default: false },
		stripeTransactionId: { type: String },
		invoiceUrl: { type: String },
		invoiceNumber: { type: String },
		shippingAddress: {
			firstName: { type: String, required: true },
			lastName: { type: String, required: true },
			addressLine1: { type: String, required: true },
			addressLine2: { type: String },
			city: { type: String, required: true },
			state: { type: String, required: true },
			postalCode: { type: String, required: true },
			country: { type: String, required: true },
			phone: { type: String },
		},
		deliveredAt: { type: Date },
	},
	{ timestamps: true }
);

export const Order =
	mongoose.models.Order || mongoose.model("Order", OrderSchema);
