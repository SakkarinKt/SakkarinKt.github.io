import type { Metadata } from 'next';
import { Section } from '@/components/notebook/Section';
import { BenchList } from '@/components/projects/BenchList';
import { LeadProject } from '@/components/projects/LeadProject';
import { PlannedList } from '@/components/projects/PlannedList';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { getCaseStudies } from '@/lib/content/load';

export const metadata: Metadata = {
	title: 'Work',
	description: 'Case studies, lab-bench experiments, and planned work, each labelled with how strong its evidence actually is.',
	alternates: { canonical: '/projects/' },
	openGraph: { url: '/projects/', images: [{ url: '/og/projects.png', width: 1200, height: 630 }] },
};

export default function WorkPage() {
	const studies = getCaseStudies();
	const lead = studies.find((s) => s.data.tier === 'lead')!;
	const others = studies.filter((s) => s !== lead);
	return (
		<div className="mx-auto max-w-6xl space-y-24 px-4 pt-12 sm:px-6 sm:pt-16">
			<header className="max-w-3xl space-y-4">
				<p className="kicker">work · evidence-labelled</p>
				<h1 className="font-display text-5xl font-semibold tracking-tight">Work</h1>
				<p className="text-xl leading-snug text-muted">
					Three tiers. <strong className="text-ink">Case studies</strong> are public repos you can check.{' '}
					<strong className="text-ink">Lab bench</strong> items are real code that’s smaller, local-only, or
					not measured yet. <strong className="text-ink">Up next</strong> is planned work, marked as such.
				</p>
			</header>

			<Section id="case-studies" index="A" title="Case studies">
				<div className="space-y-6">
					<LeadProject project={lead} />
					<div className="grid gap-6 md:grid-cols-2">
						{others.map((p) => (
							<ProjectCard key={p.slug} project={p} />
						))}
					</div>
				</div>
			</Section>

			<Section id="lab-bench" index="B" title="Lab bench" kicker="Local-only repos don’t get links, so their numbers stay one-liners with caveats rather than headline claims.">
				<BenchList />
			</Section>

			<Section id="up-next" index="C" title="Up next">
				<PlannedList />
			</Section>
		</div>
	);
}
