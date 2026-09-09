"use client";

import { useState } from "react";

import { RefreshCcw } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
	useCreateRefundRequestMutation,
	useGetRefundRequestsQuery,
} from "@/types/graphql";

interface RequestRefundDialogProps {
	orderId: string;
	isDelivered: boolean;
	orderDeliveredAt?: string | null;
}

export function RequestRefundDialog({
	orderId,
	isDelivered,
	orderDeliveredAt,
}: RequestRefundDialogProps) {
	const [open, setOpen] = useState(false);
	const [reason, setReason] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const { data, refetch } = useGetRefundRequestsQuery();
	const createRefundRequestMutation = useCreateRefundRequestMutation();

	// Check if a request already exists for this order
	const existingRequest = data?.refundRequests?.find(
		(r) => r.orderId === orderId
	);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!reason.trim()) return;

		setIsSubmitting(true);
		setError(null);

		try {
			await createRefundRequestMutation.mutateAsync({
				input: {
					orderId,
					reason,
				},
			});
			await refetch();
			setOpen(false);
		} catch (err: any) {
			setError(err.message || "Failed to submit request.");
		} finally {
			setIsSubmitting(false);
		}
	};

	if (existingRequest) {
		return (
			<Badge
				variant={
					existingRequest.status === "REFUNDED"
						? "success"
						: existingRequest.status === "REJECTED"
							? "destructive"
							: "secondary"
				}
			>
				Refund: {existingRequest.status}
			</Badge>
		);
	}

	const isEligibleForRefund = () => {
		if (!orderDeliveredAt) return false; // Hide if not delivered yet (no delivery date)
		const deliveryDate = new Date(orderDeliveredAt);
		const now = new Date();
		const diffTime = now.getTime() - deliveryDate.getTime();
		const diffDays = diffTime / (1000 * 60 * 60 * 24);
		return diffDays <= 3; // 3 full days (72 hours)
	};

	if (!isEligibleForRefund()) {
		return null;
	}

	if (!isDelivered) {
		return null; // Can only request refund for delivered items in this flow usually, or we can just let them request it anytime. Let's let them request anytime since it might be a cancellation.
	}

	return (
		<Dialog onOpenChange={setOpen} open={open}>
			<DialogTrigger asChild>
				<Button variant="outline">
					<RefreshCcw className="mr-2 h-4 w-4" /> Request Refund
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Request Refund or Return</DialogTitle>
					<DialogDescription>
						Please provide a reason for your refund or return request. Our team
						will review it and get back to you shortly.
					</DialogDescription>
				</DialogHeader>

				<form className="space-y-4 pt-4" onSubmit={handleSubmit}>
					<div className="space-y-2">
						<Label htmlFor="reason">Reason for Refund/Return</Label>
						<Textarea
							id="reason"
							onChange={(e) => setReason(e.target.value)}
							placeholder="e.g. Item arrived damaged, changed my mind, etc."
							required
							rows={4}
							value={reason}
						/>
					</div>

					{error && <p className="text-red-500 text-sm">{error}</p>}

					<div className="flex justify-end gap-2">
						<Button
							onClick={() => setOpen(false)}
							type="button"
							variant="ghost"
						>
							Cancel
						</Button>
						<Button disabled={isSubmitting || !reason.trim()} type="submit">
							{isSubmitting ? "Submitting..." : "Submit Request"}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
