"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import {
	ArrowLeft,
	Calendar,
	CheckCircle2,
	Download,
	MapPin,
	Package,
	RefreshCcw,
	ShoppingBag,
	Truck,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function OrderDetailPage({ order }: { order: any }) {
	const router = useRouter();

	const date = new Date(order.createdAt).toLocaleString("en-US", {
		month: "long",
		day: "numeric",
		year: "numeric",
		hour: "numeric",
		minute: "numeric",
	});

	const subtotal = order.items.reduce(
		(acc: number, item: any) => acc + item.price * item.quantity,
		0
	);

	const shippingMethodName = 
		order.shippingMethod === "express" ? "Express" : "Standard";

	return (
		<div className="space-y-6">
			{/* Page Header */}
			<div className="flex items-center gap-4">
				<Button
					onClick={() => router.push("/profile/orders")}
					size="icon"
					variant="ghost"
				>
					<ArrowLeft className="h-5 w-5" />
				</Button>
				<div>
					<h1 className="flex items-center gap-2 font-bold text-2xl text-slate-900 dark:text-white">
						Order {order._id}
						{order.isPaid ? (
							<Badge className="ml-2 font-semibold" variant="success">
								<CheckCircle2 className="mr-1 h-3 w-3" /> Paid
							</Badge>
						) : (
							<Badge className="ml-2 font-semibold bg-orange-100 text-orange-700 hover:bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400">
								Unpaid
							</Badge>
						)}
					</h1>
					<p className="mt-1 flex items-center gap-1.5 text-slate-500 text-sm">
						<Calendar className="h-4 w-4" /> Placed on {date}
					</p>
				</div>
				<div className="ml-auto flex gap-3">
					<Button
						asChild
						variant="outline"
					>
						<Link href="/contact">
							<RefreshCcw className="mr-2 h-4 w-4" /> Return / Refund
						</Link>
					</Button>
					{order.invoiceUrl ? (
						<Button
							asChild
							variant="outline"
						>
							<a href={order.invoiceUrl} rel="noreferrer" target="_blank">
								<Download className="mr-2 h-4 w-4" /> Download Invoice
							</a>
						</Button>
					) : null}
				</div>
			</div>

			<div className="grid gap-6 md:grid-cols-3">
				{/* Order Items */}
				<div className="md:col-span-2 space-y-6">
					<Card>
						<CardContent className="p-6 pt-6 sm:pt-6">
							<h3 className="mb-4 flex items-center gap-2 font-bold text-lg text-slate-900 dark:text-white">
								<ShoppingBag className="h-5 w-5" /> Items ({order.items.length})
							</h3>
							<div className="divide-y divide-slate-100 dark:divide-slate-800">
								{order.items.map((item: any, i: number) => (
									<div
										key={i}
										className="flex items-center justify-between py-4 first:pt-0 last:pb-0"
									>
										<div className="flex flex-col">
											<span className="font-medium text-slate-900 dark:text-slate-100">
												{item.title}
											</span>
											<span className="text-slate-500 text-sm">
												Qty: {item.quantity} {item.isbn ? `• ISBN: ${item.isbn}` : ""}
											</span>
										</div>
										<span className="font-semibold text-slate-900 dark:text-slate-100">
											AED {(item.price * item.quantity).toFixed(2)}
										</span>
									</div>
								))}
							</div>
						</CardContent>
					</Card>

					{/* Order Summary */}
					<Card>
						<CardContent className="p-6 pt-6 sm:pt-6">
							<h3 className="mb-4 font-bold text-lg text-slate-900 dark:text-white">
								Order Summary
							</h3>
							<div className="space-y-3 text-sm">
								<div className="flex justify-between text-slate-600 dark:text-slate-400">
									<span>Subtotal</span>
									<span className="text-slate-900 dark:text-slate-100">
										AED {subtotal.toFixed(2)}
									</span>
								</div>
								<div className="flex justify-between text-slate-600 dark:text-slate-400">
									<span>Shipping ({shippingMethodName})</span>
									<span className="text-slate-900 dark:text-slate-100">
										AED {order.shippingCost?.toFixed(2) || "0.00"}
									</span>
								</div>
								{order.taxAmount > 0 && (
									<div className="flex justify-between text-slate-600 dark:text-slate-400">
										<span>Tax</span>
										<span className="text-slate-900 dark:text-slate-100">
											AED {order.taxAmount.toFixed(2)}
										</span>
									</div>
								)}
								{order.discountAmount > 0 && (
									<div className="flex justify-between text-emerald-600">
										<span>Discount</span>
										<span>- AED {order.discountAmount.toFixed(2)}</span>
									</div>
								)}
								<div className="flex justify-between border-t border-slate-100 pt-3 font-bold text-base text-slate-900 dark:border-slate-800 dark:text-white">
									<span>Total</span>
									<span>AED {order.total.toFixed(2)}</span>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Order Status & Info */}
				<div className="space-y-6">
					<Card>
						<CardContent className="p-6 pt-6 sm:pt-6">
							<h3 className="mb-4 flex items-center gap-2 font-bold text-lg text-slate-900 dark:text-white">
								<Package className="h-5 w-5" /> Status
							</h3>
							<div className="flex items-center gap-3">
								<div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
									<Truck className="h-5 w-5 text-slate-600 dark:text-slate-400" />
								</div>
								<div>
									<p className="font-medium text-slate-900 dark:text-slate-100">
										{order.status}
									</p>
									<p className="text-slate-500 text-sm">
										Current order status
									</p>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardContent className="p-6 pt-6 sm:pt-6">
							<h3 className="mb-4 flex items-center gap-2 font-bold text-lg text-slate-900 dark:text-white">
								<MapPin className="h-5 w-5" /> Shipping Address
							</h3>
							{order.shippingAddress ? (
								<address className="not-italic text-slate-600 text-sm dark:text-slate-400">
									<p className="font-medium text-slate-900 dark:text-slate-100">
										{order.shippingAddress.firstName} {order.shippingAddress.lastName}
									</p>
									<p className="mt-1">{order.shippingAddress.addressLine1}</p>
									{order.shippingAddress.addressLine2 && (
										<p>{order.shippingAddress.addressLine2}</p>
									)}
									<p>
										{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
									</p>
									<p>{order.shippingAddress.country}</p>
									{order.shippingAddress.phone && (
										<p className="mt-2 text-slate-500">
											{order.shippingAddress.phone}
										</p>
									)}
								</address>
							) : (
								<p className="text-slate-500 text-sm">
									No shipping address provided.
								</p>
							)}
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
