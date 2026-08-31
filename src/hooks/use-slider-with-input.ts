"use client";

import { useEffect, useState } from "react";

function clamp(value: number, min: number, max: number) {
	return Math.min(Math.max(value, min), max);
}

type UseSliderWithInputOptions = {
	initialValue: [number, number];
	minValue: number;
	maxValue: number;
};

export function useSliderWithInput({
	initialValue,
	minValue,
	maxValue,
}: UseSliderWithInputOptions) {
	const [sliderValue, setSliderValue] = useState<[number, number]>([
		clamp(initialValue[0], minValue, maxValue),
		clamp(initialValue[1], minValue, maxValue),
	]);
	const [inputValues, setInputValues] = useState<[string, string]>([
		String(sliderValue[0]),
		String(sliderValue[1]),
	]);

	useEffect(() => {
		setInputValues([String(sliderValue[0]), String(sliderValue[1])]);
	}, [sliderValue]);

	const handleSliderChange = (value: number | readonly number[]) => {
		const next = Array.isArray(value) ? [...value] : [value];
		if (next.length === 2) {
			const normalized: [number, number] = [
				clamp(next[0], minValue, maxValue),
				clamp(next[1], minValue, maxValue),
			];
			setSliderValue([
				Math.min(normalized[0], normalized[1]),
				Math.max(normalized[0], normalized[1]),
			]);
		}
	};

	const handleInputChange = (
		event: React.ChangeEvent<HTMLInputElement>,
		index: 0 | 1
	) => {
		const nextValue = event.target.value;
		setInputValues((current) =>
			index === 0 ? [nextValue, current[1]] : [current[0], nextValue]
		);
	};

	const validateAndUpdateValue = (value: string, index: 0 | 1) => {
		const nextNumber = Number(value);
		if (Number.isNaN(nextNumber)) {
			setInputValues((current) =>
				index === 0
					? [String(sliderValue[0]), current[1]]
					: [current[0], String(sliderValue[1])]
			);
			return;
		}

		const nextValue = clamp(nextNumber, minValue, maxValue);
		const nextSliderValue: [number, number] = [sliderValue[0], sliderValue[1]];

		if (index === 0) {
			nextSliderValue[0] = Math.min(nextValue, nextSliderValue[1]);
		} else {
			nextSliderValue[1] = Math.max(nextValue, nextSliderValue[0]);
		}

		setSliderValue(nextSliderValue);
	};

	return {
		sliderValue,
		inputValues,
		setSliderValue,
		validateAndUpdateValue,
		handleInputChange,
		handleSliderChange,
	};
}
