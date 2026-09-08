import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
	extends React.InputHTMLAttributes<HTMLInputElement> {
	icon?: React.ReactNode;
	endIcon?: React.ReactNode;
	unstyled?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({ className, type, icon, endIcon, unstyled, ...props }, ref) => {
		if (icon || endIcon) {
			return (
				<div className="relative flex w-full items-center">
					{icon && (
						<div className="pointer-events-none absolute left-3.5 flex items-center text-muted-foreground">
							{icon}
						</div>
					)}
					<input
						className={cn(
							"flex h-11 w-full rounded-lg border border-input bg-background/50 px-3.5 py-2 text-sm shadow-xs ring-offset-background transition-all duration-200 file:border-0 file:bg-transparent file:font-medium file:text-sm placeholder:text-muted-foreground hover:border-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:border-slate-600",
							icon && "pl-10",
							endIcon && "pr-10",
							className
						)}
						ref={ref}
						type={type}
						{...props}
					/>
					{endIcon && (
						<div className="absolute right-3 flex items-center">{endIcon}</div>
					)}
				</div>
			);
		}

		return (
			<input
				className={cn(
					"flex h-11 w-full rounded-lg border border-input bg-background/50 px-3.5 py-2 text-sm shadow-xs ring-offset-background transition-all duration-200 file:border-0 file:bg-transparent file:font-medium file:text-sm placeholder:text-muted-foreground hover:border-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:border-slate-600",
					className
				)}
				ref={ref}
				type={type}
				{...props}
			/>
		);
	}
);
Input.displayName = "Input";

export { Input };
