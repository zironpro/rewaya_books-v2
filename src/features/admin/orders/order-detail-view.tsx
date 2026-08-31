"use client";

import { useParams, useRouter } from "next/navigation";

import {
	ArrowLeft,
	Calendar,
	CheckCircle2,
	CreditCard,
	MapPin,
	Package,
	ShoppingBag,
	Truck,
	User,
	Download,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
	useGetOrderByIdQuery,
	useUpdateOrderStatusMutation,
} from "@/types/graphql";

export function OrderDetailView() {
	const params = useParams();
	const router = useRouter();
	const orderId = params.id as string;

	const { data, isLoading, refetch } = useGetOrderByIdQuery({ id: orderId });
	const { mutate: updateStatus, isPending: isUpdating } =
		useUpdateOrderStatusMutation({
			onSuccess: () => refetch(),
		});

	if (isLoading) {
		return (
			<div className="flex h-64 items-center justify-center">
				<div className="text-slate-500">Loading order details...</div>
			</div>
		);
	}

	const order = data?.orderById;

	if (!order) {
		return (
			<div className="flex flex-col items-center justify-center space-y-4 py-16 text-center">
				<Package className="h-16 w-16 text-slate-300" />
				<div>
					<h2 className="font-bold text-slate-900 text-xl dark:text-white">
						Order not found
					</h2>
					<p className="text-slate-500">
						The order you are looking for does not exist or has been removed.
					</p>
				</div>
				<Button onClick={() => router.push("/admin/orders")} variant="outline">
					<ArrowLeft className="mr-2 h-4 w-4" /> Back to Orders
				</Button>
			</div>
		);
	}

	const date = order.createdAt
		? new Date(Number.parseInt(order.createdAt)).toLocaleString()
		: "Unknown date";

	return (
		<div className="space-y-6">
			{/* Page Header */}
			<div className="flex items-center gap-4">
				<Button
					onClick={() => router.push("/admin/orders")}
					size="icon"
					variant="ghost"
				>
					<ArrowLeft className="h-5 w-5" />
				</Button>
				<div>
					<h1 className="flex items-center gap-2 font-bold text-2xl text-slate-900 dark:text-white">
						Order #{order.id.slice(-6).toUpperCase()}
						{order.isPaid ? (
							<Badge className="ml-2 font-semibold" variant="success">
								<CheckCircle2 className="mr-1 h-3 w-3" /> Paid
							</Badge>
						) : (
							<Badge className="ml-2 font-semibold bg-orange-100 text-orange-700 hover:bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400">
								Unpaid
							</Badge>
						)}
						{order.shippingMethod === "express" && (
							<Badge variant="warning" className="ml-2 font-semibold bg-primary/10 text-primary hover:bg-primary/20 dark:bg-primary/20 dark:text-primary border-primary/20">
								<Truck className="mr-1 h-3 w-3" /> Express Delivery
							</Badge>
						)}
					</h1>
					<p className="mt-1 flex items-center gap-1.5 text-slate-500 text-sm">
						<Calendar className="h-4 w-4" /> Placed on {date}
					</p>
				</div>
				<div className="ml-auto flex items-center gap-3">
					<div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
						<span className="font-medium text-slate-500 text-sm">Status:</span>
						<select
							className="h-8 cursor-pointer rounded-md border-none bg-slate-50 px-2 font-bold text-slate-900 text-sm outline-none ring-0 focus:ring-0 dark:bg-slate-800 dark:text-white"
							disabled={isUpdating}
							onChange={(e) =>
								updateStatus({ id: order.id, status: e.target.value })
							}
							value={order.status}
						>
							<option value="PENDING">Pending</option>
							<option value="SHIPPED">Shipped</option>
							<option value="DELIVERED">Delivered</option>
							<option value="CANCELLED">Cancelled</option>
						</select>
					</div>
					{order.invoiceUrl && (
						<a href={order.invoiceUrl} target="_blank" rel="noopener noreferrer">
							<Button variant="outline" size="sm" className="h-9 gap-2">
								<Download className="h-4 w-4" /> Invoice
							</Button>
						</a>
					)}
				</div>
			</div>

			<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
				{/* Left Column - Main Details */}
				<div className="space-y-6 lg:col-span-2">
					{/* Items Table */}
					<div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
						<h2 className="mb-4 flex items-center gap-2 font-bold text-lg text-slate-900 dark:text-white">
							<ShoppingBag className="h-5 w-5 text-primary" /> Order Items
						</h2>
						<div className="overflow-x-auto">
							<table className="w-full text-left text-sm">
								<thead className="border-slate-200 border-b text-slate-500 dark:border-slate-800">
									<tr>
										<th className="px-4 py-3 font-semibold">Product</th>
										<th className="px-4 py-3 text-center font-semibold">
											Price
										</th>
										<th className="px-4 py-3 text-center font-semibold">
											Quantity
										</th>
										<th className="px-4 py-3 text-right font-semibold">
											Total
										</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-slate-100 dark:divide-slate-800">
									{order.items.map((item, idx) => (
										<tr className="group" key={idx}>
											<td className="px-4 py-4">
												<div className="flex items-center gap-4">
													<div className="flex h-12 w-12 items-center justify-center rounded-md bg-slate-100 dark:bg-slate-800">
														<Package className="h-6 w-6 text-slate-400" />
													</div>
													<div>
														<div className="font-semibold text-slate-900 dark:text-white">
															{item.title}
														</div>
														<div className="mt-0.5 text-slate-500 text-xs">
															{item.bundleId ? "Bundle" : "Book"}
														</div>
														{item.product?.isbn && (
															<div className="mt-0.5 text-slate-400 text-xs font-mono">
																ISBN: {item.product.isbn}
															</div>
														)}
														{item.bundle?.books && item.bundle.books.length > 0 && (
															<div className="mt-2 space-y-1 pl-1 border-l-2 border-slate-200 dark:border-slate-700">
																<div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider ml-1">Included Books:</div>
																<ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1 ml-1">
																	{item.bundle.books.map((b: any, i: number) => (
																		<li key={i} className="flex flex-col gap-0.5">
																			<span className="font-medium text-slate-700 dark:text-slate-300">• {b.title}</span>
																			{b.isbn && <span className="font-mono text-slate-400 ml-2">ISBN: {b.isbn}</span>}
																		</li>
																	))}
																</ul>
															</div>
														)}
													</div>
												</div>
											</td>
											<td className="px-4 py-4 text-center font-medium">
												AED {item.price.toFixed(2)}
											</td>
											<td className="px-4 py-4 text-center font-medium">
												× {item.quantity}
											</td>
											<td className="px-4 py-4 text-right font-bold text-slate-900 dark:text-white">
												AED {(item.price * item.quantity).toFixed(2)}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>

					{/* Payment Summary */}
					<div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
						<h2 className="mb-4 flex items-center gap-2 font-bold text-lg text-slate-900 dark:text-white">
							<CreditCard className="h-5 w-5 text-primary" /> Payment Summary
						</h2>
						<div className="space-y-3 rounded-lg border border-slate-100 bg-slate-50 p-4 dark:border-slate-800/60 dark:bg-slate-800/30">
							<div className="flex justify-between text-slate-600 text-sm dark:text-slate-400">
								<span>Subtotal</span>
								<span className="font-medium text-slate-900 dark:text-white">
									AED {(order.total - (order.shippingCost || 0) - (order.taxAmount || 0) + (order.discountAmount || 0)).toFixed(2)}
								</span>
							</div>
							{order.couponCode && (
								<div className="flex justify-between text-green-600 text-sm dark:text-green-400">
									<span>Discount ({order.couponCode})</span>
									<span className="font-medium">
										- AED {(order.discountAmount || 0).toFixed(2)}
									</span>
								</div>
							)}
							<div className="flex justify-between text-slate-600 text-sm dark:text-slate-400">
								<span>Shipping</span>
								<span className="font-medium text-slate-900 dark:text-white">
									AED {(order.shippingCost || 0).toFixed(2)}
								</span>
							</div>
							<div className="flex justify-between text-slate-600 text-sm dark:text-slate-400">
								<span>Tax</span>
								<span className="font-medium text-slate-900 dark:text-white">
									AED {(order.taxAmount || 0).toFixed(2)}
								</span>
							</div>
							<div className="my-2 border-slate-200 border-t dark:border-slate-700" />
							<div className="flex justify-between font-bold text-base text-slate-900 dark:text-white mb-4">
								<span>Total Amount</span>
								<span className="text-primary text-xl">
									AED {order.total.toFixed(2)}
								</span>
							</div>
							
							<div className="border-t border-slate-200 pt-4 mt-4 dark:border-slate-700 space-y-3 text-sm">
								<div className="flex justify-between text-slate-600 dark:text-slate-400">
									<span>Payment Method</span>
									<span className="font-semibold text-slate-900 dark:text-white">
										{order.paymentMethod === "COD" ? "Cash on Delivery" : "Stripe (Card)"}
									</span>
								</div>
								{order.stripeTransactionId && (
									<div className="flex justify-between text-slate-600 dark:text-slate-400">
										<span>Transaction ID</span>
										<span className="font-mono text-xs text-slate-900 dark:text-white">
											{order.stripeTransactionId}
										</span>
									</div>
								)}
								<div className="flex justify-between text-slate-600 dark:text-slate-400">
									<span>Payment Status</span>
									<span className={`font-semibold ${order.isPaid ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'}`}>
										{order.isPaid ? "Paid" : "Unpaid"}
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Right Column - Customer Info */}
				<div className="space-y-6">
					{/* Customer & Contact */}
					<div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
						<h2 className="mb-4 flex items-center gap-2 font-bold text-lg text-slate-900 dark:text-white">
							<User className="h-5 w-5 text-primary" /> Customer Info
						</h2>
						<div className="space-y-3 text-sm">
							<div>
								<div className="mb-1 font-medium text-slate-500">
									Contact Email
								</div>
								<div className="font-semibold text-slate-900 dark:text-white">
									{order.email}
								</div>
							</div>
							{order.shippingAddress?.phone && (
								<div>
									<div className="mb-1 font-medium text-slate-500">
										Phone Number
									</div>
									<div className="font-semibold text-slate-900 dark:text-white">
										{order.shippingAddress.phone}
									</div>
								</div>
							)}
						</div>
					</div>

					{/* Delivery Details */}
					<div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
						<h2 className="mb-4 flex items-center gap-2 font-bold text-lg text-slate-900 dark:text-white">
							<Truck className="h-5 w-5 text-primary" /> Delivery Info
						</h2>

						<div className="space-y-4">
							<div className={`flex items-start gap-3 rounded-lg border p-3 ${order.shippingMethod === "express" ? "border-amber-200/50 bg-amber-50/50 dark:border-amber-800/30 dark:bg-amber-900/10" : "border-primary/20 bg-primary/5"}`}>
								<Truck className={`mt-0.5 h-5 w-5 ${order.shippingMethod === "express" ? "text-amber-600 dark:text-amber-500" : "text-primary"}`} />
								<div>
									<div className="font-bold text-slate-900 text-sm dark:text-white">
										{order.shippingMethod === "express" ? "Express Delivery" : "Standard Delivery"}
									</div>
									<div className="mt-0.5 text-slate-500 text-xs">
										{order.shippingMethod === "express" ? "Estimated delivery: 1-2 business days" : "Estimated delivery: 2-3 business days"}
									</div>
								</div>
							</div>

							<div>
								<div className="mb-2 flex items-center gap-1.5 font-medium text-slate-500 text-sm">
									<MapPin className="h-4 w-4" /> Shipping Address
								</div>
								{order.shippingAddress ? (
									<div className="rounded-lg bg-slate-50 p-3 font-medium text-slate-700 text-sm leading-relaxed dark:bg-slate-800/50 dark:text-slate-300">
										{order.shippingAddress.firstName}{" "}
										{order.shippingAddress.lastName}
										<br />
										{order.shippingAddress.addressLine1}{" "}
										{order.shippingAddress.addressLine2}
										<br />
										{order.shippingAddress.city}, {order.shippingAddress.state}{" "}
										{order.shippingAddress.postalCode}
										<br />
										{order.shippingAddress.country}
									</div>
								) : (
									<div className="text-slate-400 text-sm italic">
										No shipping address provided
									</div>
								)}
							</div>

							<div>
								<div className="mb-2 flex items-center gap-1.5 font-medium text-slate-500 text-sm">
									<CreditCard className="h-4 w-4" /> Billing Address
								</div>
								{order.shippingAddress ? (
									<div className="rounded-lg border border-slate-200 border-dashed p-3 font-medium text-slate-600 text-sm leading-relaxed dark:border-slate-700 dark:text-slate-400">
										Same as shipping address
									</div>
								) : (
									<div className="text-slate-400 text-sm italic">
										No billing address provided
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
