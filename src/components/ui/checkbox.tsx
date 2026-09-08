import * as React from "react";

import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

export interface CheckboxProps
	extends React.InputHTMLAttributes<HTMLInputElement> {
	onCheckedChange?: (checked: boolean) => void;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
	({ className, checked, onChange, onCheckedChange, ...props }, ref) => {
		const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
			if (onChange) onChange(e);
			if (onCheckedChange) onCheckedChange(e.target.checked);
		};

		return (
			<div className="relative inline-flex items-center">
				<input
					checked={checked}
					className={cn(
						"peer h-4 w-4 shrink-0 cursor-pointer appearance-none rounded border border-slate-300 bg-background text-primary transition-all checked:border-primary checked:bg-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700",
						className
					)}
					onChange={handleChange}
					ref={ref}
					type="checkbox"
					{...props}
				/>
				<Check className="pointer-events-none absolute top-0.5 left-0.5 h-3 w-3 stroke-[3] text-white opacity-0 transition-opacity peer-checked:opacity-100" />
			</div>
		);
	}
);
Checkbox.displayName = "Checkbox";

export { Checkbox };
