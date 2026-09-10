import mongoose, { Schema } from "mongoose";

const couponSchema = new Schema(
	{
		code: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			uppercase: true,
		},
		discountType: {
			type: String,
			enum: ["percentage", "fixed"],
			required: true,
		},
		discountAmount: {
			type: Number,
			required: true,
			min: 0,
		},
		minPurchase: {
			type: Number,
			default: 0,
		},
		isFirstOrder: {
			type: Boolean,
			default: false,
		},
		maxUses: {
			type: Number,
			default: null,
		},
		usedCount: {
			type: Number,
			default: 0,
		},
		expiryDate: {
			type: Date,
			default: null,
		},
		status: {
			type: String,
			enum: ["Active", "Inactive"],
			default: "Active",
		},
	},
	{ timestamps: true }
);

export const Coupon =
	mongoose.models.Coupon || mongoose.model("Coupon", couponSchema);
