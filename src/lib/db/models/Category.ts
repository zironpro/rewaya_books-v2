import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    count: { type: Number, default: 0 },
    status: { type: String, default: "Active" },
    sort: { type: Number, default: 0 },
    image: { type: String },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  },
  {
    timestamps: true,
  }
);

export const Category =
  mongoose.models.Category || mongoose.model("Category", CategorySchema);
