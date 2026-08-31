"use client";

import type { MouseEvent } from "react";

import { Heart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { toastManager } from "@/components/ui/toast";

import { cn } from "@/lib/utils";

import { useWishlist } from "../wishlist-provider";

interface WishlistToggleButtonProps {
	productId?: string;
	className?: string;
	iconClassName?: string;
	size?: "sm" | "md" | "lg";
	variant?: "icon" | "row";
	/** Shown on row variant */
	label?: string;
	onClick?: (e: MouseEvent) => void;
}

const iconSizes = { sm: 16, md: 20, lg: 20 } as const;

export function WishlistToggleButton({
	productId,
	className,
	iconClassName,
	size = "sm",
	variant = "icon",
	label = "Add to wish list",
	onClick,
}: WishlistToggleButtonProps) {
	const { isWishlisted, toggle, isLoading } = useWishlist();
	const wishlisted = isWishlisted(productId);
	const disabled = !productId || isLoading;

	const handleClick = async (e: MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		onClick?.(e);
		if (!productId) return;

		try {
			await toggle(productId);
			const willBeWishlisted = !wishlisted;
			toastManager.add({
				title: willBeWishlisted ? "Added to wishlist" : "Removed from wishlist",
				type: "success",
			});
		} catch {
			toastManager.add({
				title: "Error",
				description: "Failed to update wishlist",
				type: "error",
			});
		}
	};

	if (variant === "row") {
		return (
			<Button
				className={cn("w-full justify-between", className)}
				disabled={disabled}
				onClick={handleClick}
				title={disabled ? "Unavailable" : undefined}
				type="button"
				variant="ghost"
			>
				{label}
				<Heart
					className={cn(
						"transition-all",

						iconClassName
					)}
					size={iconSizes[size]}
				/>
			</Button>
		);
	}

	return (
		<Button
			className={cn(
				wishlisted &&
					"bg-primary text-white hover:bg-primary/90 hover:text-white",
				className
			)}
			disabled={disabled}
			onClick={handleClick}
			size="icon"
			title={
				disabled
					? "Unavailable"
					: wishlisted
						? "Remove from wishlist"
						: "Add to wishlist"
			}
			type="button"
			variant="ghost"
		>
			<Heart
				className={cn(wishlisted && "fill-current", iconClassName)}
				size={iconSizes[size]}
				strokeWidth={1.5}
			/>
		</Button>
	);
}
