import Link from 'next/link';
import { Hero } from '@/components/hero/Hero';
import { Section } from '@/components/notebook/Section';
import { BenchList } from '@/components/projects/BenchList';
import { LeadProject } from '@/components/projects/LeadProject';
import { PlannedList } from '@/components/projects/PlannedList';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { beyond } from '@/content/data/beyond';
import { experience } from '@/content/data/experience';
import { now } from '@/content/data/now';
import { profile } from '@/content/data/profile';
import { values } from '@/content/data/values';
import { formatDate } from '@/lib/content/dates';
import { getCaseStudies, getListedPosts } from '@/lib/content/load';
import { hasResume } from '@/lib/palette/items';
import { SITE_URL } from '@/lib/site';

export default function Home() {
	const studies = getCaseStudies();
	const lead = studies.find((s) => s.data.tier === 'lead')!;
	const others = studies.filter((s) => s !== lead);
	const posts = getListedPosts().slice(0, 3);
	const dayJob = experience[0]!;

	const personLd = {
		'@context': 'https://schema.org',
		'@type': 'Person',
		name: profile.name,
		jobTitle: profile.role,
		url: SITE_URL,
		email: `mailto:${profile.email}`,
		address: { '@type': 'PostalAddress', addressLocality: 'Taipei', addressCountry: 'TW' },
		sameAs: [profile.github, profile.linkedin],
		knowsAbout: ['Reinforcement learning', 'World models', 'LLM agents', 'Machine learning engineering'],
	};

	return (
		<div className="mx-auto max-w-6xl space-y-28 px-4 sm:px-6">
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }} />
			<Hero resume={hasResume()} />

			<Section
				id="now"
				index="01"
				title="Now"
				kicker="What’s on the bench this month."
				aside={<p className="font-mono text-xs text-muted">updated {formatDate(now.asOf)}</p>}
			>
				<dl className="grid gap-px overflow-hidden rounded-2xl border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-4">
					{now.items.map((item) => (
						<div key={item.label} className="space-y-2 bg-raised p-5">
							<dt className="kicker">{item.label}</dt>
							<dd className="leading-relaxed">{item.body}</dd>
						</div>
					))}
				</dl>
			</Section>

			<Section
				id="projects"
				index="02"
				title="Selected work"
				kicker="Public repos only, so you can check the numbers. Every metric shows its n, and every case study has a box listing what the numbers don’t show."
				aside={
					<Link href="/projects/" className="link text-sm">
						all work →
					</Link>
				}
			>
				<div className="space-y-6">
					<LeadProject project={lead} />
					<div className="grid gap-6 md:grid-cols-2">
						{others.map((p) => (
							<ProjectCard key={p.slug} project={p} />
						))}
						<article className="flex flex-col justify-center gap-3 rounded-2xl border border-dashed border-rule p-6 text-muted">
							<p className="kicker">fig. 1, again</p>
							<p className="leading-relaxed">
								The gridworld up top is a tiny version of the same idea: an agent, a reward, and a number you can
								check against the optimum. Draw a wall and watch it re-learn.
							</p>
							<a href="#fig-1" className="link text-sm">
								back to the demo ↑
							</a>
						</article>
					</div>
				</div>
			</Section>

			<Section
				id="lab-bench"
				index="03"
				title="Lab bench"
				kicker="Smaller and local-only experiments. One line each, with the evidence level shown, not hidden."
			>
				<BenchList />
			</Section>

			<Section id="up-next" index="04" title="Up next" kicker="Planned, not built. Listed so nobody mistakes a target for a result.">
				<PlannedList />
			</Section>

			<Section id="how-i-work" index="05" title="How I work">
				<div className="grid gap-6 md:grid-cols-2">
					{values.map((v) => (
						<div key={v.label} className="card space-y-2 p-6">
							<h3 className="font-display text-xl font-semibold">{v.label}</h3>
							<p className="leading-relaxed text-muted">{v.body}</p>
						</div>
					))}
				</div>
			</Section>

			<Section id="day-job" index="06" title="Day job" kicker="Production software for regulated finance: where the testing habits come from.">
				<div className="card grid gap-6 p-6 sm:p-8 md:grid-cols-[14rem_1fr]">
					<div className="space-y-1">
						<p className="kicker">{dayJob.period}</p>
						<p className="font-display text-xl font-semibold">{dayJob.org}</p>
						<p className="text-muted">{dayJob.title}</p>
					</div>
					<ul className="space-y-2 leading-relaxed">
						{dayJob.points.map((p) => (
							<li key={p} className="flex gap-3">
								<span className="mt-[0.6em] size-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
								{p}
							</li>
						))}
					</ul>
				</div>
			</Section>

			<Section
				id="writing"
				index="07"
				title="Writing"
				aside={
					<Link href="/blog/" className="link text-sm">
						all posts →
					</Link>
				}
			>
				<ul className="divide-y divide-rule border-y border-rule">
					{posts.map((post) => (
						<li key={post.slug}>
							<Link href={`/blog/${post.slug}/`} className="group grid gap-1 py-5 sm:grid-cols-[8rem_1fr] sm:gap-6">
								<span className="font-mono text-xs text-muted sm:pt-1.5">{formatDate(post.data.pubDate)}</span>
								<span className="space-y-1">
									<span className="block font-display text-xl font-semibold group-hover:text-accent-ink">{post.data.title}</span>
									<span className="block text-muted">{post.data.description}</span>
								</span>
							</Link>
						</li>
					))}
				</ul>
			</Section>

			<Section id="off-the-keyboard" index="08" title="Off the keyboard">
				<div className="grid gap-6 md:grid-cols-3">
					{beyond.map((b) => (
						<div key={b.title} className="card space-y-2 p-6">
							<p className="text-2xl" aria-hidden>
								{b.emoji}
							</p>
							<h3 className="font-display text-xl font-semibold">{b.title}</h3>
							<p className="leading-relaxed text-muted">{b.body}</p>
						</div>
					))}
				</div>
			</Section>

			<Section id="contact" index="09" title="Let’s talk" kicker={`${profile.availability}. Based in Taipei (${profile.timezone}).`}>
				<div className="card flex flex-col gap-6 p-6 sm:p-8 md:flex-row md:items-center md:justify-between">
					<a href={`mailto:${profile.email}`} className="font-display text-2xl font-semibold tracking-tight break-all hover:text-accent-ink sm:text-3xl">
						{profile.email}
					</a>
					<ul className="flex flex-wrap gap-3 text-sm">
						<li>
							<a href={profile.linkedin} target="_blank" rel="me noopener" className="rounded-full border border-rule px-4 py-2 hover:border-ink/40">
								LinkedIn ↗
							</a>
						</li>
						<li>
							<a href={profile.github} target="_blank" rel="me noopener" className="rounded-full border border-rule px-4 py-2 hover:border-ink/40">
								GitHub ↗
							</a>
						</li>
					</ul>
				</div>
			</Section>
		</div>
	);
}
