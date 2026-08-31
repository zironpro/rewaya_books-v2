"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Save, ShieldCheck } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGetTaxConfigsQuery, useUpdateTaxConfigMutation } from "@/types/graphql";

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

export function TaxEditView({ taxId }: { taxId: string }) {
	const router = useRouter();
	const queryClient = useQueryClient();
	const { data, isLoading } = useGetTaxConfigsQuery();
	const updateTaxMutation = useUpdateTaxConfigMutation();

	const tax = data?.taxConfigs?.find((t) => t.id === taxId);

	const [taxName, setTaxName] = React.useState("");
	const [taxRate, setTaxRate] = React.useState("5");
	const [taxRegion, setTaxRegion] = React.useState("UAE");
	const [appliedToShipping, setAppliedToShipping] = React.useState(true);

	React.useEffect(() => {
		if (tax) {
			setTaxName(tax.name);
			setTaxRate(tax.rate.toString());
			setTaxRegion(tax.region);
			setAppliedToShipping(tax.appliedToShipping);
		}
	}, [tax]);

	const handleUpdateTax = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!taxName) return;

		try {
			const input = {
				name: taxName,
				rate: parseFloat(taxRate) || 0,
				region: taxRegion,
				type: "Custom Rate",
				appliedToShipping,
				status: "Active",
			};

			await updateTaxMutation.mutateAsync({ id: taxId, input });
			queryClient.invalidateQueries({ queryKey: ["GetTaxConfigs"] });
			router.push("/admin/taxes");
			router.refresh();
		} catch (error) {
			console.error("Failed to save tax config:", error);
		}
	};

	if (isLoading) return <div>Loading...</div>;
	if (!tax) return <div>Tax rule not found.</div>;

	return (
		<div className="space-y-6">
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-lg border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
				<div>
					<div className="flex items-center gap-2">
						<ShieldCheck className="h-5 w-5 text-primary" />
						<h1 className="font-extrabold text-xl text-slate-900 dark:text-white">
							Edit Tax Rule
						</h1>
					</div>
					<p className="text-sm text-slate-500 mt-1">
						Update tax rates for specific shipping regions.
					</p>
				</div>
				<Link href="/admin/taxes">
					<Button className="h-10 gap-2 px-4 text-sm" variant="outline">
						<ArrowLeft className="h-4 w-4" /> Back to Taxes
					</Button>
				</Link>
			</div>

			<form className="max-w-2xl space-y-6 rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900" onSubmit={handleUpdateTax}>
				<div className="space-y-1">
					<label className="font-semibold text-slate-700 dark:text-slate-300">
						Tax Rule Name *
					</label>
					<Input
						required
						placeholder="e.g. Oman VAT Rule"
						value={taxName}
						onChange={(e) => setTaxName(e.target.value)}
						className="h-10"
					/>
				</div>

				<div className="grid grid-cols-2 gap-4">
					<div className="space-y-1">
						<label className="font-semibold text-slate-700 dark:text-slate-300">
							Tax Rate (%)
						</label>
						<Input
							type="number"
							value={taxRate}
							onChange={(e) => setTaxRate(e.target.value)}
							className="h-10"
						/>
					</div>
					<div className="space-y-1">
						<label className="font-semibold text-slate-700 dark:text-slate-300">
							Region
						</label>
						<select
							value={taxRegion}
							onChange={(e) => setTaxRegion(e.target.value)}
							className="flex h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-1 shadow-sm transition-colors placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:placeholder:text-slate-400 dark:focus-visible:ring-primary"
						>
							{availableCountries.map((ac) => (
								<option key={ac.code} value={ac.code}>
									{ac.name}
								</option>
							))}
						</select>
					</div>
				</div>

				<label className="flex items-center gap-2 mt-4 cursor-pointer">
					<input 
						type="checkbox" 
						checked={appliedToShipping}
						onChange={(e) => setAppliedToShipping(e.target.checked)}
						className="rounded border-slate-300 h-4 w-4 text-primary focus:ring-primary"
					/>
					<span className="font-semibold text-slate-700 dark:text-slate-300">Apply tax to shipping cost</span>
				</label>

				<div className="pt-4 flex justify-end">
					<Button type="submit" className="gap-2 h-10 px-6">
						<Save className="h-4 w-4" /> Save Tax Rule
					</Button>
				</div>
			</form>
		</div>
	);
}
