import mongoose, { Document, Model, Schema } from "mongoose";

export interface INotification extends Document {
	title: string;
	message: string;
	type: "new_order" | "cancelled";
	orderId: string;
	read: boolean;
	createdAt: Date;
	updatedAt: Date;
}

const NotificationSchema: Schema<INotification> = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
		},
		message: {
			type: String,
			required: true,
		},
		type: {
			type: String,
			enum: ["new_order", "cancelled"],
			required: true,
		},
		orderId: {
			type: String,
			required: true,
		},
		read: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
);

export const Notification: Model<INotification> =
	mongoose.models.Notification ||
	mongoose.model<INotification>("Notification", NotificationSchema);
