"use client";

import { useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { format } from "date-fns";
import { ArrowLeft, CheckCircle2, DollarSign, XCircle } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

import {
	useGetRefundRequestQuery,
	useProcessStripeRefundMutation,
	useUpdateRefundRequestStatusMutation,
} from "@/types/graphql";

const STATUS_VARIANTS: Record<
	string,
	"default" | "secondary" | "destructive" | "success" | "outline"
> = {
	PENDING: "outline",
	ACCEPTED: "secondary",
	REJECTED: "destructive",
	REFUNDED: "success",
};

export function RefundDetailView({ id }: { id: string }) {
	const router = useRouter();
	const { data, isLoading, refetch } = useGetRefundRequestQuery({ id });
	const updateStatusMutation = useUpdateRefundRequestStatusMutation();
	const processStripeRefundMutation = useProcessStripeRefundMutation();

	const [adminNotes, setAdminNotes] = useState("");
	const [isProcessing, setIsProcessing] = useState(false);

	const request = data?.refundRequest;

	if (isLoading) return <div>Loading refund request...</div>;
	if (!request) return <div>Refund request not found.</div>;

	const handleUpdateStatus = async (status: string) => {
		setIsProcessing(true);
		try {
			await updateStatusMutation.mutateAsync({
				id,
				status,
				adminNotes: adminNotes || request.adminNotes || "",
			});
			toast.success(`Request marked as ${status}`);
			await refetch();
		} catch (err: any) {
			toast.error(err.message || "Failed to update status");
		} finally {
			setIsProcessing(false);
		}
	};

	const handleProcessRefund = async () => {
		if (request.order?.paymentMethod !== "Stripe") {
			// Manual refund for COD
			handleUpdateStatus("REFUNDED");
			return;
		}

		if (
			!confirm(
				"Are you sure you want to process the Stripe refund? This cannot be undone."
			)
		)
			return;

		setIsProcessing(true);
		try {
			await processStripeRefundMutation.mutateAsync({ id });
			toast.success("Stripe refund processed successfully!");
			await refetch();
		} catch (err: any) {
			toast.error(err.message || "Failed to process Stripe refund");
		} finally {
			setIsProcessing(false);
		}
	};

	return (
		<div className="space-y-6">
			<div className="flex items-center gap-4">
				<Button onClick={() => router.back()} size="icon" variant="ghost">
					<ArrowLeft className="h-5 w-5" />
				</Button>
				<div>
					<h1 className="font-bold text-2xl text-slate-900 tracking-tight dark:text-white">
						Refund Request #{request.orderId.slice(-6).toUpperCase()}
					</h1>
					<p className="mt-1 flex items-center gap-2 text-slate-500 text-sm">
						<Badge variant={STATUS_VARIANTS[request.status] || "default"}>
							{request.status}
						</Badge>
						• Submitted on{" "}
						{format(new Date(Number(request.createdAt)), "MMM d, yyyy h:mm a")}
					</p>
				</div>
			</div>

			<div className="grid gap-6 md:grid-cols-2">
				{/* Request Details */}
				<Card>
					<CardHeader>
						<CardTitle>Request Details</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div>
							<h4 className="mb-1 font-medium text-slate-500 text-sm">
								Customer Reason
							</h4>
							<p className="rounded-md border bg-slate-50 p-3 text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100">
								{request.reason}
							</p>
						</div>

						{request.stripeRefundId && (
							<div>
								<h4 className="mb-1 font-medium text-slate-500 text-sm">
									Stripe Refund ID
								</h4>
								<p className="font-mono text-sm">{request.stripeRefundId}</p>
							</div>
						)}

						<div className="border-t pt-4">
							<h4 className="mb-3 font-medium text-slate-900 text-sm">
								Admin Actions
							</h4>

							{request.status === "PENDING" && (
								<div className="space-y-4">
									<Textarea
										className="mb-2"
										onChange={(e) => setAdminNotes(e.target.value)}
										placeholder="Add internal notes (optional)..."
										value={adminNotes}
									/>
									<div className="flex gap-2">
										<Button
											className="w-full"
											disabled={isProcessing}
											onClick={() => handleUpdateStatus("ACCEPTED")}
										>
											<CheckCircle2 className="mr-2 h-4 w-4" /> Accept Request
										</Button>
										<Button
											className="w-full"
											disabled={isProcessing}
											onClick={() => handleUpdateStatus("REJECTED")}
											variant="destructive"
										>
											<XCircle className="mr-2 h-4 w-4" /> Reject Request
										</Button>
									</div>
								</div>
							)}

							{request.status === "ACCEPTED" && (
								<div className="space-y-4">
									<div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-amber-900 text-sm">
										<strong>Request Accepted!</strong>
										{request.order?.paymentMethod === "Stripe"
											? " Click below to actually process the refund via Stripe API."
											: " This is a COD order. Ensure you have refunded the customer manually before marking as refunded."}
									</div>
									<Button
										className="w-full bg-primary text-white hover:bg-primary/80"
										disabled={isProcessing}
										onClick={handleProcessRefund}
									>
										<DollarSign className="mr-2 h-4 w-4" />
										{request.order?.paymentMethod === "Stripe"
											? "Initiate Stripe Refund"
											: "Mark as Refunded (Manual)"}
									</Button>
								</div>
							)}

							{request.status === "REFUNDED" && (
								<div className="flex items-center rounded-md border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 text-sm">
									<CheckCircle2 className="mr-2 h-5 w-5 text-emerald-600" />
									This order has been fully refunded.
								</div>
							)}

							{request.status === "REJECTED" && (
								<div className="flex items-center rounded-md border border-red-200 bg-red-50 p-3 text-red-900 text-sm">
									<XCircle className="mr-2 h-5 w-5 text-red-600" />
									This request was rejected.
								</div>
							)}
						</div>
					</CardContent>
				</Card>

				{/* Order Context */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center justify-between">
							Order Context
							<Button asChild size="sm" variant="outline">
								<Link href={`/admin/orders/${request.orderId}`}>
									View Full Order
								</Link>
							</Button>
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-6">
						<div className="grid grid-cols-2 gap-4 text-sm">
							<div>
								<span className="mb-1 block text-slate-500">
									Customer Email
								</span>
								<span className="font-medium">{request.order?.email}</span>
							</div>
							<div>
								<span className="mb-1 block text-slate-500">
									Payment Method
								</span>
								<Badge variant="outline">{request.order?.paymentMethod}</Badge>
							</div>
							<div>
								<span className="mb-1 block text-slate-500">Total Amount</span>
								<span className="font-medium">
									AED {request.order?.total?.toFixed(2)}
								</span>
							</div>
							<div>
								<span className="mb-1 block text-slate-500">Order Status</span>
								<span className="font-medium">{request.order?.status}</span>
							</div>
						</div>

						<div>
							<h4 className="mb-3 border-b pb-2 font-medium text-slate-900 text-sm">
								Items in Order
							</h4>
							<div className="space-y-3">
								{request.order?.items?.map((item: any, i: number) => (
									<div className="flex justify-between text-sm" key={i}>
										<span className="text-slate-700 dark:text-slate-300">
											{item.quantity}x {item.title}
										</span>
										<span className="font-medium">
											AED {(item.price * item.quantity).toFixed(2)}
										</span>
									</div>
								))}
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
