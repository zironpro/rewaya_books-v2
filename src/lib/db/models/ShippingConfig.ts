import mongoose from "mongoose";

const ShippingConfigSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		countries: { type: [String], required: true },
		standardFee: { type: Number, required: true },
		expressFee: { type: Number, required: true },
		isExpressEnabled: { type: Boolean, default: false },
		freeThreshold: { type: Number, required: true },
		deliveryTime: { type: String, required: true },
		expressDeliveryTime: { type: String },
		isCodEnabled: { type: Boolean, default: false },
		codFee: { type: Number, default: 0 },
		status: { type: String, default: "Active" },
	},
	{
		timestamps: true,
	}
);

export const ShippingConfig =
	mongoose.models.ShippingConfig ||
	mongoose.model("ShippingConfig", ShippingConfigSchema);
