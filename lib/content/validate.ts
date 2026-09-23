import { bench } from '@/content/data/bench';
import { planned } from '@/content/data/planned';
import { DIAGRAMS } from '@/components/diagram/specs';
import { extractHeadings } from './headings';
import { getCaseStudies, getPosts } from './load';
import { BenchItem, CASE_STUDY_SECTIONS, PlannedItem } from './schema';

/** Structural content rules that zod alone can't express. Returns a list of problems (empty = OK). */
export function validateContent(): string[] {
	const problems: string[] = [];
	const studies = getCaseStudies();
	const posts = getPosts({ includeDrafts: true });

	const leads = studies.filter((s) => s.data.tier === 'lead');
	if (leads.length !== 1) problems.push(`expected exactly one lead case study, found ${leads.length}`);

	for (const s of studies) {
		const h2 = extractHeadings(s.body)
			.filter((h) => h.depth === 2)
			.map((h) => h.text);
		if (h2.join('|') !== CASE_STUDY_SECTIONS.join('|')) {
			problems.push(`${s.slug}: H2 sections must be [${CASE_STUDY_SECTIONS.join(', ')}], got [${h2.join(', ')}]`);
		}
		if (!/<HonestLimits\s*\/>/.test(s.body)) problems.push(`${s.slug}: missing <HonestLimits />`);
		for (const m of s.body.matchAll(/<Diagram\s+name="([^"]+)"/g)) {
			if (!(m[1]! in DIAGRAMS)) problems.push(`${s.slug}: unknown diagram "${m[1]}"`);
		}
	}

	for (const b of bench) {
		const r = BenchItem.safeParse(b);
		if (!r.success) problems.push(`bench/${b.slug}: ${r.error.issues.map((i) => i.message).join('; ')}`);
	}
	for (const p of planned) {
		const r = PlannedItem.safeParse(p);
		if (!r.success) problems.push(`planned/${p.slug}: ${r.error.issues.map((i) => i.message).join('; ')}`);
	}

	// Anchors on /projects/ must be unique: section ids + bench + planned slugs.
	const anchors = ['case-studies', 'lab-bench', 'up-next', ...bench.map((b) => b.slug), ...planned.map((p) => p.slug)];
	const dupes = anchors.filter((a, i) => anchors.indexOf(a) !== i);
	if (dupes.length) problems.push(`duplicate anchors on /projects/: ${dupes.join(', ')}`);

	const current = new Set(posts.map((p) => p.slug));
	const legacy = posts.flatMap((p) => p.data.legacySlugs);
	for (const slug of legacy) {
		if (current.has(slug)) problems.push(`legacy slug "${slug}" collides with a current post slug`);
	}
	if (new Set(legacy).size !== legacy.length) problems.push('legacy slugs must be unique');

	return problems;
}
