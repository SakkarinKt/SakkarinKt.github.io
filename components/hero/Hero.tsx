import Link from 'next/link';
import { profile } from '@/content/data/profile';
import { Kbd } from '@/components/notebook/Kbd';
import { GridworldDemo } from './GridworldDemo';
import { GridworldStatic } from './GridworldStatic';
import { Greeting } from './Greeting';

export function Hero({ resume }: { resume: boolean }) {
	return (
		<section id="top" aria-labelledby="hero-title" className="grid gap-12 pt-10 sm:pt-16 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:gap-14">
			<div className="space-y-6">
				<p className="kicker">
					{profile.role} · {profile.location} · {profile.timezone}
				</p>
				<div>
					<p className="font-display text-3xl font-semibold sm:text-4xl" aria-hidden>
						<Greeting words={profile.greeting} />
					</p>
					<h1 id="hero-title" className="font-display text-5xl leading-[1.02] font-semibold tracking-tight sm:text-6xl">
						I’m {profile.shortName}.
					</h1>
				</div>
				<p className="max-w-xl text-xl leading-snug text-ink sm:text-2xl">{profile.headline}</p>
				<p className="max-w-xl leading-relaxed text-muted">{profile.subhead}</p>
				<p className="inline-flex items-center gap-2 rounded-full border border-teal/40 bg-teal/5 px-3 py-1 text-sm text-teal">
					<span className="size-2 rounded-full bg-teal" aria-hidden />
					{profile.availability}
				</p>
				<div className="flex flex-wrap items-center gap-3 pt-1">
					<Link href="/projects/" className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper transition-transform hover:-translate-y-0.5">
						See the work →
					</Link>
					<Link href="/#contact" className="rounded-full border border-rule px-5 py-2.5 text-sm font-medium transition-colors hover:border-ink/40">
						Get in touch
					</Link>
					{resume && (
						<a href="/resume.pdf" className="rounded-full border border-rule px-5 py-2.5 text-sm font-medium transition-colors hover:border-ink/40">
							Résumé (PDF)
						</a>
					)}
					<span className="hidden text-sm text-muted [@media(pointer:fine)]:inline">
						or press <Kbd>⌘</Kbd> <Kbd>K</Kbd>
					</span>
				</div>
			</div>
			<div id="fig-1" className="scroll-mt-24">
				<GridworldDemo>
					<GridworldStatic />
				</GridworldDemo>
			</div>
		</section>
	);
}
