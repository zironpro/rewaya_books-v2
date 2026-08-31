"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Ticket, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { graphqlClient } from "@/lib/graphql-client";
import { GET_COUPONS, DELETE_COUPON } from "@/graphql/queries";

export function CouponsView() {
	const [coupons, setCoupons] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchCoupons();
	}, []);

	async function fetchCoupons() {
		setLoading(true);
		try {
			const data: any = await graphqlClient.request(GET_COUPONS);
			setCoupons(data.coupons || []);
		} catch (e) {
			console.error(e);
		} finally {
			setLoading(false);
		}
	}

	async function handleDelete(id: string) {
		if (!confirm("Are you sure you want to delete this coupon?")) return;
		try {
			await graphqlClient.request(DELETE_COUPON, { id });
			setCoupons(coupons.filter((c) => c.id !== id));
		} catch (e) {
			console.error(e);
			alert("Failed to delete coupon");
		}
	}

	return (
		<div className="flex flex-col space-y-4">
			<div className="flex items-center justify-between">
				<h2 className="text-3xl font-bold tracking-tight">Coupons</h2>
				<Link href="/admin/coupons/new">
					<Button className="gap-2">
						<Plus className="h-4 w-4" />
						Create Coupon
					</Button>
				</Link>
			</div>

			<div className="rounded-md border bg-white shadow-sm">
				<div className="overflow-x-auto">
					<table className="w-full text-base text-left">
						<thead className="text-sm text-stone-500 uppercase bg-stone-50 border-b">
							<tr>
								<th className="px-6 py-4 font-medium">Code</th>
								<th className="px-6 py-4 font-medium">Discount</th>
								<th className="px-6 py-4 font-medium">Usage</th>
								<th className="px-6 py-4 font-medium">Expiry</th>
								<th className="px-6 py-4 font-medium">Status</th>
								<th className="px-6 py-4 font-medium text-right">Actions</th>
							</tr>
						</thead>
						<tbody>
							{loading ? (
								<tr>
									<td colSpan={6} className="px-6 py-8 text-center text-stone-500">
										Loading coupons...
									</td>
								</tr>
							) : coupons.length === 0 ? (
								<tr>
									<td colSpan={6} className="px-6 py-8 text-center text-stone-500">
										<div className="flex flex-col items-center justify-center space-y-2">
											<Ticket className="h-8 w-8 text-stone-300" />
											<p>No coupons found. Create one to get started.</p>
										</div>
									</td>
								</tr>
							) : (
								coupons.map((coupon) => (
									<tr key={coupon.id} className="border-b last:border-0 hover:bg-stone-50/50">
										<td className="px-6 py-4 font-bold text-stone-900">
											{coupon.code}
										</td>
										<td className="px-6 py-4 text-stone-600">
											{coupon.discountType === "percentage" ? (
												<span>{coupon.discountAmount}% off</span>
											) : (
												<span>AED {coupon.discountAmount.toFixed(2)} off</span>
											)}
											{coupon.minPurchase > 0 && (
												<div className="text-xs text-stone-400 mt-1">
													Min AED {coupon.minPurchase}
												</div>
											)}
										</td>
										<td className="px-6 py-4 text-stone-600">
											{coupon.usedCount} {coupon.maxUses ? `/ ${coupon.maxUses}` : ""}
										</td>
										<td className="px-6 py-4 text-stone-500">
											{coupon.expiryDate ? new Date(Number(coupon.expiryDate)).toLocaleDateString() : "Never"}
										</td>
										<td className="px-6 py-4">
											<span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
												coupon.status === "Active" ? "bg-green-100 text-green-800" : "bg-stone-100 text-stone-800"
											}`}>
												{coupon.status}
											</span>
										</td>
										<td className="px-6 py-4 text-right">
											<div className="flex items-center justify-end gap-2">
												<Link href={`/admin/coupons/${coupon.id}`}>
													<Button variant="ghost" size="icon" className="h-8 w-8 text-stone-500 hover:text-stone-900">
														<Pencil className="h-4 w-4" />
													</Button>
												</Link>
												<Button
													variant="ghost"
													size="icon"
													className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
													onClick={() => handleDelete(coupon.id)}
												>
													<Trash2 className="h-4 w-4" />
												</Button>
											</div>
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}
