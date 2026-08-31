"use client";

import Image from "next/image";

import {
	domMax,
	LayoutGroup,
	LazyMotion,
	m,
	useReducedMotion,
} from "motion/react";

import { Badge } from "@/components/ui/badge";

import type { BundlePresentation } from "@/domain/bundle";

const motionTransition = {
	type: "spring" as const,
	stiffness: 420,
	damping: 32,
	mass: 0.75,
};

const cardTransition = {
	...motionTransition,
	layout: motionTransition,
};

const cardVariants = {
	rest: {
		alignItems: "center",
		flexDirection: "row",
		gap: "0.75rem",
		maxWidth: "min(100%, 20rem)",
	},
	hover: {
		alignItems: "stretch",
		flexDirection: "column",
		gap: 0,
		maxWidth: 260,
	},
};

const imageVariants = {
	rest: {
		height: 64,
		width: 64,
	},
	hover: {
		height: 195,
		width: "100%",
	},
};

const contentVariants = {
	rest: {
		marginTop: 0,
		padding: 0,
	},
	hover: {
		marginTop: 8,
		padding: 6,
	},
};

const badgeVariants = {
	rest: {
		marginBottom: 0,
		maxHeight: 0,
		opacity: 0,
	},
	hover: {
		marginBottom: 0,
		maxHeight: 28,
		opacity: 1,
	},
};

const nameVariants = {
	rest: {
		fontSize: "0.875rem",
		marginTop: 0,
	},
	hover: {
		fontSize: "1.125rem",
		marginTop: 4,
	},
};

const priceVariants = {
	rest: {
		fontSize: "0.5rem",
		marginTop: 0,
	},
	hover: {
		fontSize: "1rem",
		marginTop: 4,
	},
};

const originalPriceVariants = {
	rest: {
		marginLeft: 0,
		maxWidth: 0,
		opacity: 0,
	},
	hover: {
		marginLeft: 8,
		maxWidth: 80,
		opacity: 1,
	},
};

type HeroFeaturedBundleCardProps = Pick<
	BundlePresentation,
	"coverImage" | "name" | "originalPrice" | "price"
>;

export function HeroFeaturedBundleCard({
	coverImage,
	name,
	originalPrice,
	price,
}: HeroFeaturedBundleCardProps) {
	const prefersReducedMotion = useReducedMotion();
	const initialVariant = prefersReducedMotion ? "hover" : "rest";

	return (
		<LazyMotion features={domMax}>
			<LayoutGroup id="hero-featured-bundle-card">
				<m.div
					className="hidden! md:flex! absolute right-4 bottom-4 z-10 overflow-hidden rounded-lg bg-card p-2 shadow-md backdrop-blur-lg supports-backdrop-blur:bg-card/80"
					initial={initialVariant}
					layout
					layoutRoot
					style={{ display: "flex" }}
					transition={cardTransition}
					variants={cardVariants}
					whileHover={prefersReducedMotion ? undefined : "hover"}
				>
					<m.div
						className="relative shrink-0 overflow-hidden rounded-sm"
						layout
						transition={cardTransition}
						variants={imageVariants}
					>
						<Image
							alt=""
							className="object-cover"
							fill
							sizes="(max-width: 1024px) 64px, 260px"
							src={coverImage}
						/>
					</m.div>

					<m.div
						className="min-w-0 flex-1"
						layout
						transition={cardTransition}
						variants={contentVariants}
					>
						<m.div
							className="overflow-hidden"
							layout
							transition={cardTransition}
							variants={badgeVariants}
						>
							<Badge size="sm" variant="secondary">
								Featured set
							</Badge>
						</m.div>

						<m.p
							className="font-bold font-display text-secondary"
							layout
							transition={cardTransition}
							variants={nameVariants}
						>
							<span className="line-clamp-2">{name}</span>
						</m.p>

						<m.p
							className="flex items-baseline font-medium text-primary"
							layout
							transition={cardTransition}
							variants={priceVariants}
						>
							AED {price}
							<m.span
								className="inline-block overflow-hidden whitespace-nowrap font-normal text-muted-foreground text-sm line-through"
								layout
								transition={cardTransition}
								variants={originalPriceVariants}
							>
								{originalPrice}
							</m.span>
						</m.p>
					</m.div>
				</m.div>
			</LayoutGroup>
		</LazyMotion>
	);
}
