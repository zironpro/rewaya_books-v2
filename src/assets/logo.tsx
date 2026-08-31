import Image from "next/image";

export const Logo = () => {
	return (
		<Image
			alt="Al Rewaya Logo"
			className="h-10 w-auto object-contain md:h-11"
			height={44}
			loading="eager"
			priority
			src="/rewaya-logo.svg"
			width={176}
		/>
	);
};
