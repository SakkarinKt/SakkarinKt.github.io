import { normalizeValues } from '@/lib/rl/colormap';
import { sMaze } from '@/lib/rl/presets';
import { Trainer } from '@/lib/rl/trainer';

/**
 * Server-rendered fig. 1: the same seeded agent, trained at build time, drawn as SVG.
 * It's what no-JS and reduced-motion visitors see, and what the live canvas fades in over.
 */
export function GridworldStatic() {
	const trainer = new Trainer(sMaze(), 42);
	trainer.runEpisodes(600);
	const env = trainer.env;
	const v = normalizeValues(trainer.agent.values(), env.walls);
	const path = trainer.greedyRollout(env.size) ?? [];
	const cell = 10;
	const pts = path.map((c) => {
		const [x, y] = env.xy(c);
		return `${x * cell + cell / 2},${y * cell + cell / 2}`;
	});
	const [gx, gy] = env.xy(env.goal);
	const [sx, sy] = env.xy(env.start);

	return (
		<svg viewBox={`0 0 ${env.w * cell} ${env.h * cell}`} className="block h-full w-full" aria-hidden>
			{Array.from({ length: env.size }, (_, i) => {
				const [x, y] = env.xy(i);
				if (env.walls[i]) {
					return <rect key={i} x={x * cell + 0.6} y={y * cell + 0.6} width={cell - 1.2} height={cell - 1.2} rx="1.6" style={{ fill: 'var(--wall)' }} />;
				}
				const t = v[i]!;
				const fill =
					t < 0.5
						? `color-mix(in oklab, var(--heat-1) ${Math.round(t * 200)}%, var(--heat-0))`
						: `color-mix(in oklab, var(--heat-2) ${Math.round((t - 0.5) * 200)}%, var(--heat-1))`;
				return <rect key={i} x={x * cell + 0.6} y={y * cell + 0.6} width={cell - 1.2} height={cell - 1.2} rx="1.6" style={{ fill }} />;
			})}
			<polyline points={pts.join(' ')} fill="none" style={{ stroke: 'var(--teal)' }} strokeWidth="1.1" strokeDasharray="2 1.6" strokeLinecap="round" strokeLinejoin="round" />
			<circle cx={gx * cell + cell / 2} cy={gy * cell + cell / 2} r="3.2" fill="none" style={{ stroke: 'var(--ink)' }} strokeWidth="1.3" />
			<circle cx={sx * cell + cell / 2} cy={sy * cell + cell / 2} r="2.6" style={{ fill: 'var(--teal)' }} />
		</svg>
	);
}
