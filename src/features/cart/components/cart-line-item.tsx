"use client";

import Image from "next/image";
import Link from "next/link";

import { Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	NumberField,
	NumberFieldDecrement,
	NumberFieldGroup,
	NumberFieldIncrement,
	NumberFieldInput,
} from "@/components/ui/number-field";

import {
	firstDescriptionSubtitle,
	isItemUnavailable,
	type LineItem,
	resolveCartImage,
	resolveLineItemHref,
} from "@/features/cart/cart-sdk";
import { cn } from "@/lib/utils";

interface CartLineItemProps {
	item: LineItem;
	onUpdateQuantity: (lineId: string, quantity: number) => void;
	onRemove: (lineId: string) => void;
}

export function CartLineItem({
	item,
	onUpdateQuantity,
	onRemove,
}: CartLineItemProps) {
	const lineId = item._id ?? "";
	const unavailable = isItemUnavailable(item);
	const maxQty = item.availability?.quantityAvailable ?? 99;
	const href = !unavailable ? resolveLineItemHref(item) : undefined;
	const isBundle = Boolean(item.isBundle);
	const imageUrl = resolveCartImage(item.image, 200, 280);
	const subtitle = firstDescriptionSubtitle(item);
	const hasDiscount =
		item.fullPrice?.formattedConvertedAmount &&
		item.fullPrice.formattedConvertedAmount !==
			item.price?.formattedConvertedAmount;

	const unavailableLabel =
		item.availability?.status === "NOT_FOUND"
			? "No longer available"
			: "Out of stock";

	const itemTitle = item.productName?.translated ?? (item as any).title ?? "Product";
	const priceStr =
		typeof item.price === "object"
			? item.price?.formattedConvertedAmount
			: typeof item.price === "number" || typeof item.price === "string"
				? `AED ${Number(item.price).toFixed(2)}`
				: undefined;

	const lineItemPriceStr =
		typeof item.lineItemPrice === "object" && item.lineItemPrice?.formattedConvertedAmount
			? item.lineItemPrice.formattedConvertedAmount
			: typeof item.price === "number" || typeof item.price === "string"
				? `AED ${(Number(item.price) * (item.quantity || 1)).toFixed(2)}`
				: priceStr ?? "—";

	return (
		<div
			className={cn(
				"grid grid-cols-1 gap-6 border-b pb-6 md:grid-cols-4 md:items-center md:gap-8 md:pb-8",
				unavailable && "opacity-75"
			)}
		>
			<div className="flex gap-4 md:col-span-2 md:gap-6">
				<div className="relative aspect-3/4 h-24 shrink-0 overflow-hidden rounded-sm bg-card sm:h-32">
					{imageUrl ? (
						href ? (
							<Link className="block h-full w-full" href={href}>
								<Image
									alt={item.productName?.translated ?? "Product"}
									className="object-cover"
									fill
									sizes="96px"
									src={imageUrl}
								/>
							</Link>
						) : (
							<Image
								alt={item.productName?.translated ?? "Product"}
								className="object-cover"
								fill
								sizes="96px"
								src={imageUrl}
							/>
						)
					) : null}
				</div>
				<div className="flex flex-col justify-center gap-1">
					<div className="flex gap-2">
						{href ? (
							<Link
								className="font-bold text-secondary text-sm hover:text-primary hover:underline"
								href={href}
							>
								{itemTitle}
							</Link>
						) : (
							<h3 className="font-bold text-secondary text-sm">
								{itemTitle}
							</h3>
						)}
						{isBundle ? (
							<Badge className="mt-0.5 w-fit" size="sm" variant="secondary">
								Bundle
							</Badge>
						) : null}
					</div>
					{subtitle ? (
						<p className="text-mauve-400 text-sm">{subtitle}</p>
					) : null}
					{hasDiscount && (
						<p className="text-mauve-400 text-xs line-through">
							{item.fullPrice?.formattedConvertedAmount}
						</p>
					)}
					{priceStr && (
						<p className="font-medium text-mauve-500 text-sm">
							{priceStr}
						</p>
					)}
					{unavailable && (
						<Badge className="mt-1 w-fit" size="sm" variant="error">
							{unavailableLabel}
						</Badge>
					)}
					<Button
						className="mt-1 h-auto p-0 text-muted-foreground text-xs hover:bg-transparent hover:text-destructive"
						onClick={() => lineId && onRemove(lineId)}
						size="sm"
						variant="ghost"
					>
						<Trash2 className="mr-1" size={14} />
						Remove
					</Button>
				</div>
			</div>

			<div className="flex items-center justify-between md:col-span-2 md:grid md:grid-cols-2 md:gap-8">
				<div className="flex items-center md:justify-center">
					{unavailable ? (
						<span className="text-mauve-400 text-sm">-</span>
					) : (
						<NumberField
							className="w-28"
							max={maxQty}
							onValueChange={(val) =>
								lineId && onUpdateQuantity(lineId, val ?? 1)
							}
							value={item.quantity}
						>
							<NumberFieldGroup>
								<NumberFieldDecrement />
								<NumberFieldInput />
								<NumberFieldIncrement />
							</NumberFieldGroup>
						</NumberField>
					)}
				</div>

				<div className="text-right">
					<span className="font-semibold text-base text-foreground">
						{lineItemPriceStr}
					</span>
				</div>
			</div>
		</div>
	);
}
