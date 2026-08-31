"use client";

import { useEffect, useMemo } from "react";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Fieldset, FieldsetLegend } from "@/components/ui/fieldset";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
	InputGroupText,
} from "@/components/ui/input-group";
import { Slider } from "@/components/ui/slider";

import { useSliderWithInput } from "@/hooks/use-slider-with-input";

const MIN_PRICE = 0;
const MAX_PRICE = 2000;

function parsePriceParam(value: string | null, fallback: number) {
	if (!value) return fallback;
	const parsed = Number(value);
	return Number.isFinite(parsed) ? parsed : fallback;
}

export function PriceFilter() {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const _searchParamsString = searchParams.toString();

	const initialMin = parsePriceParam(searchParams.get("minPrice"), MIN_PRICE);
	const initialMax = parsePriceParam(searchParams.get("maxPrice"), MAX_PRICE);
	const initialValue = useMemo(
		() =>
			[Math.min(initialMin, initialMax), Math.max(initialMin, initialMax)] as [
				number,
				number,
			],
		[initialMin, initialMax]
	);

	const {
		sliderValue,
		inputValues,
		setSliderValue,
		validateAndUpdateValue,
		handleInputChange,
		handleSliderChange,
	} = useSliderWithInput({
		initialValue,
		minValue: MIN_PRICE,
		maxValue: MAX_PRICE,
	});

	useEffect(() => {
		const nextMin = parsePriceParam(searchParams.get("minPrice"), MIN_PRICE);
		const nextMax = parsePriceParam(searchParams.get("maxPrice"), MAX_PRICE);
		const normalized: [number, number] = [
			Math.min(nextMin, nextMax),
			Math.max(nextMin, nextMax),
		];

		if (sliderValue[0] !== normalized[0] || sliderValue[1] !== normalized[1]) {
			setSliderValue(normalized);
		}
	}, [setSliderValue, searchParams, sliderValue[1]]);

	useEffect(() => {
		const currentMin = parsePriceParam(searchParams.get("minPrice"), MIN_PRICE);
		const currentMax = parsePriceParam(searchParams.get("maxPrice"), MAX_PRICE);

		// Only push if the internal slider state differs from the URL parameters
		if (sliderValue[0] === currentMin && sliderValue[1] === currentMax) {
			return;
		}

		const params = new URLSearchParams(searchParams.toString());

		if (sliderValue[0] !== MIN_PRICE) {
			params.set("minPrice", sliderValue[0].toString());
		} else {
			params.delete("minPrice");
		}

		if (sliderValue[1] !== MAX_PRICE) {
			params.set("maxPrice", sliderValue[1].toString());
		} else {
			params.delete("maxPrice");
		}

		params.set("page", "1");
		const nextSearch = params.toString();
		const nextUrl = `${pathname}${nextSearch ? `?${nextSearch}` : ""}`;

		router.push(nextUrl, { scroll: false });
	}, [sliderValue, pathname, router, searchParams]);

	const formatPrice = (price: number) =>
		price === MAX_PRICE
			? `AED ${price.toLocaleString()}+`
			: `AED ${price.toLocaleString()}`;

	return (
		<Fieldset className="flex w-full flex-col gap-4">
			<FieldsetLegend className="sr-only tabular-nums">
				Price Range
			</FieldsetLegend>

			<div className="mt-2 px-2">
				<Slider
					aria-label="Price range"
					className="flex-1"
					max={MAX_PRICE}
					min={MIN_PRICE}
					name="price-range"
					onValueChange={handleSliderChange}
					value={sliderValue}
				/>
			</div>

			<div className="mt-1 flex justify-between px-1 font-medium text-[10px] text-muted-foreground uppercase">
				<span>{formatPrice(MIN_PRICE)}</span>
				<span>{formatPrice(MAX_PRICE)}</span>
			</div>

			<div className="flex items-center gap-4">
				<div className="flex w-full flex-col gap-1">
					<label
						className="font-semibold text-muted-foreground text-xs"
						htmlFor="minPrice"
					>
						Min Price
					</label>
					<InputGroup>
						<InputGroupAddon>
							<InputGroupText>AED</InputGroupText>
						</InputGroupAddon>
						<InputGroupInput
							id="minPrice"
							max={MAX_PRICE}
							min={MIN_PRICE}
							onBlur={() => validateAndUpdateValue(inputValues[0], 0)}
							onChange={(e) => handleInputChange(e, 0)}
							type="text"
							value={inputValues[0]}
						/>
					</InputGroup>
				</div>

				<div className="flex w-full flex-col gap-1">
					<label
						className="font-mediumtext-muted-foreground text-xs"
						htmlFor="maxPrice"
					>
						Max Price
					</label>
					<InputGroup>
						<InputGroupAddon>
							<InputGroupText>AED</InputGroupText>
						</InputGroupAddon>
						<InputGroupInput
							id="maxPrice"
							max={MAX_PRICE}
							min={MIN_PRICE}
							onBlur={() => validateAndUpdateValue(inputValues[1], 1)}
							onChange={(e) => handleInputChange(e, 1)}
							type="text"
							value={inputValues[1]}
						/>
					</InputGroup>
				</div>
			</div>
		</Fieldset>
	);
}
