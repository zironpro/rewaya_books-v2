import mongoose from "mongoose";

const PopupSchema = new mongoose.Schema(
	{
		title: { type: String, required: true },
		description: { type: String },
		ctaLabel: { type: String },
		ctaHref: { type: String },
		image: { type: String },
		delaySeconds: { type: Number, default: 5 },
		enabled: { type: Boolean, default: true },
		expiresAt: { type: Date },
		countdownText: { type: String },
	},
	{ timestamps: true }
);

// We define a default export and reuse the model if it's already compiled
export const Popup = mongoose.models.Popup || mongoose.model("Popup", PopupSchema);
