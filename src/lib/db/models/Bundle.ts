import mongoose from "mongoose";

const BundleSchema = new mongoose.Schema(
	{
		title: { type: String, required: true },
		slug: { type: String, required: true, unique: true },
		description: { type: String },
		price: { type: Number, required: true },
		originalPrice: { type: Number },
		coverImage: { type: String },
		books: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
		isFeatured: { type: Boolean, default: false },
	},
	{ timestamps: true }
);

export const Bundle =
	mongoose.models.Bundle || mongoose.model("Bundle", BundleSchema);
