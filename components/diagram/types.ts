export type Tone = 'ink' | 'accent' | 'teal' | 'amber' | 'muted';

export interface DNode {
	id: string;
	label: string;
	sub?: string;
	x: number;
	y: number;
	w?: number;
	tone?: Tone;
}

export interface DEdge {
	from: string;
	to: string;
	label?: string;
	dashed?: boolean;
	/** Perpendicular offset of the curve's control point, in viewBox units. */
	bend?: number;
}

export interface DGroup {
	label: string;
	x: number;
	y: number;
	w: number;
	h: number;
}

export interface DiagramSpec {
	title: string;
	description: string;
	width: number;
	height: number;
	nodes: DNode[];
	edges: DEdge[];
	groups?: DGroup[];
}
