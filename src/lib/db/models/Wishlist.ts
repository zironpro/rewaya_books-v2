import mongoose, { type Document, type Model, Schema } from "mongoose";

export interface IWishlist extends Document {
	userId: string;
	productIds: string[];
	createdAt: Date;
	updatedAt: Date;
}

const wishlistSchema = new Schema<IWishlist>(
	{
		userId: {
			type: String,
			required: true,
			index: true,
			unique: true,
		},
		productIds: {
			type: [String],
			default: [],
		},
	},
	{
		timestamps: true,
	}
);

// Prevent mongoose from compiling the model multiple times in development
const Wishlist: Model<IWishlist> =
	mongoose.models.Wishlist ||
	mongoose.model<IWishlist>("Wishlist", wishlistSchema);

export default Wishlist;
