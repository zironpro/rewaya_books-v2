import { isAvailableForPurchase } from "@/domain/product/availability";
import { cn } from "@/lib/utils";

interface AvailabilityStatusProps {
	availableForSale?: boolean;
	variant?: any;
	className?: string;
}

export function AvailabilityStatus({
	availableForSale,
	variant,
	className,
}: AvailabilityStatusProps) {
	const inStock = isAvailableForPurchase(availableForSale, variant);

	return (
		<p
			className={cn(
				"font-medium text-sm",
				inStock ? "text-success" : "text-destructive",
				className
			)}
		>
			{inStock ? "In stock" : "Out of stock"}
		</p>
	);
}
