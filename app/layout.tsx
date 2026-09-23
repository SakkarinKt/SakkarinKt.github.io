import type { Metadata, Viewport } from 'next';
import { Fraunces, Inter, JetBrains_Mono } from 'next/font/google';
import type { ReactNode } from 'react';
import { SiteFooter } from '@/components/site/SiteFooter';
import { SiteHeader } from '@/components/site/SiteHeader';
import { ThemeProvider } from '@/components/site/ThemeProvider';
import { buildPaletteItems } from '@/lib/palette/items';
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/site';
import './globals.css';

const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-fraunces', axes: ['SOFT', 'opsz'], display: 'swap' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains', display: 'swap' });

export const metadata: Metadata = {
	metadataBase: new URL(SITE_URL),
	title: { default: `${SITE_NAME} — AI/ML Engineer`, template: `%s · ${SITE_NAME}` },
	description: SITE_DESCRIPTION,
	authors: [{ name: SITE_NAME, url: SITE_URL }],
	alternates: { canonical: '/', types: { 'application/rss+xml': [{ url: '/rss.xml', title: `${SITE_NAME} — writing` }] } },
	openGraph: {
		type: 'website',
		siteName: SITE_NAME,
		url: '/',
		images: [{ url: '/og/home.png', width: 1200, height: 630 }],
	},
	twitter: { card: 'summary_large_image' },
};

export const viewport: Viewport = {
	themeColor: [
		{ media: '(prefers-color-scheme: light)', color: '#faf7f2' },
		{ media: '(prefers-color-scheme: dark)', color: '#15120f' },
	],
};

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning className={`${fraunces.variable} ${inter.variable} ${mono.variable}`}>
			<body className="min-h-dvh font-sans antialiased">
				<ThemeProvider>
					<a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-paper">
						Skip to content
					</a>
					<SiteHeader paletteItems={buildPaletteItems()} />
					<main id="main">{children}</main>
					<SiteFooter />
				</ThemeProvider>
			</body>
		</html>
	);
}
