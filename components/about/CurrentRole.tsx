import { current } from '@/content/data/experience';
import { StatusChip } from '@/components/notebook/Chips';

/** The current role, led with measurable outcomes. Used on the home page and on /about/. */
export function CurrentRole() {
	return (
		<article className="card space-y-7 p-6 sm:p-8">
			<header className="flex flex-wrap items-start justify-between gap-4">
				<div className="space-y-1">
					<p className="kicker">
						{current.period} · {current.place}
					</p>
					<h3 className="font-display text-2xl font-semibold tracking-tight">{current.org}</h3>
					<p className="text-muted">{current.title}</p>
				</div>
				<StatusChip status="active" />
			</header>

			<p className="max-w-3xl text-lg leading-snug">{current.lede}</p>

			<dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-rule bg-rule md:grid-cols-4">
				{current.stats.map((s) => (
					<div key={s.label} className="flex flex-col-reverse justify-end gap-1 bg-raised p-4">
						<dt className="font-mono text-[0.7rem] leading-snug text-muted">{s.label}</dt>
						<dd className="font-display text-2xl font-semibold tracking-tight">{s.value}</dd>
					</div>
				))}
			</dl>

			<ul className="space-y-3 leading-relaxed">
				{current.points.map((p) => (
					<li key={p} className="flex gap-3">
						<span className="mt-[0.6em] size-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
						<span>{p}</span>
					</li>
				))}
			</ul>

			<p className="font-mono text-[0.7rem] text-muted">{current.stack.join(' · ')}</p>
		</article>
	);
}
