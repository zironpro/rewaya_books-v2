"use client";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Search } from "lucide-react";
import { useState } from "react";

const FAQ_DATA = [
	{
		category: "Shipping & Delivery",
		questions: [
			{
				q: "How long does shipping take?",
				a: "Standard shipping typically takes 3-5 business days within the UAE. Express delivery options (1-2 business days) are available at checkout.",
			},
			{
				q: "Do you ship internationally?",
				a: "Yes, we ship to Saudi Arabia, Oman, Qatar, Bahrain, Kuwait, the UK, the US, and worldwide. International shipping times vary between 7-14 business days depending on the destination.",
			},
			{
				q: "How can I track my order?",
				a: "Once your order is dispatched, you will receive an email with a tracking link. You can also track your order directly from your account page if you checked out as a registered user.",
			},
		],
	},
	{
		category: "Returns & Exchanges",
		questions: [
			{
				q: "What is your return policy?",
				a: "We accept returns within 14 days of delivery. Books must be in their original, unread condition. Please note that return shipping costs are the responsibility of the customer unless the item arrived damaged.",
			},
			{
				q: "How do I initiate a return?",
				a: "To start a return, please contact our support team at support@alrewaya.com with your order number. We will provide you with the return instructions.",
			},
			{
				q: "Can I exchange a book?",
				a: "Yes, you can exchange a book within 14 days of receiving it, provided it is in its original condition. Contact our support team to arrange an exchange.",
			},
		],
	},
	{
		category: "Orders & Payments",
		questions: [
			{
				q: "What payment methods do you accept?",
				a: "We accept all major credit and debit cards (Visa, MasterCard, Amex) via Stripe, Apple Pay, and Cash on Delivery (COD) for orders within the UAE.",
			},
			{
				q: "Can I cancel or modify my order?",
				a: "Orders can only be modified or canceled within 2 hours of placement. Please email us immediately at support@alrewaya.com if you need to make changes.",
			},
			{
				q: "I forgot to add my promo code. Can you apply it?",
				a: "Unfortunately, we cannot apply promo codes to an order after it has been placed. Please save it for your next purchase!",
			},
		],
	},
	{
		category: "General",
		questions: [
			{
				q: "Where is your store located?",
				a: "We are located at Ajman Jurf 2, Shahba Complex Block A Shop No. 6, Opposite Habitat School, Ajman, UAE.",
			},
			{
				q: "Do you offer gift cards?",
				a: "Yes! Digital gift cards are available for purchase on our website and are delivered immediately via email.",
			},
			{
				q: "How can I contact customer support?",
				a: "You can reach us by email at support@alrewaya.com, or by calling our store directly during business hours. Visit our Contact Us page for more details.",
			},
		],
	},
];

export const FAQView = () => {
	const [searchQuery, setSearchQuery] = useState("");

	const filteredData = FAQ_DATA.map((section) => ({
		...section,
		questions: section.questions.filter(
			(item) =>
				item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
				item.a.toLowerCase().includes(searchQuery.toLowerCase())
		),
	})).filter((section) => section.questions.length > 0);

	return (
		<main className="relative min-h-screen bg-slate-50 pt-32 pb-24 dark:bg-slate-950 overflow-hidden">
			{/* Decorative background gradients */}
			<div className="absolute top-0 left-1/2 -ml-[30%] -mt-[10%] h-[600px] w-[600px] rounded-full bg-primary/10 blur-[150px] opacity-70" />
			<div className="absolute top-[40%] right-0 -mr-[10%] h-[400px] w-[400px] rounded-full bg-blue-500/10 blur-[120px] opacity-60" />

			<div className="container relative z-10 mx-auto max-w-4xl px-4">
				<div className="text-center mb-16">
					<span className="font-bold text-sm text-primary uppercase tracking-wider mb-4 block">
						Help Center
					</span>
					<h1 className="font-extrabold text-4xl sm:text-5xl lg:text-6xl text-slate-900 dark:text-white tracking-tight mb-6">
						Frequently Asked <br className="hidden sm:block" />
						<span className="text-primary">Questions</span>
					</h1>
					<p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10">
						Everything you need to know about our products, shipping, returns, and more. Can't find the answer you're looking for? Feel free to contact us.
					</p>

					{/* Search Bar */}
					<div className="relative max-w-xl mx-auto">
						<div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
							<Search className="h-5 w-5 text-slate-400" />
						</div>
						<input
							type="text"
							placeholder="Search for answers..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200/80 bg-white/80 backdrop-blur-xl shadow-lg shadow-slate-200/20 text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:ring-4 focus:ring-primary/10 focus:border-primary dark:border-slate-800/80 dark:bg-slate-900/80 dark:shadow-none dark:text-white"
						/>
					</div>
				</div>

				{/* FAQ Content */}
				<div className="space-y-12">
					{filteredData.length > 0 ? (
						filteredData.map((section, idx) => (
							<div key={idx} className="fade-in animate-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
								<h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 pl-2 border-l-4 border-primary">
									{section.category}
								</h2>
								<div className="rounded-3xl border border-slate-200/60 bg-white/50 backdrop-blur-xl shadow-xl shadow-slate-200/10 p-6 sm:p-8 dark:border-slate-800/60 dark:bg-slate-900/50 dark:shadow-none">
									<Accordion type="multiple" className="w-full">
										{section.questions.map((item, qIdx) => (
											<AccordionItem key={qIdx} value={`item-${idx}-${qIdx}`} className="border-slate-200 dark:border-slate-800">
												<AccordionTrigger className="text-left font-semibold text-slate-900 dark:text-slate-100 hover:text-primary transition-colors py-5 text-base sm:text-lg">
													{item.q}
												</AccordionTrigger>
												<AccordionContent className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm sm:text-base pb-6">
													{item.a}
												</AccordionContent>
											</AccordionItem>
										))}
									</Accordion>
								</div>
							</div>
						))
					) : (
						<div className="text-center py-24 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700">
							<h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No results found</h3>
							<p className="text-slate-500 dark:text-slate-400">
								We couldn't find any answers matching "{searchQuery}".
							</p>
						</div>
					)}
				</div>
			</div>
		</main>
	);
};
