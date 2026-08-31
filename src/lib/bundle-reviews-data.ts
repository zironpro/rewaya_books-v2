export interface Review {
	id: string;
	quote: string;
	name: string;
	location: string;
	rating: number;
}

const bundleReviews: Record<string, Review[]> = {
	"creative-brain-booster-pack": [
		{
			id: "r1",
			quote:
				"Beautifully boxed and exactly what I wanted for Ramadan — my husband reads the seerah, I reach for Reclaim Your Heart.",
			name: "Amina K.",
			location: "Dubai",
			rating: 5,
		},
		{
			id: "r2",
			quote:
				"Price felt fair for five hardcovers. Fortress of the Muslim alone lives on my bedside table now.",
			name: "Omar H.",
			location: "Sharjah",
			rating: 5,
		},
		{
			id: "r3",
			quote:
				"Shipped quickly across the UAE. The mix of practical and soulful books is thoughtful.",
			name: "Leila M.",
			location: "Abu Dhabi",
			rating: 4,
		},
	],
	"little-muslim-learners-starter-pack": [
		{
			id: "r1",
			quote:
				"My kids reach for the flash cards every morning — the whole set feels thoughtfully put together.",
			name: "Fatima R.",
			location: "Dubai",
			rating: 5,
		},
		{
			id: "r2",
			quote:
				"Great value for a starter library. The wipe-clean book has survived a lot of toddler use.",
			name: "Yusuf A.",
			location: "Ajman",
			rating: 5,
		},
		{
			id: "r3",
			quote: "Arrived well packed. Nice mix of learning and fun for ages 4–8.",
			name: "Nadia S.",
			location: "Abu Dhabi",
			rating: 4,
		},
	],
};

export function getBundleReviews(bundleId: string): Review[] {
	return bundleReviews[bundleId] ?? [];
}
