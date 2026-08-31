"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Save, Truck, X, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateShippingConfigMutation } from "@/types/graphql";

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
	{ code: "Worldwide", name: "Rest of the World" },
];

export function ShippingCreateView() {
	const router = useRouter();
	const queryClient = useQueryClient();
	const createShippingMutation = useCreateShippingConfigMutation();
	
	const [zoneName, setZoneName] = React.useState("");
	const [standardFee, setStandardFee] = React.useState("20");
	const [expressFee, setExpressFee] = React.useState("40");
	const [isExpressEnabled, setIsExpressEnabled] = React.useState(false);
	const [freeThreshold, setFreeThreshold] = React.useState("300");
	const [deliveryTime, setDeliveryTime] = React.useState("2 - 3 Days");
	const [expressDeliveryTime, setExpressDeliveryTime] = React.useState("1 - 2 Days");
	const [selectedCountries, setSelectedCountries] = React.useState<string[]>([]);

	const toggleCountry = (country: string) => {
		if (selectedCountries.includes(country)) {
			setSelectedCountries(selectedCountries.filter((c) => c !== country));
		} else {
			setSelectedCountries([...selectedCountries, country]);
		}
	};

	const handleAddZone = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!zoneName || selectedCountries.length === 0) return;

		try {
			const input = {
				name: zoneName,
				countries: selectedCountries,
				standardFee: parseFloat(standardFee) || 0,
				expressFee: parseFloat(expressFee) || 0,
				isExpressEnabled,
				freeThreshold: parseFloat(freeThreshold) || 0,
				deliveryTime,
				expressDeliveryTime,
				status: "Active",
			};

			await createShippingMutation.mutateAsync({ input });
			queryClient.invalidateQueries({ queryKey: ["GetShippingConfigs"] });
			router.push("/admin/shipping");
			router.refresh();
		} catch (error) {
			console.error("Failed to save shipping config:", error);
		}
	};

	return (
		<div className="space-y-6">
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-lg border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
				<div>
					<div className="flex items-center gap-2">
						<Truck className="h-5 w-5 text-primary" />
						<h1 className="font-extrabold text-xl text-slate-900 dark:text-white">
							Create Shipping Zone
						</h1>
					</div>
					<p className="text-sm text-slate-500 mt-1">
						Assign multiple countries and set delivery rates in AED.
					</p>
				</div>
				<Link href="/admin/shipping">
					<Button className="h-10 gap-2 px-4 text-sm" variant="outline">
						<ArrowLeft className="h-4 w-4" /> Back to Shipping
					</Button>
				</Link>
			</div>

			<form className="grid max-w-5xl grid-cols-1 gap-6 lg:grid-cols-3" onSubmit={handleAddZone}>
				<div className="space-y-6 rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm lg:col-span-2 dark:border-slate-800 dark:bg-slate-900">
					<div className="space-y-2">
						<label className="font-semibold text-slate-700 dark:text-slate-300">
							Zone Name *
						</label>
						<Input
							required
							placeholder="e.g. GCC Premium Express"
							value={zoneName}
							onChange={(e) => setZoneName(e.target.value)}
							className="h-10 text-sm"
						/>
					</div>

					<div className="space-y-2">
						<label className="font-semibold text-slate-700 dark:text-slate-300">
							Select Destination Countries ({selectedCountries.length} selected) *
						</label>
						<div className="flex flex-wrap gap-2 p-4 max-h-48 overflow-y-auto rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/50">
							{availableCountries.map((country) => {
								const isSelected = selectedCountries.includes(country.code);
								return (
									<button
										key={country.code}
										type="button"
										onClick={() => toggleCountry(country.code)}
										className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
											isSelected
												? "bg-primary text-white shadow-xs"
												: "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
										}`}
									>
										{country.name}
										{isSelected ? (
											<X className="h-3.5 w-3.5" />
										) : (
											<Plus className="h-3.5 w-3.5" />
										)}
									</button>
								);
							})}
						</div>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<div className="space-y-2">
							<label className="font-semibold text-slate-700 dark:text-slate-300">
								Standard Fee (AED)
							</label>
							<Input
								type="number"
								value={standardFee}
								onChange={(e) => setStandardFee(e.target.value)}
								className="h-10 text-sm"
							/>
						</div>
						<div className="space-y-2">
							<label className="font-semibold text-slate-700 dark:text-slate-300">
								Free Delivery Over (AED)
							</label>
							<Input
								type="number"
								value={freeThreshold}
								onChange={(e) => setFreeThreshold(e.target.value)}
								className="h-10 text-sm"
							/>
						</div>
					</div>

					<div className="space-y-2">
						<label className="font-semibold text-slate-700 dark:text-slate-300">
							Standard Delivery Time
						</label>
						<Input
							placeholder="e.g. 2 - 4 Business Days"
							value={deliveryTime}
							onChange={(e) => setDeliveryTime(e.target.value)}
							className="h-10 text-sm"
						/>
					</div>

					<div className="pt-4 border-t border-slate-100 dark:border-slate-800">
						<label className="flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-300 cursor-pointer w-fit">
							<input 
								type="checkbox" 
								checked={isExpressEnabled}
								onChange={(e) => setIsExpressEnabled(e.target.checked)}
								className="rounded border-slate-300 text-primary focus:ring-primary h-4 w-4"
							/>
							Enable Express Delivery
						</label>
					</div>

					{isExpressEnabled && (
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div className="space-y-2">
								<label className="font-semibold text-slate-700 dark:text-slate-300">
									Express Fee (AED)
								</label>
								<Input
									type="number"
									value={expressFee}
									onChange={(e) => setExpressFee(e.target.value)}
									className="h-10 text-sm"
								/>
							</div>
							<div className="space-y-2">
								<label className="font-semibold text-slate-700 dark:text-slate-300">
									Express Delivery Time
								</label>
								<Input
									placeholder="e.g. 1 - 2 Business Days"
									value={expressDeliveryTime}
									onChange={(e) => setExpressDeliveryTime(e.target.value)}
									className="h-10 text-sm"
								/>
							</div>
						</div>
					)}
				</div>

				<div className="space-y-6 lg:col-span-1">
					<div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
						<Button className="h-11 w-full gap-2" type="submit" disabled={createShippingMutation.isPending}>
							<Save className="h-4 w-4" /> 
							{createShippingMutation.isPending ? "Creating..." : "Save Shipping Zone"}
						</Button>
					</div>
				</div>
			</form>
		</div>
	);
}
