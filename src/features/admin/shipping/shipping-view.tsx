"use client";

import Link from "next/link";

import { Globe, Plus, Truck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
	useDeleteShippingConfigMutation,
	useGetShippingConfigsQuery,
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
	{ code: "Worldwide", name: "Rest of the World" },
];

const initialZones = [
	{
		id: "ZONE-01",
		name: "UAE Domestic Shipping",
		countries: ["United Arab Emirates"],
		standardFee: 15.0,
		expressFee: 30.0,
		freeThreshold: 200.0,
		deliveryTime: "1 - 2 Business Days",
		status: "Active",
	},
	{
		id: "ZONE-02",
		name: "GCC Express Zone",
		countries: ["Saudi Arabia", "Oman", "Kuwait", "Qatar", "Bahrain"],
		standardFee: 45.0,
		expressFee: 85.0,
		freeThreshold: 500.0,
		deliveryTime: "2 - 4 Business Days",
		status: "Active",
	},
	{
		id: "ZONE-03",
		name: "Middle East & North Africa",
		countries: ["Egypt", "Jordan"],
		standardFee: 65.0,
		expressFee: 120.0,
		freeThreshold: 750.0,
		deliveryTime: "4 - 7 Business Days",
		status: "Active",
	},
	{
		id: "ZONE-04",
		name: "Rest of World International",
		countries: [
			"United Kingdom",
			"United States",
			"India",
			"Germany",
			"France",
			"Canada",
			"Australia",
		],
		standardFee: 95.0,
		expressFee: 160.0,
		freeThreshold: 1000.0,
		deliveryTime: "5 - 10 Business Days",
		status: "Active",
	},
];

export function ShippingView() {
	const { data, isLoading, refetch } = useGetShippingConfigsQuery();
	const deleteShippingMutation = useDeleteShippingConfigMutation();

	const zones = data?.shippingConfigs || [];

	const handleDelete = async (id: string) => {
		if (confirm("Are you sure you want to delete this shipping zone?")) {
			await deleteShippingMutation.mutateAsync({ id });
			refetch();
		}
	};

	return (
		<div className="space-y-6">
			{/* Header Banner */}
			<div className="flex flex-col justify-between gap-4 rounded-lg border border-slate-200/80 bg-white p-5 shadow-xs sm:flex-row sm:items-center dark:border-slate-800 dark:bg-slate-900">
				<div>
					<div className="flex items-center gap-2">
						<Truck className="h-5 w-5 text-primary" />
						<h1 className="font-extrabold text-slate-900 text-xl dark:text-white">
							Shipping & Multi-Country Delivery Rates
						</h1>
					</div>
					<p className="mt-1 text-slate-500 text-sm">
						Configure regional shipping zones, assign multiple destination
						countries, set rates in AED, and define free delivery thresholds.
					</p>
				</div>

				<Link href="/admin/shipping/new">
					<Button className="h-10 gap-2 px-4 font-semibold text-sm">
						<Plus className="h-4 w-4" />
						Add Shipping Zone
					</Button>
				</Link>
			</div>

			{/* Shipping Zones List */}
			<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
				{zones.map((zone) => (
					<div
						className="flex flex-col justify-between space-y-4 rounded-lg border border-slate-200/80 bg-white p-5 shadow-xs transition-all hover:border-primary/40 dark:border-slate-800 dark:bg-slate-900"
						key={zone.id}
					>
						<div className="space-y-3">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<Badge className="text-[10px]" variant="default">
										{zone.id}
									</Badge>
									<Badge className="text-[10px]" variant="success">
										{zone.status}
									</Badge>
								</div>
								<div className="flex items-center gap-1">
									<Link href={`/admin/shipping/${zone.id}`}>
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
										onClick={() => handleDelete(zone.id)}
										size="sm"
										variant="ghost"
									>
										Delete
									</Button>
								</div>
							</div>

							<div>
								<h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
									{zone.name}
								</h3>
								<div className="flex flex-col gap-0.5 text-slate-500 text-sm">
									<div>
										Standard Speed:{" "}
										<strong className="text-slate-700 dark:text-slate-300">
											{zone.deliveryTime}
										</strong>
									</div>
									{zone.isExpressEnabled !== false && (
										<div>
											Express Speed:{" "}
											<strong className="text-slate-700 dark:text-slate-300">
												{zone.expressDeliveryTime || "1 - 2 Days"}
											</strong>
										</div>
									)}
								</div>
							</div>

							{/* Destination Countries List */}
							<div className="space-y-1.5 pt-1">
								<div className="flex items-center gap-1 font-semibold text-[11px] text-slate-500 uppercase tracking-wider">
									<Globe className="h-3.5 w-3.5 text-primary" /> Included
									Countries ({zone.countries.length}):
								</div>
								<div className="flex flex-wrap gap-1.5">
									{zone.countries.map((c: string) => {
										const countryName =
											availableCountries.find((ac) => ac.code === c)?.name || c;
										return (
											<Badge
												className="border border-slate-200/60 bg-slate-100 px-2 py-0.5 text-[11px] text-slate-700 dark:border-slate-700/60 dark:bg-slate-800 dark:text-slate-300"
												key={c}
												variant="secondary"
											>
												{countryName}
											</Badge>
										);
									})}
								</div>
							</div>

							{/* Rate Rules Grid */}
							<div className="grid grid-cols-2 gap-2 border-slate-100 border-t pt-3 md:grid-cols-4 dark:border-slate-800">
								<div className="rounded-lg bg-slate-50 p-2.5 text-center dark:bg-slate-800/50">
									<div className="text-[10px] text-slate-500">
										Standard Rate
									</div>
									<div className="font-extrabold text-base text-slate-900 dark:text-white">
										AED {zone.standardFee.toFixed(2)}
									</div>
								</div>

								<div className="rounded-lg bg-slate-50 p-2.5 text-center dark:bg-slate-800/50">
									<div className="text-[10px] text-slate-400">
										Express Delivery
									</div>
									<div className="font-bold text-slate-900 dark:text-white">
										{zone.isExpressEnabled === false ? (
											<span className="font-normal text-slate-400 text-xs">
												Disabled
											</span>
										) : (
											`AED ${zone.expressFee.toFixed(2)}`
										)}
									</div>
								</div>

								<div className="rounded-lg border border-emerald-500/20 bg-emerald-50/60 p-2.5 text-center dark:bg-emerald-950/20">
									<div className="font-semibold text-[10px] text-emerald-600 dark:text-emerald-400">
										Free Delivery Over
									</div>
									<div className="font-extrabold text-base text-emerald-600 dark:text-emerald-400">
										{zone.isFreeDeliveryEnabled ? (
											`AED ${zone.freeThreshold.toFixed(2)}`
										) : (
											<span className="font-normal text-xs opacity-70">
												Disabled
											</span>
										)}
									</div>
								</div>

								<div className="rounded-lg border border-amber-500/20 bg-amber-50/60 p-2.5 text-center dark:bg-amber-950/20">
									<div className="font-semibold text-[10px] text-amber-600 dark:text-amber-400">
										Cash on Delivery
									</div>
									<div className="font-extrabold text-base text-amber-600 dark:text-amber-400">
										{zone.isCodEnabled ? (
											`AED ${zone.codFee?.toFixed(2) || "0.00"}`
										) : (
											<span className="font-normal text-xs opacity-70">
												Disabled
											</span>
										)}
									</div>
								</div>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
