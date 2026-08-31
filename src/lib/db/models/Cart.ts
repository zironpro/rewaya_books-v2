import mongoose, { Schema } from "mongoose";

const cartItemSchema = new Schema(
	{
		productId: { type: String, required: true },
		quantity: { type: Number, default: 1 },
		price: { type: Number, default: 0 },
		title: { type: String },
		isBundle: { type: Boolean, default: false },
		bundleSlug: { type: String },
		image: { type: String },
	},
	{ _id: true }
);

const cartSchema = new Schema(
	{
		userId: {
			type: String, // String ID to match auth adapter
			required: true,
			unique: true,
		},
		lineItems: [cartItemSchema],
	},
	{ timestamps: true }
);

export const Cart = mongoose.models.Cart || mongoose.model("Cart", cartSchema);
