import { CreditCard, MapPin, Package, Settings, User } from "lucide-react";

export const profileNavItems = [
	{ href: "/profile", label: "Overview", icon: User },
	{ href: "/profile/orders", label: "My Orders", icon: Package },
	{ href: "/profile/addresses", label: "Addresses", icon: MapPin },
	// { href: "/profile/payment", label: "Payment", icon: CreditCard },
	{ href: "/profile/settings", label: "Settings", icon: Settings },
];
