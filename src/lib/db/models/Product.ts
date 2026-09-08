import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
	{
		title: { type: String, required: true },
		slug: { type: String, required: true, unique: true },
		author: { type: String },
		description: { type: String },
		price: { type: Number, required: true },
		originalPrice: { type: Number },
		stock: { type: Number, default: 0 },
		coverImage: { type: String },
		images: [{ type: String }],
		categoryId: { type: String },
		categorySlug: { type: String },
		categoryName: { type: String },
		categoryIds: [{ type: String }],
		categories: [{
			id: { type: String },
			name: { type: String },
			slug: { type: String }
		}],
		isbn: { type: String },
		pages: { type: Number },
		language: { type: String },
		format: { type: String }, // e.g. Paperback, Hardcover
		ribbon: { type: String },
		publisher: { type: String },
		sortOrder: { type: Number, default: 0 },
	},
	{ timestamps: true }
);

ProductSchema.index({ sortOrder: 1, createdAt: -1 });
ProductSchema.index({ categoryId: 1 });
ProductSchema.index({ categoryIds: 1 });
ProductSchema.index({ slug: 1 });

export const Product =
	mongoose.models.Product || mongoose.model("Product", ProductSchema);
