import type { DNode } from './types';

export const NODE_W = 150;
export const NODE_H = 46;
export const NODE_H_SUB = 58;

export function nodeBox(n: DNode) {
	const w = n.w ?? NODE_W;
	const h = n.sub ? NODE_H_SUB : NODE_H;
	return { cx: n.x, cy: n.y, w, h };
}

/** Where the ray from the box centre towards (tx, ty) leaves the box. */
export function exitPoint(n: DNode, tx: number, ty: number, pad = 5): [number, number] {
	const { cx, cy, w, h } = nodeBox(n);
	const dx = tx - cx;
	const dy = ty - cy;
	if (dx === 0 && dy === 0) return [cx, cy];
	const sx = dx === 0 ? Infinity : (w / 2 + pad) / Math.abs(dx);
	const sy = dy === 0 ? Infinity : (h / 2 + pad) / Math.abs(dy);
	const s = Math.min(sx, sy);
	return [cx + dx * s, cy + dy * s];
}

/** Path between two nodes, optionally bent into a quadratic curve. Returns path and label anchor. */
export function edgePath(a: DNode, b: DNode, bend = 0) {
	const mx = (a.x + b.x) / 2;
	const my = (a.y + b.y) / 2;
	const len = Math.hypot(b.x - a.x, b.y - a.y) || 1;
	const nx = -(b.y - a.y) / len;
	const ny = (b.x - a.x) / len;
	const cx = mx + nx * bend;
	const cy = my + ny * bend;
	const [x1, y1] = exitPoint(a, bend ? cx : b.x, bend ? cy : b.y);
	const [x2, y2] = exitPoint(b, bend ? cx : a.x, bend ? cy : a.y);
	if (!bend) return { d: `M${x1},${y1} L${x2},${y2}`, lx: (x1 + x2) / 2, ly: (y1 + y2) / 2 };
	// Label sits on the curve's midpoint (t = 0.5 of the quadratic).
	return { d: `M${x1},${y1} Q${cx},${cy} ${x2},${y2}`, lx: 0.25 * x1 + 0.5 * cx + 0.25 * x2, ly: 0.25 * y1 + 0.5 * cy + 0.25 * y2 };
}
