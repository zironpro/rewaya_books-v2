"use client";

import { useEffect, useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { GET_COUPON, UPDATE_COUPON } from "@/graphql/queries";
import { graphqlClient } from "@/lib/graphql-client";

export function CouponEditView({ id }: { id: string }) {
	const router = useRouter();
	const queryClient = useQueryClient();
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [formData, setFormData] = useState({
		code: "",
		discountType: "percentage",
		discountAmount: "",
		minPurchase: "",
		isFirstOrder: false,
		maxUses: "",
		expiryDate: "",
		status: "Active",
	});

	useEffect(() => {
		async function fetchCoupon() {
			try {
				const data: any = await graphqlClient.request(GET_COUPON, { id });
				if (data.coupon) {
					const c = data.coupon;
					setFormData({
						code: c.code,
						discountType: c.discountType,
						discountAmount: c.discountAmount.toString(),
						minPurchase: c.minPurchase ? c.minPurchase.toString() : "",
						isFirstOrder: c.isFirstOrder === true,
						maxUses: c.maxUses ? c.maxUses.toString() : "",
						expiryDate: c.expiryDate
							? new Date(Number(c.expiryDate)).toISOString().split("T")[0]
							: "",
						status: c.status || "Active",
					});
				}
			} catch (e) {
				console.error(e);
				alert("Failed to fetch coupon.");
			} finally {
				setLoading(false);
			}
		}
		fetchCoupon();
	}, [id]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!formData.code || !formData.discountAmount) return;

		setSaving(true);
		try {
			await graphqlClient.request(UPDATE_COUPON, {
				id,
				input: {
					code: formData.code.toUpperCase(),
					discountType: formData.discountType,
					discountAmount: Number.parseFloat(formData.discountAmount),
					minPurchase: formData.minPurchase
						? Number.parseFloat(formData.minPurchase)
						: null,
					isFirstOrder: formData.isFirstOrder,
					maxUses: formData.maxUses ? Number.parseInt(formData.maxUses) : null,
					expiryDate: formData.expiryDate
						? new Date(formData.expiryDate).toISOString()
						: null,
					status: formData.status,
				},
			});
			queryClient.invalidateQueries({ queryKey: ["GetCoupons"] });
			router.push("/admin/coupons");
			router.refresh();
		} catch (error) {
			console.error(error);
			alert("Failed to update coupon.");
		} finally {
			setSaving(false);
		}
	};

	if (loading) {
		return <div className="p-6">Loading coupon...</div>;
	}

	return (
		<div className="flex max-w-2xl flex-col space-y-6">
			<div className="flex items-center gap-4">
				<Link href="/admin/coupons">
					<Button className="h-8 w-8" size="icon" variant="outline">
						<ArrowLeft className="h-4 w-4" />
					</Button>
				</Link>
				<h2 className="font-bold text-2xl tracking-tight">Edit Coupon</h2>
			</div>

			<form
				className="space-y-6 rounded-md border bg-white p-6 shadow-sm"
				onSubmit={handleSubmit}
			>
				<div className="space-y-2">
					<Label htmlFor="code">Coupon Code</Label>
					<Input
						className="uppercase"
						id="code"
						onChange={(e) => setFormData({ ...formData, code: e.target.value })}
						placeholder="e.g. SUMMER2024"
						required
						value={formData.code}
					/>
				</div>

				<div className="grid grid-cols-2 gap-4">
					<div className="space-y-2">
						<Label htmlFor="discountType">Discount Type</Label>
						<select
							className="flex h-10 w-full rounded-md border border-stone-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-950 focus-visible:ring-offset-2"
							id="discountType"
							onChange={(e) =>
								setFormData({ ...formData, discountType: e.target.value })
							}
							value={formData.discountType}
						>
							<option value="percentage">Percentage (%)</option>
							<option value="fixed">Fixed Amount (AED)</option>
						</select>
					</div>

					<div className="space-y-2">
						<Label htmlFor="discountAmount">Discount Amount</Label>
						<Input
							id="discountAmount"
							min="0"
							onChange={(e) =>
								setFormData({ ...formData, discountAmount: e.target.value })
							}
							placeholder={
								formData.discountType === "percentage"
									? "e.g. 20"
									: "e.g. 50.00"
							}
							required
							step="0.01"
							type="number"
							value={formData.discountAmount}
						/>
					</div>
				</div>

				<div className="grid grid-cols-2 gap-4">
					<div className="space-y-2">
						<Label htmlFor="minPurchase">
							Minimum Purchase (AED) - Optional
						</Label>
						<Input
							id="minPurchase"
							min="0"
							onChange={(e) =>
								setFormData({ ...formData, minPurchase: e.target.value })
							}
							placeholder="e.g. 100.00"
							step="0.01"
							type="number"
							value={formData.minPurchase}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="maxUses">Max Uses - Optional</Label>
						<Input
							id="maxUses"
							min="1"
							onChange={(e) =>
								setFormData({ ...formData, maxUses: e.target.value })
							}
							placeholder="e.g. 100"
							type="number"
							value={formData.maxUses}
						/>
					</div>
				</div>

				<div className="grid grid-cols-2 gap-4">
					<div className="space-y-2">
						<Label htmlFor="expiryDate">Expiry Date - Optional</Label>
						<Input
							id="expiryDate"
							onChange={(e) =>
								setFormData({ ...formData, expiryDate: e.target.value })
							}
							type="date"
							value={formData.expiryDate}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="status">Status</Label>
						<select
							className="flex h-10 w-full rounded-md border border-stone-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-950 focus-visible:ring-offset-2"
							id="status"
							onChange={(e) =>
								setFormData({ ...formData, status: e.target.value })
							}
							value={formData.status}
						>
							<option value="Active">Active</option>
							<option value="Inactive">Inactive</option>
						</select>
					</div>
				</div>

				<div className="border-t pt-4">
					<label className="flex w-fit cursor-pointer items-center gap-2 font-semibold text-sm">
						<input
							checked={formData.isFirstOrder}
							className="h-4 w-4 rounded border-stone-300 text-stone-900 focus:ring-stone-900"
							onChange={(e) =>
								setFormData({ ...formData, isFirstOrder: e.target.checked })
							}
							type="checkbox"
						/>
						Valid for First-Time Orders Only
					</label>
					<p className="mt-1 text-stone-500 text-xs">
						If checked, customers must provide an email and have no previous
						orders to use this coupon.
					</p>
				</div>

				<div className="flex justify-end pt-4">
					<Button disabled={saving} type="submit">
						{saving ? "Saving..." : "Save Changes"}
					</Button>
				</div>
			</form>
		</div>
	);
}
