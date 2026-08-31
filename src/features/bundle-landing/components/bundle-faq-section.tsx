"use client";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";

import type { BundlePresentation } from "@/domain/bundle";

interface BundleFaqSectionProps {
	bundle: BundlePresentation;
}

export function BundleFaqSection({ bundle }: BundleFaqSectionProps) {
	return (
		<section className="py-14 md:py-20">
			<div className="mx-auto max-w-3xl px-4 sm:px-6">
				<h2 className="text-center font-display text-(--bundle-ink) text-2xl tracking-tight md:text-3xl">
					Questions
				</h2>
				<p className="mt-2 text-center text-muted-foreground">
					Everything about delivery, editions, and checkout for {bundle.name}.
				</p>
				<Accordion
					className="mt-8 rounded-lg border border-gold/20 bg-white/70 px-2 shadow-sm"
					defaultValue={bundle.faqs[0]?.id ? [bundle.faqs[0].id] : undefined}
				>
					{bundle.faqs.map((faq) => (
						<AccordionItem key={faq.id} value={faq.id}>
							<AccordionTrigger className="px-2 text-left font-display text-(--bundle-ink) text-sm sm:px-3 sm:text-base">
								{faq.question}
							</AccordionTrigger>
							<AccordionContent className="px-2 text-muted-foreground sm:px-3">
								{faq.answer}
							</AccordionContent>
						</AccordionItem>
					))}
				</Accordion>
			</div>
		</section>
	);
}
