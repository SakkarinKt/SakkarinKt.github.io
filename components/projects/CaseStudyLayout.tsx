import Link from 'next/link';
import type { ReactNode } from 'react';
import type { Doc } from '@/lib/content/load';
import type { CaseStudy } from '@/lib/content/schema';
import type { Heading } from '@/lib/content/headings';
import { formatDate, formatPeriod } from '@/lib/content/dates';
import { EvidenceChip, StatusChip } from '@/components/notebook/Chips';
import { MetricGrid } from './MetricGrid';

export function CaseStudyLayout({ project, headings, children }: { project: Doc<CaseStudy>; headings: Heading[]; children: ReactNode }) {
	const { data } = project;
	return (
		<article className="mx-auto max-w-6xl px-4 pt-10 sm:px-6 sm:pt-14">
			<nav aria-label="Breadcrumb" className="mb-8 font-mono text-xs text-muted">
				<Link href="/projects/" className="hover:text-ink">
					work
				</Link>{' '}
				/ {project.slug}
			</nav>

			<header className="grid gap-8 border-b border-rule pb-10 lg:grid-cols-[1.4fr_1fr]">
				<div className="space-y-5">
					<p className="kicker">{data.tier === 'lead' ? 'lead case study' : 'case study'}</p>
					<h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">{data.title}</h1>
					<p className="max-w-2xl text-xl leading-snug">{data.tagline}</p>
					<div className="flex flex-wrap gap-2">
						<StatusChip status={data.status} />
						<EvidenceChip evidence={data.evidence} />
					</div>
				</div>
				<dl className="grid content-start gap-x-6 gap-y-3 text-sm sm:grid-cols-[auto_1fr]">
					<dt className="kicker pt-0.5">period</dt>
					<dd>{formatPeriod(data.period)}</dd>
					<dt className="kicker pt-0.5">status as of</dt>
					<dd>{formatDate(data.asOf)}</dd>
					{data.size && (
						<>
							<dt className="kicker pt-0.5">size</dt>
							<dd>
								{data.size.loc} · {data.size.tests}
							</dd>
						</>
					)}
					<dt className="kicker pt-0.5">stack</dt>
					<dd className="text-muted">{data.stack.join(' · ')}</dd>
					{data.links.length > 0 && (
						<>
							<dt className="kicker pt-0.5">links</dt>
							<dd className="flex flex-wrap gap-x-4 gap-y-1">
								{data.links.map((l) => (
									<a key={l.href} href={l.href} target="_blank" rel="noopener" className="link">
										{l.label} ↗
									</a>
								))}
							</dd>
						</>
					)}
				</dl>
			</header>

			<section aria-labelledby="tldr" className="mt-10 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
				<div className="rounded-2xl border-l-4 border-accent bg-surface/70 p-6">
					<p id="tldr" className="kicker mb-2">
						tl;dr
					</p>
					<p className="text-lg leading-relaxed">{data.tldr}</p>
				</div>
				<MetricGrid metrics={data.metrics} />
			</section>

			<div className="mt-14 grid gap-12 lg:grid-cols-[1fr_14rem]">
				<div className="prose prose-lg min-w-0 lg:order-1">{children}</div>
				<aside className="lg:order-2">
					<nav aria-label="On this page" className="sticky top-24 space-y-2 font-mono text-xs">
						<p className="kicker">on this page</p>
						<ul className="space-y-1.5 border-l border-rule">
							{headings
								.filter((h) => h.depth === 2)
								.map((h) => (
									<li key={h.id}>
										<a href={`#${h.id}`} className="-ml-px block border-l border-transparent pl-3 text-muted hover:border-accent hover:text-ink">
											{h.text}
										</a>
									</li>
								))}
						</ul>
					</nav>
				</aside>
			</div>
		</article>
	);
}
