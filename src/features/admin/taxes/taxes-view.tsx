"use client";

import * as React from "react";
import Link from "next/link";
import {
	Plus,
	Receipt,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	useGetTaxConfigsQuery,
	useCreateTaxConfigMutation,
	useUpdateTaxConfigMutation,
	useDeleteTaxConfigMutation,
} from "@/types/graphql";

const availableCountries = [
	{ code: "UAE", name: "United Arab Emirates" },
	{ code: "KSA", name: "Saudi Arabia" },
	{ code: "Oman", name: "Oman" },
	{ code: "Kuwait", name: "Kuwait" },
	{ code: "Qatar", name: "Qatar" },
	{ code: "Bahrain", name: "Bahrain" },
	{ code: "UK", name: "United Kingdom" },
	{ code: "US", name: "United States" },
	{ code: "India", name: "India" },
	{ code: "Egypt", name: "Egypt" },
	{ code: "Jordan", name: "Jordan" },
	{ code: "Germany", name: "Germany" },
	{ code: "France", name: "France" },
	{ code: "Canada", name: "Canada" },
	{ code: "Australia", name: "Australia" },
	{ code: "Global", name: "Global" },
	{ code: "Worldwide", name: "Rest of the World" },
];

const initialTaxes = [
	{
		id: "TAX-01",
		name: "UAE Standard Value Added Tax",
		rate: 5.0,
		region: "United Arab Emirates",
		type: "Standard VAT",
		appliedToShipping: true,
		status: "Active",
	},
	{
		id: "TAX-02",
		name: "Saudi Arabia GCC VAT",
		rate: 15.0,
		region: "Saudi Arabia (KSA)",
		type: "Regional VAT",
		appliedToShipping: true,
		status: "Active",
	},
	{
		id: "TAX-03",
		name: "International Export Sales",
		rate: 0.0,
		region: "Rest of World (Non-GCC)",
		type: "Zero-Rated (0%)",
		appliedToShipping: false,
		status: "Active",
	},
];

export function TaxesView() {
	const { data, isLoading, refetch } = useGetTaxConfigsQuery();
	const createTaxMutation = useCreateTaxConfigMutation();
	const updateTaxMutation = useUpdateTaxConfigMutation();
	const deleteTaxMutation = useDeleteTaxConfigMutation();
	
	const taxes = data?.taxConfigs || [];

	const handleDelete = async (id: string) => {
		if (confirm("Are you sure you want to delete this tax rule?")) {
			await deleteTaxMutation.mutateAsync({ id });
			refetch();
		}
	};

	return (
		<div className="space-y-6 max-w-5xl">
			{/* Header Banner */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-lg border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
				<div>
					<div className="flex items-center gap-2">
						<Receipt className="h-5 w-5 text-primary" />
						<h1 className="font-extrabold text-xl text-slate-900 dark:text-white">
							Taxes & UAE VAT Settings
						</h1>
					</div>
					<p className="text-sm text-slate-500 mt-1">
						Configure regional VAT percentages, Tax Registration Numbers (TRN),
						and storefront invoice calculations.
					</p>
				</div>
			</div>

			{/* Tax Rules Table */}
			<div className="space-y-4 rounded-lg border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
				<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
					<div>
						<h2 className="font-bold text-lg text-slate-900 dark:text-white">
							Regional Tax & VAT Rates
						</h2>
						<p className="text-sm text-slate-500">
							Applied rates based on delivery location across UAE, GCC, and
							International orders
						</p>
					</div>

					<Link href="/admin/taxes/new">
						<Button size="sm" className="gap-1.5 text-sm h-9">
							<Plus className="h-4 w-4" /> Add Tax Rule
						</Button>
					</Link>
				</div>

				<div className="overflow-x-auto">
					<table className="w-full text-left text-sm">
						<thead className="border-b border-slate-200 text-slate-500 dark:border-slate-800">
							<tr>
								<th className="py-2.5 px-3 font-semibold">Rule ID</th>
								<th className="py-2.5 px-3 font-semibold">Tax Name & Region</th>
								<th className="py-2.5 px-3 font-semibold">Tax Rate</th>
								<th className="py-2.5 px-3 font-semibold">Shipping Taxed</th>
								<th className="py-2.5 px-3 font-semibold">Actions</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-slate-100 dark:divide-slate-800">
							{taxes.map((t) => (
								<tr
									key={t.id}
									className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
								>
									<td className="py-3 px-3 font-semibold text-primary">
										{t.id}
									</td>
									<td className="py-3 px-3">
										<div className="font-semibold text-slate-900 dark:text-white">
											{t.name}
										</div>
										<div className="text-[11px] text-slate-500">
											{availableCountries.find((ac) => ac.code === t.region)?.name || t.region}
										</div>
									</td>
									<td className="py-3 px-3 font-extrabold text-slate-900 dark:text-white text-base">
										{t.rate.toFixed(1)}%
									</td>
									<td className="py-3 px-3">
										<Badge
											variant={t.appliedToShipping ? "secondary" : "outline"}
											className="text-[10px]"
										>
											{t.appliedToShipping ? "Yes (Taxed)" : "No"}
										</Badge>
									</td>
									<td className="py-3 px-3">
										<div className="flex items-center gap-1">
											<Link href={`/admin/taxes/${t.id}`}>
												<Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
													Edit
												</Button>
											</Link>
											<Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30" onClick={() => handleDelete(t.id)}>
												Delete
											</Button>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}
