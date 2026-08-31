import React from "react";

export const LanguageIcon = (props: React.SVGProps<SVGSVGElement>) => {
	return (
		<svg
			{...props}
			fill="none"
			height="20"
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="1.5"
			viewBox="0 0 24 24"
			width="20"
		>
			<path d="m5 8 6 6" />
			<path d="m4 14 6-6 2-3" />
			<path d="M2 5h12" />
			<path d="M7 2h1" />
			<path d="m22 22-5-10-5 10" />
			<path d="M14 18h6" />
		</svg>
	);
};
