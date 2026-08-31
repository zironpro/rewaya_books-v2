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
					type="checkbox"
					ref={ref}
					checked={checked}
					onChange={handleChange}
					className={cn(
						"peer h-4 w-4 shrink-0 rounded border border-slate-300 dark:border-slate-700 bg-background text-primary focus:ring-2 focus:ring-primary focus:ring-offset-1 focus:outline-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 appearance-none checked:bg-primary checked:border-primary transition-all",
						className
					)}
					{...props}
				/>
				<Check className="absolute left-0.5 top-0.5 h-3 w-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity stroke-[3]" />
			</div>
		);
	}
);
Checkbox.displayName = "Checkbox";

export { Checkbox };
