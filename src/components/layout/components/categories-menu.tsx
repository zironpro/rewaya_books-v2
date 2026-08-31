import { useState } from "react";

import Image from "next/image";
import Link from "next/link";

import { BookOpen, ChevronDown, Menu, Star, Zap } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { CATEGORIES, MEGA_MENU_DATA } from "../data";

export const CategoriesMenu = ({ categories }: { categories?: any[] }) => {
	const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
	return (
		<nav className="relative hidden overflow-visible border-stone-50 border-b bg-white lg:block">
			<div className="container mx-auto flex h-12 items-center gap-10">
				<button
					className="flex items-center gap-2 border-stone-100 border-r pr-10 font-medium text-secondary text-sm transition-colors hover:text-primary"
					onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)}
					onMouseEnter={() => setIsMegaMenuOpen(true)}
				>
					<Menu size={16} /> All Categories{" "}
					<ChevronDown
						className={`transition-transform duration-300 ${isMegaMenuOpen ? "rotate-180" : ""}`}
						size={12}
					/>
				</button>
				{CATEGORIES.map(({ icon: Icon, ...cat }) => (
					<Link
						className="flex items-center gap-2 whitespace-nowrap font-medium text-secondary text-sm transition-colors hover:text-primary"
						href={cat.href}
						key={cat.name}
					>
						<Icon className="size-4" />
						{cat.name}
					</Link>
				))}
			</div>

			{/* Mega Menu Dropdown */}
			<AnimatePresence>
				{isMegaMenuOpen && (
					<>
						{/* Backdrop */}
						<motion.div
							animate={{ opacity: 1 }}
							className="fixed inset-0 top-32 z-30 bg-black/20 backdrop-blur-sm"
							exit={{ opacity: 0 }}
							initial={{ opacity: 0 }}
							onClick={() => setIsMegaMenuOpen(false)}
						/>

						{/* Menu Panel */}
						<motion.div
							animate={{ opacity: 1, y: 0 }}
							className="absolute top-full right-0 left-0 z-40 overflow-hidden border-stone-100 border-b bg-white shadow-2xl"
							exit={{ opacity: 0, y: -20 }}
							initial={{ opacity: 0, y: -20 }}
							onMouseLeave={() => setIsMegaMenuOpen(false)}
						>
							<div className="container py-12">
								<div className="grid grid-cols-5 gap-12">
									<div className="col-span-4 grid grid-cols-4 gap-x-8 gap-y-3">
										{categories?.map((cat) => (
											<Link
												className="group/item flex items-center gap-2 font-medium text-secondary text-sm transition-colors hover:text-primary"
												href={cat.href}
												key={cat.id}
											>
												<div className="h-1.5 w-1.5 rounded-full bg-secondary/30 transition-colors group-hover/item:bg-primary" />
												{cat.name}
											</Link>
										))}
									</div>

									{/* Featured Section */}
									<div className="col-span-1 border-stone-100 border-l pl-12">
										<div className="group/feat relative mb-4 aspect-3/4 overflow-hidden rounded-lg">
											<Image
												alt="Featured"
												className="object-cover transition-transform duration-700 group-hover/feat:scale-110"
												fill
												sizes="(max-width: 1024px) 20vw, 300px"
												src={MEGA_MENU_DATA.featured.image}
											/>
											<div className="absolute inset-0 bg-secondary/10 transition-colors group-hover/feat:bg-transparent" />
											<div className="absolute bottom-4 left-4">
												<span className="bg-primary px-2 py-1 font-bold text-sm text-white">
													{MEGA_MENU_DATA.featured.tag}
												</span>
											</div>
										</div>
										<h4 className="mb-2 font-bold text-secondary text-sm">
											{MEGA_MENU_DATA.featured.title}
										</h4>
										<Link
											className="font-bold text-primary text-sm hover:underline"
											href="/shop"
										>
											Discover Collection
										</Link>
									</div>
								</div>

								{/* Bottom Utility links inside Mega Menu */}
								<div className="mt-12 flex items-center justify-between border-t pt-8">
									<div className="flex gap-8">
										<div className="flex items-center gap-3">
											<div className="grid size-9 place-content-center rounded-full bg-muted text-primary">
												<BookOpen className="size-4" />
											</div>
											<div>
												<p className="font-bold font-display text-secondary">
													New Releases
												</p>
												<p className="text-muted-foreground text-xs">
													Updated Daily
												</p>
											</div>
										</div>
										<div className="flex items-center gap-3">
											<div className="grid size-9 place-content-center rounded-full bg-muted text-secondary">
												<Star className="size-4" />
											</div>
											<div>
												<p className="font-bold font-display text-secondary">
													Best Sellers
												</p>
												<p className="text-muted-foreground text-xs">
													Top 100 Books
												</p>
											</div>
										</div>
									</div>
									<div className="flex gap-4">
										<div className="flex items-center gap-2 rounded-lg bg-primary/5 px-4 py-2 text-primary">
											<Zap fill="currentColor" size={14} />
											<span className="font-bold text-sm">
												Sale: Up to 40% Off
											</span>
										</div>
									</div>
								</div>
							</div>
						</motion.div>
					</>
				)}
			</AnimatePresence>
		</nav>
	);
};
