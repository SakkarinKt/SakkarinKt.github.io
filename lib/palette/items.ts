import fs from 'node:fs';
import path from 'node:path';
import { bench } from '@/content/data/bench';
import { profile } from '@/content/data/profile';
import { getCaseStudies, getListedPosts } from '@/lib/content/load';
import type { PaletteItem } from './types';

export function hasResume(): boolean {
	return fs.existsSync(path.join(process.cwd(), 'public', 'resume.pdf'));
}

/** Serializable command-palette entries, built at build time from content. */
export function buildPaletteItems(): PaletteItem[] {
	const items: PaletteItem[] = [
		{ id: 'page-home', group: 'Pages', label: 'Home', href: '/', keywords: ['start', 'index'] },
		{ id: 'page-work', group: 'Pages', label: 'Work', hint: 'case studies, lab bench, up next', href: '/projects/', keywords: ['projects', 'portfolio'] },
		{ id: 'page-writing', group: 'Pages', label: 'Writing', href: '/blog/', keywords: ['blog', 'posts'] },
		{ id: 'page-about', group: 'Pages', label: 'About', hint: 'story, experience, skills', href: '/about/', keywords: ['cv', 'experience', 'education', 'skills'] },
		{ id: 'page-contact', group: 'Pages', label: 'Contact', href: '/#contact', keywords: ['email', 'hire', 'reach'] },
	];

	for (const p of getCaseStudies()) {
		items.push({ id: `cs-${p.slug}`, group: 'Case studies', label: p.data.title, hint: p.data.tagline, href: `/projects/${p.slug}/`, keywords: p.data.tags });
	}
	for (const b of bench) {
		items.push({ id: `bench-${b.slug}`, group: 'Lab bench', label: b.title, hint: b.oneLiner, href: `/projects/#${b.slug}`, keywords: b.stack });
	}
	for (const post of getListedPosts()) {
		items.push({ id: `post-${post.slug}`, group: 'Writing', label: post.data.title, hint: post.data.pubDate, href: `/blog/${post.slug}/`, keywords: post.data.tags });
	}

	items.push(
		{ id: 'act-theme', group: 'Actions', label: 'Toggle light / dark', action: 'toggle-theme', keywords: ['theme', 'dark mode'] },
		{ id: 'act-email', group: 'Actions', label: 'Copy email address', hint: profile.email, action: 'copy-email', keywords: ['contact', 'mail'] },
		{ id: 'act-poke', group: 'Actions', label: 'Poke the gridworld', hint: 'new maze, watch it re-learn', action: 'poke-gridworld', keywords: ['rl', 'q-learning', 'demo', 'agent'] },
		{ id: 'ext-github', group: 'Elsewhere', label: 'GitHub', hint: 'SakkarinKt', href: profile.github, external: true },
		{ id: 'ext-linkedin', group: 'Elsewhere', label: 'LinkedIn', href: profile.linkedin, external: true },
		{ id: 'ext-rss', group: 'Elsewhere', label: 'RSS feed', href: '/rss.xml', external: true },
	);
	if (hasResume()) {
		items.push({ id: 'ext-resume', group: 'Elsewhere', label: 'Résumé (PDF)', href: '/resume.pdf', external: true, keywords: ['cv'] });
	}
	return items;
}
