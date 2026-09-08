"use client";

import Link from "next/link";

import { Plus, Receipt } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
	useCreateTaxConfigMutation,
	useDeleteTaxConfigMutation,
	useGetTaxConfigsQuery,
	useUpdateTaxConfigMutation,
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
		<div className="max-w-5xl space-y-6">
			{/* Header Banner */}
			<div className="flex flex-col justify-between gap-4 rounded-lg border border-slate-200/80 bg-white p-5 shadow-xs sm:flex-row sm:items-center dark:border-slate-800 dark:bg-slate-900">
				<div>
					<div className="flex items-center gap-2">
						<Receipt className="h-5 w-5 text-primary" />
						<h1 className="font-extrabold text-slate-900 text-xl dark:text-white">
							Taxes & UAE VAT Settings
						</h1>
					</div>
					<p className="mt-1 text-slate-500 text-sm">
						Configure regional VAT percentages, Tax Registration Numbers (TRN),
						and storefront invoice calculations.
					</p>
				</div>
			</div>

			{/* Tax Rules Table */}
			<div className="space-y-4 rounded-lg border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
				<div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
					<div>
						<h2 className="font-bold text-lg text-slate-900 dark:text-white">
							Regional Tax & VAT Rates
						</h2>
						<p className="text-slate-500 text-sm">
							Applied rates based on delivery location across UAE, GCC, and
							International orders
						</p>
					</div>

					<Link href="/admin/taxes/new">
						<Button className="h-9 gap-1.5 text-sm" size="sm">
							<Plus className="h-4 w-4" /> Add Tax Rule
						</Button>
					</Link>
				</div>

				<div className="overflow-x-auto">
					<table className="w-full text-left text-sm">
						<thead className="border-slate-200 border-b text-slate-500 dark:border-slate-800">
							<tr>
								<th className="px-3 py-2.5 font-semibold">Rule ID</th>
								<th className="px-3 py-2.5 font-semibold">Tax Name & Region</th>
								<th className="px-3 py-2.5 font-semibold">Tax Rate</th>
								<th className="px-3 py-2.5 font-semibold">Shipping Taxed</th>
								<th className="px-3 py-2.5 font-semibold">Actions</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-slate-100 dark:divide-slate-800">
							{taxes.map((t) => (
								<tr
									className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
									key={t.id}
								>
									<td className="px-3 py-3 font-semibold text-primary">
										{t.id}
									</td>
									<td className="px-3 py-3">
										<div className="font-semibold text-slate-900 dark:text-white">
											{t.name}
										</div>
										<div className="text-[11px] text-slate-500">
											{availableCountries.find((ac) => ac.code === t.region)
												?.name || t.region}
										</div>
									</td>
									<td className="px-3 py-3 font-extrabold text-base text-slate-900 dark:text-white">
										{t.rate.toFixed(1)}%
									</td>
									<td className="px-3 py-3">
										<Badge
											className="text-[10px]"
											variant={t.appliedToShipping ? "secondary" : "outline"}
										>
											{t.appliedToShipping ? "Yes (Taxed)" : "No"}
										</Badge>
									</td>
									<td className="px-3 py-3">
										<div className="flex items-center gap-1">
											<Link href={`/admin/taxes/${t.id}`}>
												<Button
													className="h-7 px-2 text-xs"
													size="sm"
													variant="ghost"
												>
													Edit
												</Button>
											</Link>
											<Button
												className="h-7 px-2 text-red-500 text-xs hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30"
												onClick={() => handleDelete(t.id)}
												size="sm"
												variant="ghost"
											>
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
