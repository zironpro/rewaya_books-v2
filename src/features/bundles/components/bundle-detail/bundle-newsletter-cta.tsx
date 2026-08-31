import Link from "next/link";

import { ArrowRight, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";

export function BundleNewsletterCta() {
	return (
		<section className="mx-auto mt-16 mb-8 max-w-5xl">
			<div className="relative overflow-hidden rounded-[2.5rem] border border-stone-100 bg-stone-50 p-8 md:p-12">
				<div className="relative z-10 flex flex-col items-center gap-10 md:flex-row">
					<div className="flex-1 space-y-4">
						<div className="flex items-center gap-3">
							<div className="h-px w-8 bg-primary/30" />
							<span className="font-bold text-primary text-sm">
								The weekly review
							</span>
						</div>
						<h2 className="font-black font-serif text-3xl text-secondary leading-none tracking-tight md:text-4xl">
							Join the{" "}
							<span className="font-normal text-primary italic">
								inner circle
							</span>
						</h2>
						<p className="max-w-sm font-medium text-[12px] text-stone-400 leading-relaxed">
							Exclusive access to limited drops, curated sets, and scholarly
							insights.
						</p>
					</div>

					<div className="w-full md:w-auto">
						<div className="flex flex-col gap-3 sm:flex-row">
							<div className="relative">
								<Mail
									className="absolute top-1/2 left-5 -translate-y-1/2 text-stone-300"
									size={16}
								/>
								<input
									className="h-14 w-full rounded-2xl border border-stone-200 bg-white pr-6 pl-12 font-bold text-secondary text-sm transition-all focus:border-primary focus:outline-none sm:w-[260px]"
									placeholder="Email address"
									type="email"
								/>
							</div>
							<Button className="group h-14 rounded-2xl bg-secondary px-8 font-black text-sm text-white transition-all hover:bg-primary">
								Join now{" "}
								<ArrowRight
									className="ml-2 transition-transform group-hover:translate-x-1"
									size={14}
								/>
							</Button>
						</div>
						<p className="mt-3 text-center text-sm text-stone-300 md:text-left">
							Agreed to our{" "}
							<Link
								className="underline transition-colors hover:text-secondary"
								href="#"
							>
								Privacy Policy
							</Link>
						</p>
					</div>
				</div>
			</div>
		</section>
	);
}
