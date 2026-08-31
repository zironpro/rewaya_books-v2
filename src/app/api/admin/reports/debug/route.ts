import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db/mongodb";
import { Order } from "@/lib/db/models/Order";

export async function GET() {
	await connectToDatabase();
	const orders = await Order.find({});
	
	const statuses = orders.map(o => ({ id: o._id, status: o.status, createdAt: o.createdAt }));
	
	return NextResponse.json({ 
		total: orders.length, 
		statuses 
	});
}
