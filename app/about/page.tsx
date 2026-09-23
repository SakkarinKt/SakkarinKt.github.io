import type { Metadata } from 'next';
import Link from 'next/link';
import { Section } from '@/components/notebook/Section';
import { beyond } from '@/content/data/beyond';
import { education } from '@/content/data/education';
import { experience } from '@/content/data/experience';
import { profile } from '@/content/data/profile';
import { skills } from '@/content/data/skills';
import { values } from '@/content/data/values';

export const metadata: Metadata = {
	title: 'About',
	description: 'From actuarial science in Thailand to reinforcement learning in Taiwan to AI engineering: the story, the experience, and the stack.',
	alternates: { canonical: '/about/' },
	openGraph: { url: '/about/', images: [{ url: '/og/about.png', width: 1200, height: 630 }] },
};

const path = [
	{ year: '2017', place: 'Mahidol University · TH', step: 'Actuarial science', note: 'Learned to price risk and distrust a single number.' },
	{ year: '2020', place: 'Tri Petch IT · TH', step: 'Data analyst', note: 'Built a predictive model to target Isuzu marketing campaigns.' },
	{ year: '2020 – 2024', place: 'NTHU · TW', step: 'MSc, RL research', note: 'Moved to Taiwan. Inverse RL for autonomous driving.' },
	{ year: 'since 2023', place: 'SystemWeb · TW', step: 'Software developer', note: 'Fund-administration software in C#: portfolio management, now transfer agency.' },
	{ year: 'now', place: 'nights & weekends', step: 'AI engineering, in public', note: 'World models, RL, agentic LLM systems, co-built with Claude.' },
];

export default function AboutPage() {
	return (
		<div className="mx-auto max-w-6xl space-y-24 px-4 pt-12 sm:px-6 sm:pt-16">
			<header className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-end">
				<div className="space-y-5">
					<p className="kicker">about · {profile.location}</p>
					<h1 className="font-display text-5xl font-semibold tracking-tight">
						Applied math, turned into software you can measure.
					</h1>
					<p className="text-xl leading-snug text-muted">
						I started out pricing risk as an actuarial student in Thailand, moved to Taiwan for a master’s in
						reinforcement learning, and now build decision-making systems: RL agents, world models, and LLM
						workflows. The through-line is the same question every time: <em className="text-ink">how would we know
						if this actually worked?</em>
					</p>
				</div>
				<p className="rounded-2xl border border-teal/40 bg-teal/5 p-5 leading-relaxed text-teal">
					{profile.availability}. Taipei, {profile.timezone}. Email{' '}
					<a className="underline" href={`mailto:${profile.email}`}>
						{profile.email}
					</a>
					.
				</p>
			</header>

			<Section id="path" index="01" title="The path so far">
				<ol className="relative grid gap-6 md:grid-cols-5 md:gap-4">
					{path.map((p, i) => (
						<li key={p.year} className="card relative space-y-2 p-5">
							<p className="font-mono text-xs text-accent-ink">
								{String(i + 1).padStart(2, '0')} · {p.year}
							</p>
							<p className="font-display text-lg leading-tight font-semibold">{p.step}</p>
							<p className="font-mono text-[0.68rem] text-muted">{p.place}</p>
							<p className="text-sm leading-relaxed text-muted">{p.note}</p>
						</li>
					))}
				</ol>
			</Section>

			<Section id="experience" index="02" title="Experience">
				<div className="space-y-6">
					{experience.map((role) => (
						<article key={role.org} className="grid gap-4 border-l-2 border-accent pl-6 md:grid-cols-[12rem_1fr]">
							<div className="space-y-1">
								<p className="kicker">{role.period}</p>
								<h3 className="font-display text-xl font-semibold">{role.org}</h3>
								<p className="text-muted">{role.title}</p>
							</div>
							<ul className="space-y-2 leading-relaxed">
								{role.points.map((p) => (
									<li key={p}>{p}</li>
								))}
							</ul>
						</article>
					))}
				</div>
			</Section>

			<Section id="education" index="03" title="Education">
				<div className="grid gap-6 md:grid-cols-2">
					{education.map((d) => (
						<article key={d.school} className="card space-y-2 p-6">
							<p className="kicker">{d.year}</p>
							<h3 className="font-display text-xl font-semibold">{d.degree}</h3>
							<p className="font-mono text-xs text-muted">{d.school}</p>
							<p className="leading-relaxed text-muted">{d.note}</p>
						</article>
					))}
				</div>
			</Section>

			<Section id="skills" index="04" title="Skills" kicker="Only what my repos or day job actually show. Links are on the work page.">
				<div className="grid gap-x-10 gap-y-8 md:grid-cols-2">
					{skills.map((group) => (
						<div key={group.category} className="space-y-3">
							<h3 className="kicker">{group.category}</h3>
							<ul className="flex flex-wrap gap-2">
								{group.items.map((item) => (
									<li key={item} className="rounded-full border border-rule bg-raised px-3 py-1 text-sm">
										{item}
									</li>
								))}
							</ul>
						</div>
					))}
				</div>
			</Section>

			<Section id="values" index="05" title="How I work">
				<div className="grid gap-6 md:grid-cols-2">
					{values.map((v) => (
						<div key={v.label} className="card space-y-2 p-6">
							<h3 className="font-display text-xl font-semibold">{v.label}</h3>
							<p className="leading-relaxed text-muted">{v.body}</p>
						</div>
					))}
				</div>
			</Section>

			<Section id="beyond" index="06" title="Off the keyboard">
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
				<p className="mt-10 text-muted">
					Want the short version? <Link className="link" href="/#contact">Say hi</Link>. English or ภาษาไทย.
				</p>
			</Section>
		</div>
	);
}
