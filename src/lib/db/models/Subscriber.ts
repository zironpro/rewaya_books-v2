import mongoose, { Document, Model, Schema } from "mongoose";

export interface ISubscriber extends Document {
	email: string;
	status: "subscribed" | "unsubscribed";
	createdAt: Date;
	updatedAt: Date;
}

const SubscriberSchema = new Schema<ISubscriber>(
	{
		email: { type: String, required: true, unique: true },
		status: {
			type: String,
			enum: ["subscribed", "unsubscribed"],
			default: "subscribed",
		},
	},
	{ timestamps: true }
);

export const Subscriber: Model<ISubscriber> =
	mongoose.models.Subscriber ||
	mongoose.model<ISubscriber>("Subscriber", SubscriberSchema);
