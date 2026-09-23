import { describe, expect, it } from 'vitest';
import { extractHeadings } from './headings';
import { getCaseStudies, getListedPosts, getPosts } from './load';
import { CaseStudy } from './schema';
import { validateContent } from './validate';

describe('content', () => {
	it('passes every structural rule', () => {
		expect(validateContent()).toEqual([]);
	});

	it('has exactly one lead case study, and it comes first', () => {
		const studies = getCaseStudies();
		expect(studies.filter((s) => s.data.tier === 'lead')).toHaveLength(1);
		expect(studies[0]!.data.tier).toBe('lead');
	});

	it('rejects a case study without honest limits, or with a metric missing its n', () => {
		const base = getCaseStudies()[0]!.data;
		expect(CaseStudy.safeParse({ ...base, honestLimits: [] }).success).toBe(false);
		expect(CaseStudy.safeParse({ ...base, metrics: [{ label: 'x', value: '1' }] }).success).toBe(false);
		expect(CaseStudy.safeParse({ ...base, visibility: 'local-only' }).success).toBe(false);
	});

	it('sorts posts newest first and hides drafts/archived from listings', () => {
		const dates = getPosts().map((p) => p.data.pubDate);
		expect([...dates].sort().reverse()).toEqual(dates);
		for (const p of getListedPosts()) expect(p.data.archived || p.data.draft).toBe(false);
	});

	it('derives heading ids the way rehype-slug does', () => {
		const h = extractHeadings('## What’s next\n\n```\n## not a heading\n```\n\n### `code` and [link](x)\n## What’s next');
		expect(h.map((x) => x.id)).toEqual(['whats-next', 'code-and-link', 'whats-next-1']);
	});
});
