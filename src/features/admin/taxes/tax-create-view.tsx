"use client";

import * as React from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Save, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useCreateTaxConfigMutation } from "@/types/graphql";

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

export function TaxCreateView() {
	const router = useRouter();
	const queryClient = useQueryClient();
	const createTaxMutation = useCreateTaxConfigMutation();

	const [taxName, setTaxName] = React.useState("");
	const [taxRate, setTaxRate] = React.useState("5");
	const [taxRegion, setTaxRegion] = React.useState("UAE");
	const [appliedToShipping, setAppliedToShipping] = React.useState(true);

	const handleAddTax = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!taxName) return;

		try {
			const input = {
				name: taxName,
				rate: Number.parseFloat(taxRate) || 0,
				region: taxRegion,
				type: "Custom Rate",
				appliedToShipping,
				status: "Active",
			};

			await createTaxMutation.mutateAsync({ input });
			queryClient.invalidateQueries({ queryKey: ["GetTaxConfigs"] });
			router.push("/admin/taxes");
			router.refresh();
		} catch (error) {
			console.error("Failed to save tax config:", error);
		}
	};

	return (
		<div className="space-y-6">
			<div className="flex flex-col justify-between gap-4 rounded-lg border border-slate-200/80 bg-white p-5 shadow-xs sm:flex-row sm:items-center dark:border-slate-800 dark:bg-slate-900">
				<div>
					<div className="flex items-center gap-2">
						<ShieldCheck className="h-5 w-5 text-primary" />
						<h1 className="font-extrabold text-slate-900 text-xl dark:text-white">
							Add Tax Rule
						</h1>
					</div>
					<p className="mt-1 text-slate-500 text-sm">
						Define tax rates for specific shipping regions.
					</p>
				</div>
				<Link href="/admin/taxes">
					<Button className="h-10 gap-2 px-4 text-sm" variant="outline">
						<ArrowLeft className="h-4 w-4" /> Back to Taxes
					</Button>
				</Link>
			</div>

			<form
				className="max-w-2xl space-y-6 rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
				onSubmit={handleAddTax}
			>
				<div className="space-y-1">
					<label className="font-semibold text-slate-700 dark:text-slate-300">
						Tax Rule Name *
					</label>
					<Input
						className="h-10"
						onChange={(e) => setTaxName(e.target.value)}
						placeholder="e.g. Oman VAT Rule"
						required
						value={taxName}
					/>
				</div>

				<div className="grid grid-cols-2 gap-4">
					<div className="space-y-1">
						<label className="font-semibold text-slate-700 dark:text-slate-300">
							Tax Rate (%)
						</label>
						<Input
							className="h-10"
							onChange={(e) => setTaxRate(e.target.value)}
							type="number"
							value={taxRate}
						/>
					</div>
					<div className="space-y-1">
						<label className="font-semibold text-slate-700 dark:text-slate-300">
							Region
						</label>
						<select
							className="flex h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-1 shadow-sm transition-colors placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:focus-visible:ring-primary dark:placeholder:text-slate-400"
							onChange={(e) => setTaxRegion(e.target.value)}
							value={taxRegion}
						>
							{availableCountries.map((ac) => (
								<option key={ac.code} value={ac.code}>
									{ac.name}
								</option>
							))}
						</select>
					</div>
				</div>

				<label className="mt-4 flex cursor-pointer items-center gap-2">
					<input
						checked={appliedToShipping}
						className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
						onChange={(e) => setAppliedToShipping(e.target.checked)}
						type="checkbox"
					/>
					<span className="font-semibold text-slate-700 dark:text-slate-300">
						Apply tax to shipping cost
					</span>
				</label>

				<div className="flex justify-end pt-4">
					<Button className="h-10 gap-2 px-6" type="submit">
						<Save className="h-4 w-4" /> Save Tax Rule
					</Button>
				</div>
			</form>
		</div>
	);
}
