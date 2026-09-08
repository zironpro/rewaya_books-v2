import * as React from "react";

import { cn } from "@/lib/utils";

export interface LabelProps
	extends React.LabelHTMLAttributes<HTMLLabelElement> {}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
	({ className, ...props }, ref) => (
		<label
			className={cn(
				"mb-1.5 block select-none font-semibold text-slate-700 text-xs uppercase tracking-wider peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-slate-300",
				className
			)}
			ref={ref}
			{...props}
		/>
	)
);
Label.displayName = "Label";

export { Label };
