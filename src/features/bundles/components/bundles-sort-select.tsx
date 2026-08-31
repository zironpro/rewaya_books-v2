"use client";

import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

const sortOptions = [
	{ label: "Select a sort option", value: null },
	{ label: "Exclusive first", value: "exclusive-first" },
	{ label: "Price: Low to high", value: "price-low" },
	{ label: "Price: High to low", value: "price-high" },
];

export const BundlesSortSelect = () => {
	return (
		<Select items={sortOptions}>
			<SelectTrigger className="w-3xs">
				<SelectValue />
			</SelectTrigger>
			<SelectContent>
				<SelectGroup>
					<SelectLabel>Sort by</SelectLabel>
					{sortOptions.map((item) => (
						<SelectItem key={item.value} value={item.value}>
							{item.label}
						</SelectItem>
					))}
				</SelectGroup>
			</SelectContent>
		</Select>
	);
};
