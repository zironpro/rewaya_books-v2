import { Package, ShieldCheckIcon, Truck } from "lucide-react";

const TRUST_ITEMS = [
	{
		icon: Truck,
		title: "UAE delivery",
		description: "Standard delivery windows at checkout",
	},
	{
		icon: Package,
		title: "Curated sets",
		description: "Hand-picked titles that read well together",
	},
	{
		icon: ShieldCheckIcon,
		title: "Secure checkout",
		description: "Same trusted Rewaya cart and payment",
	},
] as const;

export function BundlesIndexTrust() {
	return (
		<section className="container grid max-w-3xl gap-4 pb-10 sm:grid-cols-3 md:pb-14">
			{TRUST_ITEMS.map(({ icon: Icon, title, description }) => (
				<div
					className="flex flex-col items-center rounded-xl border border-border bg-card p-4 text-center shadow-sm transition-shadow duration-300 hover:shadow-md"
					key={title}
				>
					<div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
						<Icon className="size-5" />
					</div>
					<h3 className="mt-4 font-bold font-display text-lg text-secondary uppercase">
						{title}
					</h3>
					<p className="mt-1 text-balance text-muted-foreground text-sm">
						{description}
					</p>
				</div>
			))}
		</section>
	);
}
