"use client";

interface ProfileStatusBannerProps {
	message: string;
	variant?: "error" | "success";
}

export const ProfileStatusBanner = ({
	message,
	variant = "error",
}: ProfileStatusBannerProps) => {
	return (
		<div
			className={`mb-6 rounded-2xl border px-4 py-3 text-sm ${
				variant === "error"
					? "border-red-100 bg-red-50 text-red-700"
					: "border-emerald-100 bg-emerald-50 text-emerald-700"
			}`}
		>
			{message}
		</div>
	);
};
