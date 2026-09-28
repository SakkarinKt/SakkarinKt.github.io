import { earlier } from '@/content/data/experience';

/** 2017–2020 in Bangkok: compact, most recent first, client names up front. */
export function EarlierRoles() {
	return (
		<div className="grid gap-8 lg:grid-cols-[18rem_1fr]">
			<div className="space-y-3">
				<p className="kicker">2017 — 2020 · Bangkok</p>
				<h3 className="font-display text-2xl font-semibold tracking-tight">Data engineering, mostly on-site with clients</h3>
				<p className="leading-relaxed text-muted">
					Before AI engineering I spent three years embedded with other people’s data: a Canadian bank’s Hadoop
					cluster, Thailand’s largest mobile operator, a real-estate developer’s move to AWS, Isuzu’s campaigns.
					That’s where I learned the forward-deployed basics: listen first, and assume the data is never quite
					where the slide deck says it is.
				</p>
			</div>
			<ol className="relative space-y-6 border-l border-rule pl-6">
				{earlier.map((role) => (
					<li key={`${role.org}-${role.period}`} className="relative">
						<span className="absolute top-2 -left-[1.72rem] size-2.5 rounded-full border-2 border-paper bg-accent" aria-hidden />
						<p className="font-mono text-xs text-muted">{role.period}</p>
						<p className="mt-1 font-medium">
							{role.title} <span className="text-muted">·</span> {role.org}
							{role.client && (
								<span className="ml-2 inline-block rounded-full border border-teal/40 px-2 py-px align-middle font-mono text-[0.65rem] text-teal">
									for {role.client}
								</span>
							)}
						</p>
						{role.points.map((p) => (
							<p key={p} className="mt-1 leading-relaxed text-muted">
								{p}
							</p>
						))}
						{role.stack && <p className="mt-1 font-mono text-[0.68rem] text-muted">{role.stack.join(' · ')}</p>}
					</li>
				))}
			</ol>
		</div>
	);
}
