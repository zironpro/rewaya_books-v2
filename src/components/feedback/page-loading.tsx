import { Spinner } from "@/components/ui/spinner";

import { cn } from "@/lib/utils";

interface PageLoadingProps {
	message?: string;
	className?: string;
}

export function PageLoading({
	message = "Loading…",
	className,
}: PageLoadingProps) {
	return (
		<div
			className={cn(
				"flex min-h-[40vh] flex-col items-center justify-center gap-3 text-muted-foreground",
				className
			)}
		>
			<Spinner className="size-8" />
			<p className="text-sm">{message}</p>
		</div>
	);
}
