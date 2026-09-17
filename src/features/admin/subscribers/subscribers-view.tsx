"use client";

import { useEffect, useState } from "react";
import { Download, Mail, Search, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function SubscribersView() {
	const [subscribers, setSubscribers] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [search, setSearch] = useState("");

	useEffect(() => {
		const fetchSubscribers = async () => {
			try {
				const res = await fetch("/api/subscribe");
				if (res.ok) {
					const data = await res.json();
					setSubscribers(data);
				}
			} catch (error) {
				console.error("Error fetching subscribers", error);
			} finally {
				setLoading(false);
			}
		};
		fetchSubscribers();
	}, []);

	const filtered = subscribers.filter((s) =>
		s.email.toLowerCase().includes(search.toLowerCase())
	);

	const activeCount = subscribers.filter((s) => s.status === "subscribed").length;

	const handleDownloadCSV = () => {
		const activeSubscribers = subscribers.filter(s => s.status === "subscribed");
		if (activeSubscribers.length === 0) return;

		const csvContent = [
			"Email,Status,Join Date",
			...activeSubscribers.map(sub => `${sub.email},${sub.status},${new Date(sub.createdAt).toLocaleDateString()}`)
		].join("\\n");

		const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.setAttribute('download', 'subscribed_users.csv');
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	return (
		<div className="space-y-6">
			{/* Header Banner */}
			<div className="flex flex-col justify-between gap-4 rounded-lg border border-slate-200/80 bg-white p-5 shadow-xs sm:flex-row sm:items-center dark:border-slate-800 dark:bg-slate-900">
				<div>
					<div className="flex items-center gap-2">
						<Users className="h-5 w-5 text-primary" />
						<h1 className="font-extrabold text-slate-900 text-xl dark:text-white">
							Newsletter Subscribers
						</h1>
					</div>
					<p className="mt-1 text-slate-500 text-sm">
						Manage your mailing list and track active subscriptions.
					</p>
				</div>

				<div className="flex flex-col gap-2 sm:flex-row sm:items-center">
					<Badge
						className="self-start px-3 py-1 text-sm sm:self-auto"
						variant="outline"
					>
						{activeCount} Active Subscribers
					</Badge>
					<Button
						onClick={handleDownloadCSV}
						variant="default"
						className="gap-2"
						disabled={activeCount === 0}
					>
						<Download className="h-4 w-4" />
						Export Subscribed (CSV)
					</Button>
				</div>
			</div>

			{/* Search Bar */}
			<div className="rounded-lg border border-slate-200/80 bg-white p-3 shadow-xs dark:border-slate-800 dark:bg-slate-900">
				<div className="relative w-full sm:w-80">
					<Search className="absolute top-2.5 left-2.5 h-4 w-4 text-slate-400" />
					<Input
						className="h-9 border-none bg-slate-50 pl-8 text-sm dark:bg-slate-800"
						onChange={(e) => setSearch(e.target.value)}
						placeholder="Search by email address..."
						value={search}
					/>
				</div>
			</div>

			{/* Subscribers List */}
			{loading ? (
				<div className="p-8 text-center text-slate-500">Loading subscribers...</div>
			) : filtered.length === 0 ? (
				<div className="p-8 text-center text-slate-500">No subscribers found.</div>
			) : (
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{filtered.map((sub) => (
						<div
							className="flex flex-col justify-between space-y-4 rounded-lg border border-slate-200/80 bg-white p-5 shadow-xs transition-all hover:border-primary/40 dark:border-slate-800 dark:bg-slate-900"
							key={sub._id}
						>
							<div className="space-y-2">
								<div className="flex items-center justify-between">
									<Badge
										className="text-[10px]"
										variant={sub.status === "subscribed" ? "default" : "secondary"}
									>
										{sub.status.toUpperCase()}
									</Badge>
								</div>

								<div>
									<div className="mt-0.5 flex items-center gap-1.5 text-slate-900 font-medium">
										<Mail className="h-4 w-4 text-slate-400" />
										<span className="truncate">{sub.email}</span>
									</div>
								</div>
							</div>

							<div className="border-slate-100 border-t pt-3 text-sm dark:border-slate-800">
								<div className="text-[10px] text-slate-400">Joined On</div>
								<div className="font-medium text-slate-700 dark:text-slate-300">
									{new Date(sub.createdAt).toLocaleDateString()}
								</div>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
