import mongoose from "mongoose";

const RefundRequestSchema = new mongoose.Schema(
	{
		orderId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Order",
			required: true,
		},
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: false,
		}, // Optional for guest checkout
		reason: { type: String, required: true },
		status: {
			type: String,
			enum: ["PENDING", "ACCEPTED", "REJECTED", "REFUNDED"],
			default: "PENDING",
		},
		adminNotes: { type: String },
		stripeRefundId: { type: String },
	},
	{ timestamps: true }
);

export const RefundRequest =
	mongoose.models.RefundRequest ||
	mongoose.model("RefundRequest", RefundRequestSchema);
