export type RGB = [number, number, number];

/** Map t ∈ [0,1] across a 3-stop gradient. */
export function lerp3(stops: [RGB, RGB, RGB], t: number): RGB {
	const x = Math.min(1, Math.max(0, t));
	const [a, b] = x < 0.5 ? [stops[0], stops[1]] : [stops[1], stops[2]];
	const u = x < 0.5 ? x * 2 : (x - 0.5) * 2;
	return [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u];
}

/**
 * Map V(s) to [0,1] for display. Only positive value counts as heat: it means "the goal is
 * reachable from here". Unvisited cells (Q = 0) and step-cost-only cells stay cold, so the
 * heat visibly spreads backwards from the goal as the agent learns.
 */
export function normalizeValues(v: Float32Array, walls: Uint8Array): Float32Array {
	const out = new Float32Array(v.length);
	for (let i = 0; i < v.length; i++) out[i] = walls[i] ? 0 : Math.pow(Math.min(1, Math.max(0, v[i]!)), 0.6);
	return out;
}
