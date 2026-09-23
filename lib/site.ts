export const SITE_URL = 'https://sakkarinkt.github.io';
export const SITE_NAME = 'Sakkarin Krarat';
export const SITE_DESCRIPTION =
	'Sakkarin Krarat — AI/ML engineer in Taipei. Reinforcement learning, world models, and agentic LLM systems, built in public and measured honestly.';
export const SOURCE_REPO = 'https://github.com/SakkarinKt/SakkarinKt.github.io';

export const NAV = [
	{ href: '/projects/', label: 'Work' },
	{ href: '/blog/', label: 'Writing' },
	{ href: '/about/', label: 'About' },
] as const;

export function absoluteUrl(path: string): string {
	return new URL(path, SITE_URL).toString();
}
