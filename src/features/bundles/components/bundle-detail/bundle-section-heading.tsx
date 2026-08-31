interface BundleSectionHeadingProps {
	eyebrow: string;
	title: string;
	highlight: string;
}

export function BundleSectionHeading({
	eyebrow,
	title,
	highlight,
}: BundleSectionHeadingProps) {
	return (
		<div>
			<span className="mb-2 block font-medium text-primary text-xs uppercase">
				{eyebrow}
			</span>
			<h2 className="font-bold font-serif text-4xl text-secondary leading-none tracking-tight md:text-5xl">
				{title}{" "}
				<span className="font-normal text-primary italic">{highlight}</span>
			</h2>
		</div>
	);
}
