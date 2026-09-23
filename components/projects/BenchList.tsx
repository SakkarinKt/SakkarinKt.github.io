import { bench } from '@/content/data/bench';
import { Chip, EvidenceChip } from '@/components/notebook/Chips';

export function BenchList() {
	return (
		<ul className="divide-y divide-rule border-y border-rule">
			{bench.map((b) => (
				<li key={b.slug} id={b.slug} className="grid scroll-mt-24 gap-3 py-5 md:grid-cols-[14rem_1fr] md:gap-8">
					<div className="space-y-2">
						<h3 className="font-mono text-sm font-semibold">{b.title}</h3>
						<p className="font-mono text-[0.68rem] text-muted">{b.stack.join(' · ')}</p>
					</div>
					<div className="space-y-3">
						<p className="leading-relaxed">{b.oneLiner}</p>
						<div className="flex flex-wrap gap-2">
							<EvidenceChip evidence={b.evidence} />
							{b.chips.map((c) => (
								<Chip key={c}>{c}</Chip>
							))}
						</div>
					</div>
				</li>
			))}
		</ul>
	);
}
