import mongoose from "mongoose";

const HeroBannerSchema = new mongoose.Schema(
	{
		title: { type: String, required: true },
		subtitle: { type: String },
		ctaLabel: { type: String },
		ctaHref: { type: String },
		sortOrder: { type: Number, default: 0 },
		enabled: { type: Boolean, default: true },
		image: { type: String },
	},
	{
		timestamps: true,
	}
);

export const HeroBanner =
	mongoose.models.HeroBanner || mongoose.model("HeroBanner", HeroBannerSchema);
