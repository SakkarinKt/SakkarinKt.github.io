import Link from 'next/link';
import type { Doc } from '@/lib/content/load';
import type { CaseStudy } from '@/lib/content/schema';
import { EvidenceChip, StatusChip } from '@/components/notebook/Chips';

export function ProjectCard({ project }: { project: Doc<CaseStudy> }) {
	const { data, slug } = project;
	return (
		<article className="card group relative flex flex-col gap-4 p-6 transition-colors hover:border-ink/25">
			<div className="flex flex-wrap gap-2">
				<StatusChip status={data.status} />
				<EvidenceChip evidence={data.evidence} />
			</div>
			<h3 className="font-display text-2xl font-semibold tracking-tight">
				<Link href={`/projects/${slug}/`} className="after:absolute after:inset-0 group-hover:text-accent-ink">
					{data.title}
				</Link>
			</h3>
			<p className="leading-relaxed text-muted">{data.tagline}</p>
			<p className="mt-auto font-mono text-[0.7rem] text-muted">{data.stack.slice(0, 4).join(' · ')}</p>
		</article>
	);
}
