import { DIAGRAMS, type DiagramName } from './specs';
import { edgePath, nodeBox } from './layout';
import type { Tone } from './types';

const STROKE: Record<Tone, string> = {
	ink: 'var(--ink)',
	accent: 'var(--accent)',
	teal: 'var(--teal)',
	amber: 'var(--amber)',
	muted: 'var(--muted)',
};

/** Spec-driven, theme-aware inline SVG. Rendered on the server; zero client JS. */
export function Diagram({ name, caption, n = 1 }: { name: DiagramName; caption?: string; n?: number }) {
	const spec = DIAGRAMS[name];
	const byId = new Map(spec.nodes.map((node) => [node.id, node]));
	const markerId = `arrow-${name}`;
	const titleId = `diagram-${name}-title`;
	const descId = `diagram-${name}-desc`;

	return (
		<figure className="not-prose my-8 space-y-3">
			<div className="card overflow-x-auto p-3 sm:p-4">
				<svg
					viewBox={`0 0 ${spec.width} ${spec.height}`}
					className="h-auto w-full min-w-[640px]"
					role="img"
					aria-labelledby={`${titleId} ${descId}`}
				>
					<title id={titleId}>{spec.title}</title>
					<desc id={descId}>{spec.description}</desc>
					<defs>
						<marker id={markerId} viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
							<path d="M0,0 L10,5 L0,10 z" style={{ fill: 'var(--muted)' }} />
						</marker>
					</defs>

					{spec.groups?.map((g) => (
						<g key={g.label}>
							<rect x={g.x} y={g.y} width={g.w} height={g.h} rx="14" style={{ fill: 'none', stroke: 'var(--rule)' }} strokeDasharray="4 5" />
							<text x={g.x + 14} y={g.y + 18} style={{ fill: 'var(--muted)' }} className="font-mono" fontSize="10.5" letterSpacing="0.08em">
								{g.label.toUpperCase()}
							</text>
						</g>
					))}

					{spec.edges.map((e) => {
						const a = byId.get(e.from);
						const b = byId.get(e.to);
						if (!a || !b) throw new Error(`Diagram "${name}": unknown node in edge ${e.from} → ${e.to}`);
						const { d, lx, ly } = edgePath(a, b, e.bend);
						const w = e.label ? e.label.length * 6.3 + 12 : 0;
						return (
							<g key={`${e.from}-${e.to}`}>
								<path d={d} fill="none" style={{ stroke: 'var(--muted)' }} strokeWidth="1.3" strokeDasharray={e.dashed ? '4 4' : undefined} markerEnd={`url(#${markerId})`} />
								{e.label && (
									<g>
										<rect x={lx - w / 2} y={ly - 9} width={w} height="18" rx="9" style={{ fill: 'var(--paper)', stroke: 'var(--rule)' }} />
										<text x={lx} y={ly + 3.6} textAnchor="middle" style={{ fill: 'var(--muted)' }} className="font-mono" fontSize="10">
											{e.label}
										</text>
									</g>
								)}
							</g>
						);
					})}

					{spec.nodes.map((node) => {
						const { cx, cy, w, h } = nodeBox(node);
						const tone = STROKE[node.tone ?? 'ink'];
						return (
							<g key={node.id}>
								<rect x={cx - w / 2} y={cy - h / 2} width={w} height={h} rx="11" style={{ fill: 'var(--raised)', stroke: tone }} strokeWidth={node.tone ? 1.6 : 1} />
								<text x={cx} y={node.sub ? cy - 4 : cy + 4.5} textAnchor="middle" style={{ fill: 'var(--ink)' }} fontSize="13.5" fontWeight="600">
									{node.label}
								</text>
								{node.sub && (
									<text x={cx} y={cy + 14} textAnchor="middle" style={{ fill: 'var(--muted)' }} className="font-mono" fontSize="10">
										{node.sub}
									</text>
								)}
							</g>
						);
					})}
				</svg>
			</div>
			{caption && (
				<figcaption className="font-mono text-xs text-muted">
					<span className="text-ink">fig. {n}</span> — {caption}
				</figcaption>
			)}
		</figure>
	);
}
