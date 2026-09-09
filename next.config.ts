import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	typescript: {
		// Allow production builds even if TypeScript reports type errors
		ignoreBuildErrors: true,
	},
	reactCompiler: true,
	experimental: {
		turbopackFileSystemCacheForBuild: true,
		turbopackFileSystemCacheForDev: true,
	},

	images: {
		remotePatterns: [
			{ hostname: "images.unsplash.com" },
			{ hostname: "static.wixstatic.com" },
			{ hostname: "lh3.googleusercontent.com" },
			{ hostname: "res.cloudinary.com" },
		],
	},
	async redirects() {
		return [
			{
				source: "/product-page/:slug",
				destination: "/product/:slug",
				permanent: true,
			},
		];
	},
};

export default nextConfig;
