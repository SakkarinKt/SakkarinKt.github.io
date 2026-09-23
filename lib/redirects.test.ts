import { describe, expect, it } from 'vitest';
import { getCaseStudies, getPosts } from './content/load';
import { buildLegacyMap, resolveLegacy } from './redirects';

const posts = getPosts({ includeDrafts: true }).map((p) => ({ slug: p.slug, legacySlugs: p.data.legacySlugs }));
const map = buildLegacyMap(posts);

describe('legacy redirects', () => {
	it('maps old Astro post slugs to the renamed posts', () => {
		expect(map['/blog/first-post/']).toBe('/blog/cuda-on-cloud-gpus/');
		expect(map['/blog/second-post/']).toBe('/blog/claude-opus-4-5-recap/');
	});

	it('only targets routes the new site actually generates', () => {
		const routes = new Set([
			'/',
			'/about/',
			'/blog/',
			'/projects/',
			...getPosts({ includeDrafts: true }).map((p) => `/blog/${p.slug}/`),
			...getCaseStudies().map((p) => `/projects/${p.slug}/`),
		]);
		for (const target of Object.values(map)) expect(routes).toContain(target);
		for (const [from, to] of Object.entries(map)) {
			expect(from).not.toMatch(/sakkarinkt/i);
			expect(to).not.toMatch(/sakkarinkt/i);
		}
	});

	it('strips the legacy base path, case-insensitively, and normalizes slashes', () => {
		expect(resolveLegacy('/SakkarinKt', map)).toBe('/');
		expect(resolveLegacy('/SakkarinKt/', map)).toBe('/');
		expect(resolveLegacy('/sakkarinkt/about', map)).toBe('/about/');
		expect(resolveLegacy('/SakkarinKt/blog/first-post', map)).toBe('/blog/cuda-on-cloud-gpus/');
		expect(resolveLegacy('/SakkarinKt/blog/archive/', map)).toBe('/blog/');
	});

	it('passes unknown paths through, and never strips a mere prefix match', () => {
		expect(resolveLegacy('/SakkarinKt/projects/janus-chrysalis', map)).toBe('/projects/janus-chrysalis/');
		expect(resolveLegacy('/SakkarinKtX/about/', map)).toBe('/SakkarinKtX/about/');
		expect(resolveLegacy('/SakkarinKt/rss.xml', map)).toBe('/rss.xml');
	});
});
