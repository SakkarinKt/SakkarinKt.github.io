import type { Metric } from '@/lib/content/schema';

export function MetricGrid({ metrics }: { metrics: Metric[] }) {
	if (!metrics.length) return null;
	return (
		<dl className="grid gap-px overflow-hidden rounded-xl border border-rule bg-rule sm:grid-cols-2">
			{metrics.map((m) => (
				<div key={m.label} className="flex flex-col gap-1 bg-raised p-4">
					<dt className="kicker">{m.label}</dt>
					<dd className="font-display text-2xl font-semibold tracking-tight">{m.value}</dd>
					<dd className="font-mono text-[0.7rem] text-muted">
						n = {m.n}
						{m.baseline && <> · vs {m.baseline}</>}
						{m.caveat && <> · {m.caveat}</>}
					</dd>
				</div>
			))}
		</dl>
	);
}
