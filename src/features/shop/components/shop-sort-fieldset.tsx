"use client";

import { Fieldset, FieldsetLegend } from "@/components/ui/fieldset";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

interface ShopSortFieldsetProps {
	value?: string | null;
	onChange?: (value: string | null) => void;
	className?: string;
}

const SORT_OPTIONS: Array<{ label: string; value: string }> = [
	{ label: "Newest first", value: "newest" },
	{ label: "Price: Low to high", value: "price-asc" },
	{ label: "Price: High to low", value: "price-desc" },
];

export const ShopSortFieldset = ({
	value,
	onChange,
	className,
}: ShopSortFieldsetProps) => {
	return (
		<Fieldset className={className}>
			<FieldsetLegend className="font-medium text-mist-500 text-sm">
				Sort by
			</FieldsetLegend>

			<Select
				items={SORT_OPTIONS}
				onValueChange={(val) => onChange?.(val ?? null)}
				value={value || null}
			>
				<SelectTrigger className="w-44">
					<SelectValue placeholder={SORT_OPTIONS[0].label} />
				</SelectTrigger>

				<SelectContent>
					<SelectGroup>
						{SORT_OPTIONS.map((opt) => (
							<SelectItem key={opt.value} value={opt.value}>
								{opt.label}
							</SelectItem>
						))}
					</SelectGroup>
				</SelectContent>
			</Select>
		</Fieldset>
	);
};

export default ShopSortFieldset;
