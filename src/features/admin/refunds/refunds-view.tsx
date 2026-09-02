"use client";

import { useGetRefundRequestsQuery } from "@/types/graphql";
import { format } from "date-fns";
import { Eye, RefreshCcw, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

const STATUS_VARIANTS: Record<string, "default" | "secondary" | "destructive" | "success" | "outline"> = {
	PENDING: "outline",
	ACCEPTED: "secondary",
	REJECTED: "destructive",
	REFUNDED: "success",
};

export function RefundsView() {
	const { data, isLoading } = useGetRefundRequestsQuery();
	const [searchQuery, setSearchQuery] = useState("");

	const requests = data?.refundRequests || [];

	const filteredRequests = requests.filter((r) =>
		r.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
		r.order?.email?.toLowerCase().includes(searchQuery.toLowerCase())
	);

	return (
		<div className="space-y-6">
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 className="font-bold text-3xl tracking-tight text-slate-900 dark:text-white">
						Refund Requests
					</h1>
					<p className="text-slate-500 text-sm">
						Manage customer refund and return requests.
					</p>
				</div>
			</div>

			<Card>
				<CardContent className="p-0">
					<div className="flex items-center justify-between border-b border-slate-100 p-4 dark:border-slate-800">
						<div className="relative w-full max-w-sm">
							<Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
							<Input
								placeholder="Search by Order ID or email..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="pl-9"
							/>
						</div>
					</div>

					<div className="overflow-x-auto">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Order ID</TableHead>
									<TableHead>Date</TableHead>
									<TableHead>Customer</TableHead>
									<TableHead>Payment</TableHead>
									<TableHead>Total</TableHead>
									<TableHead>Status</TableHead>
									<TableHead className="text-right">Action</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{isLoading ? (
									<TableRow>
										<TableCell colSpan={7} className="py-8 text-center text-slate-500">
											Loading requests...
										</TableCell>
									</TableRow>
								) : filteredRequests.length === 0 ? (
									<TableRow>
										<TableCell colSpan={7} className="py-8 text-center text-slate-500">
											No refund requests found.
										</TableCell>
									</TableRow>
								) : (
									filteredRequests.map((request: any) => (
										<TableRow key={request.id}>
											<TableCell className="font-medium">
												#{request.orderId.slice(-6).toUpperCase()}
											</TableCell>
											<TableCell className="text-slate-500">
												{format(new Date(Number(request.createdAt)), "MMM d, yyyy")}
											</TableCell>
											<TableCell>
												{request.order?.email || "Unknown"}
											</TableCell>
											<TableCell>
												<Badge variant="outline">
													{request.order?.paymentMethod || "N/A"}
												</Badge>
											</TableCell>
											<TableCell>
												AED {request.order?.total?.toFixed(2) || "0.00"}
											</TableCell>
											<TableCell>
												<Badge variant={STATUS_VARIANTS[request.status] || "default"}>
													{request.status}
												</Badge>
											</TableCell>
											<TableCell className="text-right">
												<Button variant="ghost" size="sm" asChild>
													<Link href={`/admin/refunds/${request.id}`}>
														<Eye className="mr-2 h-4 w-4" /> View
													</Link>
												</Button>
											</TableCell>
										</TableRow>
									))
								)}
							</TableBody>
						</Table>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
