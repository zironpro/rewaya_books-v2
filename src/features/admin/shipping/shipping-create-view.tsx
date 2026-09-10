"use client";

import * as React from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Plus, Save, Truck, X } from "lucide-react";

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
	const [isFreeDeliveryEnabled, setIsFreeDeliveryEnabled] = React.useState(false);
	const [freeThreshold, setFreeThreshold] = React.useState("300");
	const [deliveryTime, setDeliveryTime] = React.useState("2 - 3 Days");
	const [expressDeliveryTime, setExpressDeliveryTime] =
		React.useState("1 - 2 Days");
	const [isCodEnabled, setIsCodEnabled] = React.useState(false);
	const [codFee, setCodFee] = React.useState("15");
	const [selectedCountries, setSelectedCountries] = React.useState<string[]>(
		[]
	);

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
				standardFee: Number.parseFloat(standardFee) || 0,
				expressFee: Number.parseFloat(expressFee) || 0,
				isExpressEnabled,
				isFreeDeliveryEnabled,
				freeThreshold: Number.parseFloat(freeThreshold) || 0,
				deliveryTime,
				expressDeliveryTime,
				isCodEnabled,
				codFee: Number.parseFloat(codFee) || 0,
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
			<div className="flex flex-col justify-between gap-4 rounded-lg border border-slate-200/80 bg-white p-5 shadow-xs sm:flex-row sm:items-center dark:border-slate-800 dark:bg-slate-900">
				<div>
					<div className="flex items-center gap-2">
						<Truck className="h-5 w-5 text-primary" />
						<h1 className="font-extrabold text-slate-900 text-xl dark:text-white">
							Create Shipping Zone
						</h1>
					</div>
					<p className="mt-1 text-slate-500 text-sm">
						Assign multiple countries and set delivery rates in AED.
					</p>
				</div>
				<Link href="/admin/shipping">
					<Button className="h-10 gap-2 px-4 text-sm" variant="outline">
						<ArrowLeft className="h-4 w-4" /> Back to Shipping
					</Button>
				</Link>
			</div>

			<form
				className="grid max-w-5xl grid-cols-1 gap-6 lg:grid-cols-3"
				onSubmit={handleAddZone}
			>
				<div className="space-y-6 rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm lg:col-span-2 dark:border-slate-800 dark:bg-slate-900">
					<div className="space-y-2">
						<label className="font-semibold text-slate-700 dark:text-slate-300">
							Zone Name *
						</label>
						<Input
							className="h-10 text-sm"
							onChange={(e) => setZoneName(e.target.value)}
							placeholder="e.g. GCC Premium Express"
							required
							value={zoneName}
						/>
					</div>

					<div className="space-y-2">
						<label className="font-semibold text-slate-700 dark:text-slate-300">
							Select Destination Countries ({selectedCountries.length} selected)
							*
						</label>
						<div className="flex max-h-48 flex-wrap gap-2 overflow-y-auto rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50">
							{availableCountries.map((country) => {
								const isSelected = selectedCountries.includes(country.code);
								return (
									<button
										className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 font-medium text-xs transition-all ${
											isSelected
												? "bg-primary text-white shadow-xs"
												: "border border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
										}`}
										key={country.code}
										onClick={() => toggleCountry(country.code)}
										type="button"
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

					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<div className="space-y-2">
							<label className="font-semibold text-slate-700 dark:text-slate-300">
								Standard Fee (AED)
							</label>
							<Input
								className="h-10 text-sm"
								onChange={(e) => setStandardFee(e.target.value)}
								type="number"
								value={standardFee}
							/>
						</div>
						<div className="space-y-2">
							<label className="flex w-fit cursor-pointer items-center gap-2 font-semibold text-slate-700 dark:text-slate-300">
								<input
									checked={isFreeDeliveryEnabled}
									className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
									onChange={(e) => setIsFreeDeliveryEnabled(e.target.checked)}
									type="checkbox"
								/>
								Enable Free Delivery
							</label>
							{isFreeDeliveryEnabled && (
								<div className="mt-2">
									<label className="mb-2 block font-semibold text-slate-700 text-sm dark:text-slate-300">
										Free Delivery Over (AED)
									</label>
									<Input
										className="h-10 text-sm"
										onChange={(e) => setFreeThreshold(e.target.value)}
										type="number"
										value={freeThreshold}
									/>
								</div>
							)}
						</div>
					</div>

					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<div className="space-y-2">
							<label className="font-semibold text-slate-700 dark:text-slate-300">
								Standard Delivery Time
							</label>
							<Input
								className="h-10 text-sm"
								onChange={(e) => setDeliveryTime(e.target.value)}
								placeholder="e.g. 2 - 4 Business Days"
								value={deliveryTime}
							/>
						</div>
						<div className="space-y-2">
							<label className="flex w-fit cursor-pointer items-center gap-2 font-semibold text-slate-700 dark:text-slate-300">
								<input
									checked={isCodEnabled}
									className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
									onChange={(e) => setIsCodEnabled(e.target.checked)}
									type="checkbox"
								/>
								Enable Cash on Delivery
							</label>
							{isCodEnabled && (
								<div className="mt-2">
									<label className="mb-2 block font-semibold text-slate-700 text-sm dark:text-slate-300">
										COD Fee (AED)
									</label>
									<Input
										className="h-10 text-sm"
										onChange={(e) => setCodFee(e.target.value)}
										placeholder="e.g. 15"
										type="number"
										value={codFee}
									/>
								</div>
							)}
						</div>
					</div>

					<div className="border-slate-100 border-t pt-4 dark:border-slate-800">
						<label className="flex w-fit cursor-pointer items-center gap-2 font-semibold text-slate-700 dark:text-slate-300">
							<input
								checked={isExpressEnabled}
								className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
								onChange={(e) => setIsExpressEnabled(e.target.checked)}
								type="checkbox"
							/>
							Enable Express Delivery
						</label>
					</div>

					{isExpressEnabled && (
						<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
							<div className="space-y-2">
								<label className="font-semibold text-slate-700 dark:text-slate-300">
									Express Fee (AED)
								</label>
								<Input
									className="h-10 text-sm"
									onChange={(e) => setExpressFee(e.target.value)}
									type="number"
									value={expressFee}
								/>
							</div>
							<div className="space-y-2">
								<label className="font-semibold text-slate-700 dark:text-slate-300">
									Express Delivery Time
								</label>
								<Input
									className="h-10 text-sm"
									onChange={(e) => setExpressDeliveryTime(e.target.value)}
									placeholder="e.g. 1 - 2 Business Days"
									value={expressDeliveryTime}
								/>
							</div>
						</div>
					)}
				</div>

				<div className="space-y-6 lg:col-span-1">
					<div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
						<Button
							className="h-11 w-full gap-2"
							disabled={createShippingMutation.isPending}
							type="submit"
						>
							<Save className="h-4 w-4" />
							{createShippingMutation.isPending
								? "Creating..."
								: "Save Shipping Zone"}
						</Button>
					</div>
				</div>
			</form>
		</div>
	);
}
