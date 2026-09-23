import { planned } from '@/content/data/planned';
import { StatusChip } from '@/components/notebook/Chips';

export function PlannedList() {
	return (
		<ul className="grid gap-4 md:grid-cols-2">
			{planned.map((p) => (
				<li key={p.slug} id={p.slug} className="scroll-mt-24 space-y-3 rounded-2xl border border-dashed border-rule p-5">
					<div className="flex items-center justify-between gap-3">
						<h3 className="font-mono text-sm font-semibold">{p.title}</h3>
						<StatusChip status="planned" />
					</div>
					<p className="leading-relaxed text-muted">{p.oneLiner}</p>
					<p className="font-mono text-[0.68rem] text-muted">{p.stack.join(' · ')}</p>
				</li>
			))}
		</ul>
	);
}
