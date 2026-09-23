import Link from 'next/link';
import type { Doc } from '@/lib/content/load';
import type { CaseStudy } from '@/lib/content/schema';
import { EvidenceChip, StatusChip } from '@/components/notebook/Chips';
import { MetricGrid } from './MetricGrid';

export function LeadProject({ project }: { project: Doc<CaseStudy> }) {
	const { data, slug } = project;
	const repo = data.links.find((l) => l.kind === 'repo');
	return (
		<article className="card grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.1fr_1fr]">
			<div className="space-y-5">
				<div className="flex flex-wrap gap-2">
					<StatusChip status={data.status} />
					<EvidenceChip evidence={data.evidence} />
				</div>
				<h3 className="font-display text-3xl font-semibold tracking-tight">
					<Link href={`/projects/${slug}/`} className="hover:text-accent-ink">
						{data.title}
					</Link>
				</h3>
				<p className="text-lg leading-snug">{data.tagline}</p>
				<p className="leading-relaxed text-muted">{data.tldr}</p>
				<div className="flex flex-wrap gap-3 pt-1">
					<Link href={`/projects/${slug}/`} className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper">
						Read the case study →
					</Link>
					{repo && (
						<a href={repo.href} target="_blank" rel="noopener" className="rounded-full border border-rule px-4 py-2 text-sm font-medium hover:border-ink/40">
							Repository ↗
						</a>
					)}
				</div>
			</div>
			<div className="space-y-4">
				<MetricGrid metrics={data.metrics} />
				<p className="font-mono text-[0.7rem] text-muted">
					{data.stack.join(' · ')}
				</p>
			</div>
		</article>
	);
}
