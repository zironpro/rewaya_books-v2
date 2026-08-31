import { MetadataRoute } from "next";

import { BASE_URL } from "@/constants/site-config";

export default function robots(): MetadataRoute.Robots {
	return {
		rules: {
			userAgent: "*",
			allow: "/",
			disallow: [
				"/profile/",
				"/wishlist/",
				"/cart/",
				"/checkout/",
				"/thank-you/",
				"/auth/",
				"/login/",
				"/signup/",
			],
		},
		sitemap: `${BASE_URL}/sitemap.xml`,
	};
}
