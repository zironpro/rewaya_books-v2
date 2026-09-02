"use client";

import { useState } from "react";
import { useCreateRefundRequestMutation, useGetRefundRequestsQuery } from "@/types/graphql";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RefreshCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface RequestRefundDialogProps {
	orderId: string;
	isDelivered: boolean;
}

export function RequestRefundDialog({ orderId, isDelivered }: RequestRefundDialogProps) {
	const [open, setOpen] = useState(false);
	const [reason, setReason] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const { data, refetch } = useGetRefundRequestsQuery();
	const createRefundRequestMutation = useCreateRefundRequestMutation();

	// Check if a request already exists for this order
	const existingRequest = data?.refundRequests?.find((r) => r.orderId === orderId);

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
			<Badge variant={existingRequest.status === "REFUNDED" ? "success" : existingRequest.status === "REJECTED" ? "destructive" : "secondary"}>
				Refund: {existingRequest.status}
			</Badge>
		);
	}

	if (!isDelivered) {
		return null; // Can only request refund for delivered items in this flow usually, or we can just let them request it anytime. Let's let them request anytime since it might be a cancellation.
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="outline">
					<RefreshCcw className="mr-2 h-4 w-4" /> Request Refund
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Request Refund or Return</DialogTitle>
					<DialogDescription>
						Please provide a reason for your refund or return request. Our team will review it and get back to you shortly.
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-4 pt-4">
					<div className="space-y-2">
						<Label htmlFor="reason">Reason for Refund/Return</Label>
						<Textarea
							id="reason"
							placeholder="e.g. Item arrived damaged, changed my mind, etc."
							value={reason}
							onChange={(e) => setReason(e.target.value)}
							required
							rows={4}
						/>
					</div>

					{error && <p className="text-sm text-red-500">{error}</p>}

					<div className="flex justify-end gap-2">
						<Button variant="ghost" type="button" onClick={() => setOpen(false)}>
							Cancel
						</Button>
						<Button type="submit" disabled={isSubmitting || !reason.trim()}>
							{isSubmitting ? "Submitting..." : "Submit Request"}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
