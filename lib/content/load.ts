import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import type { z } from 'zod';
import { CaseStudy, Post } from './schema';

const ROOT = path.join(process.cwd(), 'content');

export interface Doc<T> {
	slug: string;
	file: string;
	format: 'md' | 'mdx';
	data: T;
	body: string;
}

// YAML turns bare 2026-01-22 into a Date; the schemas want ISO date strings.
function normalizeDates(value: unknown): unknown {
	if (value instanceof Date) return value.toISOString().slice(0, 10);
	if (Array.isArray(value)) return value.map(normalizeDates);
	if (value && typeof value === 'object') {
		return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, normalizeDates(v)]));
	}
	return value;
}

function loadDir<S extends z.ZodType>(dir: string, schema: S): Doc<z.infer<S>>[] {
	const abs = path.join(ROOT, dir);
	return fs
		.readdirSync(abs)
		.filter((f) => /\.mdx?$/.test(f))
		.sort()
		.map((f) => {
			const file = path.join(abs, f);
			const { data, content } = matter(fs.readFileSync(file, 'utf8'));
			const parsed = schema.safeParse(normalizeDates(data));
			if (!parsed.success) {
				const issues = parsed.error.issues.map((i) => `  - ${i.path.join('.')}: ${i.message}`).join('\n');
				throw new Error(`Invalid frontmatter in content/${dir}/${f}\n${issues}`);
			}
			return {
				slug: f.replace(/\.mdx?$/, ''),
				file,
				format: f.endsWith('.mdx') ? 'mdx' : 'md',
				data: parsed.data,
				body: content,
			} as Doc<z.infer<S>>;
		});
}

let projectCache: Doc<CaseStudy>[] | undefined;
let postCache: Doc<Post>[] | undefined;

export function getCaseStudies(): Doc<CaseStudy>[] {
	projectCache ??= loadDir('projects', CaseStudy).sort((a, b) => a.data.order - b.data.order);
	return projectCache;
}

export function getCaseStudy(slug: string): Doc<CaseStudy> | undefined {
	return getCaseStudies().find((p) => p.slug === slug);
}

/** All posts, newest first. Drafts are excluded unless asked for. */
export function getPosts({ includeDrafts = false } = {}): Doc<Post>[] {
	postCache ??= loadDir('posts', Post).sort((a, b) => b.data.pubDate.localeCompare(a.data.pubDate));
	return includeDrafts ? postCache : postCache.filter((p) => !p.data.draft);
}

/** Posts shown in listings, the feed, and the sitemap. */
export function getListedPosts(): Doc<Post>[] {
	return getPosts().filter((p) => !p.data.archived);
}

export function getPost(slug: string): Doc<Post> | undefined {
	return getPosts().find((p) => p.slug === slug);
}
