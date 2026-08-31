"use client";

import Image from "next/image";

import { domAnimation, LazyMotion, m, useReducedMotion } from "motion/react";

import type { BundleBookItem } from "@/domain/bundle";

type BookCell = {
	alt: string;
	gridClass: string;
	hidden: {
		opacity: number;
		y: number;
		x: number;
		rotate: number;
		scale: number;
		filter: string;
	};
	hover: {
		scale: number;
		y: number;
		rotate: number;
	};
	id: string;
	src: string;
	tileClass: string;
};

type BookLayout = Omit<BookCell, "alt" | "id" | "src">;

const hoverTransition = {
	type: "spring" as const,
	stiffness: 420,
	damping: 26,
	mass: 0.7,
};

const mosaicLayouts: BookLayout[] = [
	{
		gridClass: "col-start-1 row-start-1",
		tileClass:
			"place-self-center cursor-pointer rounded-sm shadow-sm transition-[box-shadow] hover:shadow-md",
		hidden: {
			opacity: 0,
			y: 48,
			x: -20,
			rotate: -12,
			scale: 0.82,
			filter: "blur(6px)",
		},
		hover: { scale: 1.1, y: -10, rotate: -6 },
	},
	{
		gridClass: "col-start-2 row-start-1 md:col-start-3",
		tileClass:
			"place-self-center cursor-pointer rounded-sm shadow-sm transition-[box-shadow] hover:shadow-md md:place-self-end",
		hidden: {
			opacity: 0,
			y: -40,
			x: 24,
			rotate: 10,
			scale: 0.82,
			filter: "blur(6px)",
		},
		hover: { scale: 1.1, y: -12, rotate: 8 },
	},
	{
		gridClass: "col-start-1 row-start-2 md:row-start-2",
		tileClass:
			"place-self-center cursor-pointer rounded-sm shadow-sm transition-[box-shadow] hover:shadow-md",
		hidden: {
			opacity: 0,
			y: 20,
			x: -36,
			rotate: -8,
			scale: 0.82,
			filter: "blur(6px)",
		},
		hover: { scale: 1.1, y: -8, rotate: -5 },
	},
	{
		gridClass: "col-start-2 row-start-2 md:col-start-3 md:row-start-2",
		tileClass:
			"place-self-center cursor-pointer rounded-sm shadow-sm transition-[box-shadow] hover:shadow-md md:place-self-end",
		hidden: {
			opacity: 0,
			y: 44,
			x: 28,
			rotate: 12,
			scale: 0.82,
			filter: "blur(6px)",
		},
		hover: { scale: 1.1, y: -10, rotate: 7 },
	},
];

function buildMosaicBooks(books: BundleBookItem[]): BookCell[] {
	return books.slice(0, mosaicLayouts.length).map((book, index) => ({
		...mosaicLayouts[index],
		id: book.id,
		alt: book.title,
		src: book.coverUrl,
	}));
}

const containerVariants = {
	hidden: {},
	visible: {
		transition: {
			staggerChildren: 0.12,
			delayChildren: 0.2,
		},
	},
};

const itemVariants = {
	hidden: (book: BookCell) => book.hidden,
	visible: {
		opacity: 1,
		y: 0,
		x: 0,
		rotate: 0,
		scale: 1,
		filter: "blur(0px)",
		transition: {
			type: "spring" as const,
			stiffness: 320,
			damping: 24,
			mass: 0.85,
		},
	},
};

function BookTile({
	book,
	prefersReducedMotion,
}: {
	book: BookCell;
	prefersReducedMotion: boolean | null;
}) {
	return (
		<m.div
			className={`pointer-events-auto relative z-0 ${book.gridClass} ${book.tileClass}`}
			custom={book}
			style={{ transformOrigin: "center bottom" }}
			transition={hoverTransition}
			variants={prefersReducedMotion ? undefined : itemVariants}
			whileHover={
				prefersReducedMotion ? undefined : { ...book.hover, zIndex: 20 }
			}
			whileTap={
				prefersReducedMotion
					? undefined
					: { scale: 1.04, y: -4, transition: hoverTransition }
			}
		>
			<Image
				alt={book.alt}
				className="h-auto w-full max-w-18 rounded-sm sm:max-w-22 md:max-w-30 lg:max-w-50"
				height={340}
				sizes="(max-width: 640px) 72px, (max-width: 768px) 88px, (max-width: 1024px) 120px, 200px"
				src={book.src}
				width={200}
			/>
		</m.div>
	);
}

interface BookMosaicProps {
	books: BundleBookItem[];
}

export const BookMosaic = ({ books }: BookMosaicProps) => {
	const prefersReducedMotion = useReducedMotion();
	const mosaicBooks = buildMosaicBooks(books);

	if (mosaicBooks.length === 0) {
		return null;
	}

	return (
		<LazyMotion features={domAnimation}>
			<div
				aria-hidden
				className="pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-40 max-md:hidden sm:opacity-55 md:opacity-100"
			>
				<m.div
					animate={prefersReducedMotion ? undefined : "visible"}
					className="grid h-[50%] scale-90 grid-cols-2 items-start gap-3 px-2 pt-6 sm:scale-95 sm:gap-4 sm:px-4 md:h-full md:scale-100 md:grid-cols-3 md:place-items-center md:gap-8 md:px-8 md:py-12 md:pt-12 lg:gap-12 lg:py-16"
					initial={prefersReducedMotion ? false : "hidden"}
					variants={prefersReducedMotion ? undefined : containerVariants}
				>
					{mosaicBooks.map((book) => (
						<BookTile
							book={book}
							key={book.id}
							prefersReducedMotion={prefersReducedMotion}
						/>
					))}
				</m.div>
			</div>
		</LazyMotion>
	);
};
