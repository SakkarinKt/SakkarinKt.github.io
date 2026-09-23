import { z } from 'zod';

const yearMonth = z.string().regex(/^\d{4}(-\d{2})?$/, 'expected YYYY or YYYY-MM');
const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'expected YYYY-MM-DD');

export const EVIDENCE = {
	'null-result': 'null result',
	inconclusive: 'inconclusive',
	preliminary: 'preliminary',
	'self-check': 'self-check',
	synthetic: 'synthetic only',
	measured: 'measured',
	none: 'no results yet',
} as const;
export type Evidence = keyof typeof EVIDENCE;
const evidence = z.enum(Object.keys(EVIDENCE) as [Evidence, ...Evidence[]]);

export const Metric = z.object({
	label: z.string(),
	value: z.string(),
	// Every number carries its sample size. No exceptions.
	n: z.string().min(1),
	baseline: z.string().optional(),
	caveat: z.string().optional(),
});
export type Metric = z.infer<typeof Metric>;

export const ProjectLink = z.object({
	label: z.string(),
	href: z.url(),
	kind: z.enum(['repo', 'demo', 'post', 'doc']),
});

export const CaseStudy = z
	.object({
		title: z.string(),
		tagline: z.string().max(160),
		tier: z.enum(['lead', 'case-study']),
		order: z.number().int(),
		status: z.enum(['active', 'paused', 'shipped', 'prototype']),
		evidence,
		visibility: z.enum(['public', 'local-only', 'private']),
		period: z.object({ start: yearMonth, end: yearMonth.optional() }),
		asOf: isoDate,
		tldr: z.string().min(1),
		stack: z.array(z.string()).min(1),
		tags: z.array(z.string()).default([]),
		links: z.array(ProjectLink).default([]),
		metrics: z.array(Metric).max(4).default([]),
		honestLimits: z.array(z.string()).min(1, 'every case study needs honest limits'),
		size: z.object({ loc: z.string(), tests: z.string() }).optional(),
	})
	.superRefine((p, ctx) => {
		// Decision: only public work gets a full case study.
		if (p.visibility !== 'public') {
			ctx.addIssue({ code: 'custom', path: ['visibility'], message: 'case studies must be public repos' });
		}
	});
export type CaseStudy = z.infer<typeof CaseStudy>;

export const Post = z.object({
	title: z.string(),
	description: z.string().max(220),
	pubDate: isoDate,
	updatedDate: isoDate.optional(),
	tags: z.array(z.string()).default([]),
	archived: z.boolean().default(false),
	draft: z.boolean().default(false),
	// Slugs this post used on the old Astro site; the legacy redirect stubs point these here.
	legacySlugs: z.array(z.string()).default([]),
	editorNote: z.string().optional(),
});
export type Post = z.infer<typeof Post>;

export const BenchItem = z
	.object({
		slug: z.string().regex(/^[a-z0-9-]+$/),
		title: z.string(),
		oneLiner: z.string().max(220),
		evidence,
		chips: z.array(z.string()).max(3).default([]),
		visibility: z.enum(['public', 'local-only', 'private']),
		stack: z.array(z.string()).min(1),
		href: z.url().optional(),
	})
	.superRefine((b, ctx) => {
		if (b.href && b.visibility !== 'public') {
			ctx.addIssue({ code: 'custom', path: ['href'], message: 'only public work may link out' });
		}
	});
export type BenchItem = z.infer<typeof BenchItem>;

export const PlannedItem = z.object({
	slug: z.string().regex(/^[a-z0-9-]+$/),
	title: z.string(),
	oneLiner: z.string().max(220),
	stack: z.array(z.string()).min(1),
});
export type PlannedItem = z.infer<typeof PlannedItem>;

// Required H2 sequence for case-study bodies (checked by validate-content + tests).
export const CASE_STUDY_SECTIONS = ['Problem', 'Approach', 'Architecture', 'Results', 'What’s next'] as const;
