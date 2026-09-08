import mongoose from "mongoose";

const TaxConfigSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		rate: { type: Number, required: true },
		region: { type: String, required: true },
		type: { type: String, required: true },
		appliedToShipping: { type: Boolean, default: false },
		status: { type: String, default: "Active" },
	},
	{
		timestamps: true,
	}
);

export const TaxConfig =
	mongoose.models.TaxConfig || mongoose.model("TaxConfig", TaxConfigSchema);
