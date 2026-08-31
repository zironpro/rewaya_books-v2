import mongoose from "mongoose";

const HomepageSectionSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    subtitle: { type: String },
    categorySlug: { type: String, required: true },
    limit: { type: Number, default: 10 },
    badge: { type: String },
    sortOrder: { type: Number, default: 0 },
    enabled: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

export const HomepageSection =
  mongoose.models.HomepageSection || mongoose.model("HomepageSection", HomepageSectionSchema);
