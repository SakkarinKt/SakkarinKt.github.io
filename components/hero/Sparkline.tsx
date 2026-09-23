/** fig. 1b — steps per episode over the last 100 episodes, with the BFS optimum as a reference line. */
export function Sparkline({ values, optimal }: { values: number[]; optimal: number | null }) {
	const W = 160;
	const H = 36;
	const max = Math.max(60, ...values);
	const y = (v: number) => H - 2 - ((H - 4) * Math.min(v, max)) / max;
	const pts = values.map((v, i) => `${(i / Math.max(1, values.length - 1)) * W},${y(v)}`).join(' ');
	return (
		<figure className="flex items-center gap-2" aria-label="Steps per episode, last 100 episodes">
			<svg viewBox={`0 0 ${W} ${H}`} className="h-9 w-40" aria-hidden>
				{optimal !== null && (
					<line x1="0" x2={W} y1={y(optimal)} y2={y(optimal)} style={{ stroke: 'var(--teal)' }} strokeDasharray="3 3" strokeWidth="1" />
				)}
				{values.length > 1 && <polyline points={pts} fill="none" style={{ stroke: 'var(--accent)' }} strokeWidth="1.4" strokeLinejoin="round" />}
			</svg>
			<figcaption className="font-mono text-[0.65rem] leading-tight text-muted">
				fig. 1b
				<br />
				steps / episode
			</figcaption>
		</figure>
	);
}
