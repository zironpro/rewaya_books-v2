"use client";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";

import type { Faq } from "@/domain/catalog";

interface BundlesIndexFaqSectionProps {
	faqs: Faq[];
}

export function BundlesIndexFaqSection({ faqs }: BundlesIndexFaqSectionProps) {
	if (faqs.length === 0) return null;

	return (
		<section className="py-14 md:pt-20" id="faq">
			<div className="container max-w-3xl">
				<h2 className="text-center font-bold font-display text-3xl text-secondary tracking-tight md:text-4xl">
					Questions
				</h2>
				<p className="mt-2 text-balance text-center text-muted-foreground">
					Delivery, editions, and checkout for Rewaya bundles.
				</p>
				<Accordion
					className="mt-8 rounded-lg border border-gold/20 bg-card shadow-xs"
					defaultValue={faqs[0]?.id ? [faqs[0].id] : undefined}
				>
					{faqs.map((faq) => (
						<AccordionItem key={faq.id} value={faq.id}>
							<AccordionTrigger className="px-2 text-left font-display text-secondary text-sm sm:px-3 sm:text-base">
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
