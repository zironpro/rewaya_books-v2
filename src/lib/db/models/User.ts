import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
	{
		name: { type: String },
		email: { type: String, unique: true },
		emailVerified: { type: Date },
		password: { type: String }, // Hashed password
		image: { type: String },
		role: { type: String, enum: ["USER", "ADMIN", "VIP"], default: "USER" },
		phone: { type: String },
		nickname: { type: String },
		city: { type: String },
		region: { type: String },
		shippingAddress: {
			firstName: { type: String },
			lastName: { type: String },
			addressLine1: { type: String },
			addressLine2: { type: String },
			city: { type: String },
			state: { type: String },
			postalCode: { type: String },
			country: { type: String, default: "UAE" },
		},
	},
	{ timestamps: true }
);

export const User = mongoose.models.User || mongoose.model("User", UserSchema);
