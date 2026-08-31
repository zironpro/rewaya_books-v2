import Image from "next/image";

import { BundleBookSlide } from "../../lib/bundlesIndexData";

export function BookSlideCard({ slide }: { slide: BundleBookSlide }) {
	return (
		<figure className="w-[120px] shrink-0 p-1 sm:w-[140px] md:w-[220px]">
			<div className="book-shadow relative aspect-3/4 overflow-hidden rounded-md">
				<Image
					alt={slide.title}
					className="object-cover"
					fill
					sizes="(max-width: 640px) 120px, 220px"
					src={slide.image}
				/>
			</div>
			<figcaption className="mt-2 line-clamp-1 text-center text-secondary text-xs">
				{slide.title}
			</figcaption>
		</figure>
	);
}
