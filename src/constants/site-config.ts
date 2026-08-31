import { FacebookIcon, InstagramIcon } from "@/assets/icons/brands";

export const SOCIAL_LINKS = [
	{
		href: "https://www.instagram.com",
		label: "Follow us on Instagram",
		Icon: InstagramIcon,
	},
	{
		href: "https://www.facebook.com",
		label: "Follow us on Facebook",
		Icon: FacebookIcon,
	},
] as const;

export const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL
	? process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "")
	: process.env.NODE_ENV === "development"
		? "http://localhost:3000"
		: "https://rewayabooks.com";
