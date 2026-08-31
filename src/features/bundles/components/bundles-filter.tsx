"use client";

import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import type { Bundle } from "@/lib/catalog/types";
import { cn } from "@/lib/utils";

const categories = ["All", "Kids", "Educational", "Spiritual", "History"];

interface BundlesFilterProps {
	bundles: Bundle[];
	onApply?: () => void;
	showApplyButton?: boolean;
}

export const BundlesFilter = ({
	bundles,
	onApply,
	showApplyButton = false,
}: BundlesFilterProps) => {
	return (
		<div className="space-y-12">
			<div>
				<h3 className="mb-8 border-stone-100 border-b pb-4 font-bold text-primary text-sm">
					Search Archive
				</h3>
				<div className="relative">
					<Search
						className="absolute top-1/2 left-4 -translate-y-1/2 text-stone-300"
						size={16}
					/>
					<input
						className="h-12 w-full border border-stone-100 bg-stone-50 pr-4 pl-12 font-bold text-sm transition-all focus:border-primary focus:outline-none"
						placeholder="Find a set..."
						type="text"
					/>
				</div>
			</div>

			<div>
				<h3 className="mb-8 border-stone-100 border-b pb-4 font-bold text-primary text-sm">
					Curations
				</h3>
				<div className="flex flex-col gap-2">
					{categories.map((cat) => (
						<Button
							className="h-10 justify-between px-2 hover:bg-stone-50"
							key={cat}
							variant="ghost"
						>
							<span
								className={cn(
									"font-bold text-sm",
									cat === "All" && "text-primary"
								)}
							>
								{cat}
							</span>
							<span className="text-sm text-stone-300 group-hover:text-black">
								(
								{cat === "All"
									? bundles.length
									: bundles.filter(
											(b) =>
												b.tag?.includes(cat) || b.id?.includes(cat.toLowerCase()) || b.slug?.includes(cat.toLowerCase())
										).length}
								)
							</span>
						</Button>
					))}
				</div>
			</div>

			<div>
				<h3 className="mb-8 border-stone-100 border-b pb-4 font-bold text-primary text-sm">
					Volume Count
				</h3>
				<div className="space-y-4">
					<div className="flex items-center space-x-3">
						<Checkbox id="vol-5" />
						<label className="cursor-pointer font-bold text-sm" htmlFor="vol-5">
							5+ Volumes
						</label>
					</div>
					<div className="flex items-center space-x-3">
						<Checkbox id="vol-10" />
						<label
							className="cursor-pointer font-bold text-sm"
							htmlFor="vol-10"
						>
							10+ Volumes
						</label>
					</div>
				</div>
			</div>

			{showApplyButton && (
				<div className="pt-8">
					<Button
						className="h-12 w-full bg-primary font-bold text-sm text-white hover:bg-primary-dark"
						onClick={onApply}
					>
						Apply Filters
					</Button>
				</div>
			)}
		</div>
	);
};
