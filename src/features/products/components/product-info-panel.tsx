"use client";

import Link from "next/link";

import {
	AlertCircle,
	Calendar,
	ChevronRight,
	RefreshCcw,
	Share2,
	ShieldCheck,
	Star,
	Truck,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { CurrencyIcon } from "@/assets/icons/currency";

import type { ProductDetailData } from "@/features/products/types";
import { cn } from "@/lib/utils";

function getDeliveryDateLabel(): string {
	const date = new Date();
	date.setDate(date.getDate() + 3);
	return date.toLocaleDateString("en-AE", {
		weekday: "short",
		day: "numeric",
		month: "short",
	});
}

function SectionLabel({ children }: { children: React.ReactNode }) {
	return (
		<p className="mb-2 font-semibold text-muted-foreground text-xs uppercase tracking-widest">
			{children}
		</p>
	);
}

interface ProductInfoPanelProps {
	product: ProductDetailData;
	className?: string;
}

export function ProductInfoPanel({
	product,
	className,
}: ProductInfoPanelProps) {
	const formatDetail = product.details?.find((d) => d.label === "Format");

	return (
		<div className={cn("min-w-0 space-y-6", className)}>
			<div className="space-y-3">
				{product.category && (
					<Badge size="sm" variant="outline">
						{product.category}
					</Badge>
				)}

				<div className="flex items-start justify-between gap-3">
					<h1 className="font-bold font-display text-2xl text-secondary leading-tight tracking-tight sm:text-3xl">
						{product.title}
					</h1>
					<Button
						aria-label="Share product"
						className="shrink-0"
						size="icon"
						type="button"
						variant="ghost"
					>
						<Share2 className="text-muted-foreground" size={18} />
					</Button>
				</div>

				{/* {product.author && (
					<p className="text-muted-foreground text-sm">
						by{" "}
						<span className="font-medium text-secondary">{product.author}</span>
					</p>
				)} */}

				<div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
					<div className="flex items-center gap-0.5">
						{[1, 2, 3, 4, 5].map((i) => (
							<Star className="fill-primary text-primary" key={i} size={14} />
						))}
					</div>
					<span className="font-bold text-secondary">5.0</span>
					<Link
						className="text-primary hover:underline"
						href="#product-details"
					>
						See details
					</Link>
				</div>
			</div>

			<div className="flex flex-wrap items-end gap-4 md:hidden">
				<div className="flex items-baseline gap-1.5">
					<CurrencyIcon className="size-6 text-primary" />
					<span className="font-black font-display text-3xl text-primary">
						{product.price.toFixed(2)}
					</span>
				</div>
			</div>

			<div className="flex flex-wrap items-center gap-2">
				{product.availableForSale !== false ? (
					<span className="inline-flex items-center gap-1.5 rounded-md border border-warning/30 bg-warning/10 px-2.5 py-1 font-medium text-warning-foreground text-xs">
						<AlertCircle className="size-3.5" />
						In stock - ships from UAE
					</span>
				) : (
					<Badge size="sm" variant="error">
						Out of stock
					</Badge>
				)}
				{formatDetail && (
					<span className="text-muted-foreground text-sm">
						{formatDetail.value}
					</span>
				)}
			</div>

			{product.badge === "best seller" && (
				<div className="flex items-center justify-between gap-2 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3">
					<div className="flex items-center gap-2">
						<Star className="size-4 fill-primary text-primary" />
						<span className="font-medium text-secondary text-sm">
							Bestseller in {product.category}
						</span>
					</div>
					<ChevronRight className="size-4 text-muted-foreground" />
				</div>
			)}

			<div>
				<SectionLabel>Delivery information</SectionLabel>
				<div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-muted px-4 py-3">
					<div className="flex items-center gap-3">
						<div className="flex size-9 items-center justify-center rounded-md bg-card text-success">
							<Truck className="size-5" />
						</div>
						<div>
							<p className="font-semibold text-secondary text-sm">
								Get it by {getDeliveryDateLabel()}
							</p>
							<p className="text-muted-foreground text-xs">
								Standard UAE delivery
							</p>
						</div>
					</div>
					<div className="flex items-center gap-1.5 text-warning-foreground text-xs">
						<Calendar className="size-3.5" />
						<span className="font-medium">Order today</span>
					</div>
				</div>
			</div>

			{product.description && (
				<div>
					<SectionLabel>About this book</SectionLabel>
					<p className="max-w-prose text-muted-foreground text-sm leading-relaxed">
						{product.description}
					</p>
				</div>
			)}

			{product.details && product.details.length > 0 && (
				<div id="product-details">
					<SectionLabel>Product details</SectionLabel>
					<dl className="grid grid-cols-2 gap-3 sm:grid-cols-2">
						{product.details.map((detail) => (
							<div
								className="rounded-lg border border-border bg-card px-3 py-2.5"
								key={detail.label}
							>
								<dt className="mb-0.5 text-muted-foreground text-xs">
									{detail.label}
								</dt>
								<dd className="font-semibold text-secondary text-sm">
									{detail.value}
								</dd>
							</div>
						))}
					</dl>
				</div>
			)}

			<div className="space-y-3 border-border border-t pt-6 lg:hidden">
				<SectionLabel>Why shop with us</SectionLabel>
				<ul className="space-y-3">
					{[
						{ icon: Truck, text: "Express delivery across the UAE (2-3 days)" },
						{ icon: RefreshCcw, text: "Easy 30-day returns on eligible items" },
						{ icon: ShieldCheck, text: "100% authentic edition guarantee" },
					].map(({ icon: Icon, text }) => (
						<li className="flex gap-3 text-sm" key={text}>
							<Icon
								aria-hidden
								className="mt-0.5 size-4 shrink-0 text-primary"
							/>
							<span className="text-muted-foreground">{text}</span>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}
