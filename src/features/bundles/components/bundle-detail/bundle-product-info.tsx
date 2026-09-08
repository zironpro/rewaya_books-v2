import Link from "next/link";

import {
	BookOpen,
	Building,
	Globe,
	Share2,
	Star,
	User as UserIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import { CurrencyIcon } from "@/assets/icons/currency";

import type { Bundle } from "@/domain/catalog";
import { cn } from "@/lib/utils";

const BUNDLE_SPECS = [
	{ icon: UserIcon, label: "Author", value: "Multiple Authors" },
	{ icon: Building, label: "Publisher", value: "Al-Rewaya Press" },
	{ icon: Globe, label: "Language", value: "English & Arabic" },
	{ icon: BookOpen, label: "Format", value: "Hardcover Set" },
] as const;

interface BundleProductInfoProps {
	bundle: Bundle;
	className?: string;
}

export function BundleProductInfo({
	bundle,
	className,
}: BundleProductInfoProps) {
	const savingsPercent = Math.round(
		(1 - bundle.price / bundle.originalPrice) * 100
	);

	return (
		<div className={cn("space-y-6", className)}>
			<div className="space-y-4 border-stone-100 border-b pb-6">
				<div className="flex items-start justify-between gap-4">
					<h1 className="font-bold font-display text-3xl text-secondary leading-tight tracking-tight md:text-4xl">
						{bundle.title}
					</h1>
					<Button size="icon" type="button" variant="ghost">
						<Share2 className="text-stone-500" size={20} />
					</Button>
				</div>

				<div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
					<div className="flex items-center gap-0.5">
						{[1, 2, 3, 4, 5].map((i) => (
							<Star
								className={cn("fill-primary text-primary")}
								key={i}
								size={16}
							/>
						))}
					</div>
					<Link className="font-bold text-primary hover:underline" href="#">
						1,171 Verified Ratings
					</Link>
					<div className="h-4 w-px bg-stone-200" />
					<span className="font-medium text-stone-400">Curated Collection</span>
				</div>
			</div>

			<div className="space-y-4">
				<div className="flex items-center gap-4">
					<div className="flex items-center">
						<CurrencyIcon className="mr-1 size-7 text-primary" />
						<span className="font-bold text-3xl text-primary sm:text-4xl md:text-5xl">
							{bundle.price}
						</span>
					</div>
					<div className="flex flex-col">
						<span className="font-medium text-muted-foreground/60 text-sm line-through">
							AED {bundle.originalPrice}
						</span>
						<span className="font-bold text-sm text-success">
							You save {savingsPercent}%
						</span>
					</div>
				</div>
				<p className="max-w-lg whitespace-pre-wrap text-muted-foreground leading-relaxed">
					{bundle.description ||
						`The ultimate sequence of literature designed for the profound intellectual and spiritual development of the modern seeker. Includes ${bundle.books?.length || 0} hardcover volumes and exclusive rewards.`}
				</p>
			</div>

			<div className="grid grid-cols-2 gap-4 pt-4">
				{BUNDLE_SPECS.map((spec) => (
					<div
						className="flex items-center gap-3 rounded-xl border border-stone-100 bg-stone-50 p-3"
						key={spec.label}
					>
						<div className="text-primary">
							<spec.icon size={16} />
						</div>
						<div>
							<p className="text-muted-foreground/60 text-xs">{spec.label}</p>
							<p className="font-semibold text-secondary text-sm">
								{spec.value}
							</p>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
