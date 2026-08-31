import * as React from "react";
import { cn } from "@/lib/utils";

export interface LabelProps
	extends React.LabelHTMLAttributes<HTMLLabelElement> {}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
	({ className, ...props }, ref) => (
		<label
			ref={ref}
			className={cn(
				"block mb-1.5 text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 peer-disabled:cursor-not-allowed peer-disabled:opacity-70 select-none",
				className
			)}
			{...props}
		/>
	)
);
Label.displayName = "Label";

export { Label };
