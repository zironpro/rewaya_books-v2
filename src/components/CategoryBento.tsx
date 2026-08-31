"use client";

import Image from "next/image";

import { motion } from "motion/react";

const categories = [
	{
		id: 1,
		name: "Islamic Literature",
		description: "Spiritual wisdom for the modern soul.",
		image:
			"https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=1200&auto=format&fit=crop",
		className: "md:col-span-2 md:row-span-2",
		color: "bg-emerald-900",
	},
	{
		id: 2,
		name: "Self Improvement",
		description: "Unlock your full potential.",
		image:
			"https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1200&auto=format&fit=crop",
		className: "md:col-span-1 md:row-span-1",
		color: "bg-blue-900",
	},
	{
		id: 3,
		name: "Modern Fiction",
		description: "Stories that stay with you.",
		image:
			"https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=1200&auto=format&fit=crop",
		className: "md:col-span-1 md:row-span-2",
		color: "bg-amber-900",
	},
	{
		id: 4,
		name: "Children's World",
		description: "Where imagination knows no bounds.",
		image:
			"https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1200&auto=format&fit=crop",
		className: "md:col-span-1 md:row-span-1",
		color: "bg-rose-900",
	},
];

export default function CategoryBento() {
	return (
		<section className="bg-white py-32">
			<div className="container">
				<div className="mb-20 flex flex-col items-center text-center">
					<span className="mb-4 font-bold text-sm text-stone-400">
						Shop by category
					</span>
					<h2 className="font-black font-serif text-4xl md:text-5xl">
						Essentials <span className="font-normal italic">&</span> Classics.
					</h2>
				</div>

				<div className="grid h-auto grid-cols-1 gap-6 md:grid-cols-2">
					{categories.slice(0, 2).map((cat) => (
						<motion.div
							className="group relative aspect-[16/10] cursor-pointer overflow-hidden"
							initial={{ opacity: 0 }}
							key={cat.id}
							whileInView={{ opacity: 1 }}
						>
							<Image
								alt={cat.name}
								className="object-cover transition-all duration-1000 group-hover:scale-105"
								fill
								sizes="(max-width: 768px) 100vw, 50vw"
								src={cat.image}
							/>
							<div className="absolute inset-0 bg-white/10 transition-colors duration-500 group-hover:bg-black/40" />
							<div className="absolute inset-0 flex flex-col items-center justify-center text-secondary transition-colors duration-500 group-hover:text-white">
								<h3 className="mb-4 font-black font-serif text-4xl tracking-tighter md:text-5xl">
									{cat.name}
								</h3>
								<span className="nav-link border-current border-b pb-1 opacity-0 transition-opacity group-hover:opacity-100">
									Discover More
								</span>
							</div>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}
