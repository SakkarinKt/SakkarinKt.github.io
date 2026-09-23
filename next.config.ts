import type { NextConfig } from 'next';

// User site served from the domain root (SakkarinKt.github.io), so no basePath.
const config: NextConfig = {
	output: 'export',
	trailingSlash: true,
	images: { unoptimized: true },
	reactStrictMode: true,
	env: {
		NEXT_PUBLIC_BUILD_SHA: (process.env.GITHUB_SHA ?? 'local').slice(0, 7),
		NEXT_PUBLIC_BUILD_DATE: new Date().toISOString().slice(0, 10),
	},
};

export default config;
