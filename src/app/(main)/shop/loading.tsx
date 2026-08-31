import { SlidersHorizontal } from "lucide-react";

import Breadcrumbs from "@/components/layout/Breadcrumbs";
import { Button } from "@/components/ui/button";

export default function ShopLoading() {
	return (
		<main className="grow pt-4 pb-28 md:pt-6 md:pb-16">
			<section className="container max-w-none md:mb-4">
				<Breadcrumbs className="mb-2" items={[{ label: "Shop" }]} />
				<div className="flex items-center justify-between text-center md:justify-center">
					<h1 className="mb-4 font-bold font-display text-3xl text-secondary sm:text-4xl md:mb-4 md:text-5xl">
						The <span className="text-primary italic">Library.</span>
					</h1>

					<Button className="opacity-50 md:hidden" disabled variant="outline">
						<SlidersHorizontal className="mr-2" size={14} /> Filter & Sort
					</Button>
				</div>
			</section>

			<section className="container mb-6 max-w-none">
				<div className="flex flex-col gap-9 lg:flex-row">
					<aside className="sticky top-32 hidden h-fit max-h-[calc(100vh-160px)] w-64 shrink-0 space-y-12 pr-4 lg:block">
						<div className="animate-pulse space-y-12">
							<div>
								<div className="mb-4 h-5 w-24 rounded border-b bg-stone-200 pb-1" />
								<div className="flex flex-col gap-2">
									{Array.from(
										{ length: 6 },
										(_, i) => `filter-skeleton-${i}`
									).map((id) => (
										<div
											className="h-6 w-full rounded-sm bg-stone-100"
											key={id}
										/>
									))}
								</div>
							</div>
							<div>
								<div className="mb-4 h-5 w-24 rounded border-b bg-stone-200 pb-1" />
								<div className="h-20 w-full rounded bg-stone-100" />
							</div>
						</div>
					</aside>

					<div className="grow">
						<div className="mb-4 hidden animate-pulse items-center justify-between border-mauve-100 border-b pb-2 md:flex">
							<div className="h-5 w-40 rounded bg-stone-200" />
							<div className="h-8 w-44 rounded bg-stone-100" />
						</div>

						<div className="animate-pulse space-y-8">
							<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
								{Array.from(
									{ length: 10 },
									(_, i) => `product-skeleton-${i}`
								).map((id) => (
									<div className="flex flex-col gap-4" key={id}>
										<div className="aspect-4/5 w-full rounded-md bg-stone-100" />
										<div className="space-y-2">
											<div className="h-4 w-3/4 rounded bg-stone-200" />
											<div className="h-3 w-1/2 rounded bg-stone-100" />
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}
