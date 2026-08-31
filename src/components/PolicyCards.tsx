import Link from "next/link";

import { CreditCard, RotateCcw, ShieldCheck, Truck } from "lucide-react";

const policies = [
	{
		title: "Free shipping",
		desc: "On all orders above AED 200 within UAE",
		icon: Truck,
		href: "/terms",
	},
	{
		title: "7-day returns",
		desc: "Hassle-free return and exchange policy",
		icon: RotateCcw,
		href: "/return",
	},
	{
		title: "Secure payment",
		desc: "100% secure payment processing",
		icon: CreditCard,
		href: "/privacy",
	},
	{
		title: "Genuine books",
		desc: "Direct from authorized publishers",
		icon: ShieldCheck,
		href: "/terms",
	},
];

export function PolicyCards() {
	return (
		<section className="container rounded-xl border border-stone-100 bg-stone-100 py-16">
			<div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
				{policies.map((policy) => {
					const Icon = policy.icon;
					const content = (
						<div className="group flex flex-col items-center text-center">
							<div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm transition-all duration-500 group-hover:bg-primary group-hover:text-white">
								<Icon size={28} strokeWidth={1.2} />
							</div>
							<h3 className="mb-2 font-bold text-base">{policy.title}</h3>
							<p className="text-sm text-stone-400 leading-relaxed">
								{policy.desc}
							</p>
						</div>
					);

					return (
						<Link className="block" href={policy.href} key={policy.title}>
							{content}
						</Link>
					);
				})}
			</div>
		</section>
	);
}
