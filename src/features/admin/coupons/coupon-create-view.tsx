"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { graphqlClient } from "@/lib/graphql-client";
import { CREATE_COUPON } from "@/graphql/queries";

export function CouponCreateView() {
	const router = useRouter();
	const queryClient = useQueryClient();
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState({
		code: "",
		discountType: "percentage",
		discountAmount: "",
		minPurchase: "",
		maxUses: "",
		expiryDate: "",
		status: "Active",
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!formData.code || !formData.discountAmount) return;

		setLoading(true);
		try {
			await graphqlClient.request(CREATE_COUPON, {
				input: {
					code: formData.code.toUpperCase(),
					discountType: formData.discountType,
					discountAmount: parseFloat(formData.discountAmount),
					minPurchase: formData.minPurchase ? parseFloat(formData.minPurchase) : null,
					maxUses: formData.maxUses ? parseInt(formData.maxUses) : null,
					expiryDate: formData.expiryDate ? new Date(formData.expiryDate).toISOString() : null,
					status: formData.status,
				},
			});
			queryClient.invalidateQueries({ queryKey: ["GetCoupons"] });
			router.push("/admin/coupons");
			router.refresh();
		} catch (error) {
			console.error(error);
			alert("Failed to create coupon. Make sure the code is unique.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="max-w-2xl flex flex-col space-y-6">
			<div className="flex items-center gap-4">
				<Link href="/admin/coupons">
					<Button variant="outline" size="icon" className="h-8 w-8">
						<ArrowLeft className="h-4 w-4" />
					</Button>
				</Link>
				<h2 className="text-2xl font-bold tracking-tight">Create Coupon</h2>
			</div>

			<form onSubmit={handleSubmit} className="space-y-6 rounded-md border bg-white p-6 shadow-sm">
				<div className="space-y-2">
					<Label htmlFor="code">Coupon Code</Label>
					<Input
						id="code"
						value={formData.code}
						onChange={(e) => setFormData({ ...formData, code: e.target.value })}
						placeholder="e.g. SUMMER2024"
						required
						className="uppercase"
					/>
				</div>

				<div className="grid grid-cols-2 gap-4">
					<div className="space-y-2">
						<Label htmlFor="discountType">Discount Type</Label>
						<select
							id="discountType"
							className="flex h-10 w-full rounded-md border border-stone-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-950 focus-visible:ring-offset-2"
							value={formData.discountType}
							onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
						>
							<option value="percentage">Percentage (%)</option>
							<option value="fixed">Fixed Amount (AED)</option>
						</select>
					</div>

					<div className="space-y-2">
						<Label htmlFor="discountAmount">Discount Amount</Label>
						<Input
							id="discountAmount"
							type="number"
							step="0.01"
							min="0"
							value={formData.discountAmount}
							onChange={(e) => setFormData({ ...formData, discountAmount: e.target.value })}
							placeholder={formData.discountType === "percentage" ? "e.g. 20" : "e.g. 50.00"}
							required
						/>
					</div>
				</div>

				<div className="grid grid-cols-2 gap-4">
					<div className="space-y-2">
						<Label htmlFor="minPurchase">Minimum Purchase (AED) - Optional</Label>
						<Input
							id="minPurchase"
							type="number"
							step="0.01"
							min="0"
							value={formData.minPurchase}
							onChange={(e) => setFormData({ ...formData, minPurchase: e.target.value })}
							placeholder="e.g. 100.00"
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="maxUses">Max Uses - Optional</Label>
						<Input
							id="maxUses"
							type="number"
							min="1"
							value={formData.maxUses}
							onChange={(e) => setFormData({ ...formData, maxUses: e.target.value })}
							placeholder="e.g. 100"
						/>
					</div>
				</div>

				<div className="grid grid-cols-2 gap-4">
					<div className="space-y-2">
						<Label htmlFor="expiryDate">Expiry Date - Optional</Label>
						<Input
							id="expiryDate"
							type="date"
							value={formData.expiryDate}
							onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="status">Status</Label>
						<select
							id="status"
							className="flex h-10 w-full rounded-md border border-stone-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-950 focus-visible:ring-offset-2"
							value={formData.status}
							onChange={(e) => setFormData({ ...formData, status: e.target.value })}
						>
							<option value="Active">Active</option>
							<option value="Inactive">Inactive</option>
						</select>
					</div>
				</div>

				<div className="flex justify-end pt-4">
					<Button type="submit" disabled={loading}>
						{loading ? "Creating..." : "Create Coupon"}
					</Button>
				</div>
			</form>
		</div>
	);
}
