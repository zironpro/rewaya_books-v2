"use client";

import {
	NumberField,
	NumberFieldDecrement,
	NumberFieldGroup,
	NumberFieldIncrement,
	NumberFieldInput,
	NumberFieldScrubArea,
} from "../ui/number-field";

interface QuantitySelectorProps {
	quantity: number;
	onQuantityChange: (qty: number) => void;
	disabled?: boolean;
}

export function QuantitySelector({
	quantity,
	onQuantityChange,
	disabled,
}: QuantitySelectorProps) {
	return (
		<div className="rounded-sm border bg-accent/10 p-1">
			<NumberField
				className="flex-row items-center gap-4"
				defaultValue={quantity}
				disabled={disabled}
				min={1}
				onValueChange={(val) => onQuantityChange(val ?? 1)}
			>
				<NumberFieldScrubArea className="w-full px-2" label="Quantity" />
				<NumberFieldGroup>
					<NumberFieldDecrement />
					<NumberFieldInput />
					<NumberFieldIncrement />
				</NumberFieldGroup>
			</NumberField>
		</div>
	);
}
