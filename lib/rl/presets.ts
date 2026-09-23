import type { GridSpec } from './gridworld';

export const GRID_W = 12;
export const GRID_H = 8;

function spec(wallCells: Array<[number, number]>, start: [number, number], goal: [number, number]): GridSpec {
	const walls = new Uint8Array(GRID_W * GRID_H);
	for (const [x, y] of wallCells) walls[y * GRID_W + x] = 1;
	return { w: GRID_W, h: GRID_H, start: start[1] * GRID_W + start[0], goal: goal[1] * GRID_W + goal[0], walls };
}

function column(x: number, from: number, to: number): Array<[number, number]> {
	const out: Array<[number, number]> = [];
	for (let y = from; y <= to; y++) out.push([x, y]);
	return out;
}

/** The S-maze from fig. 1: start bottom-left, goal top-right. */
export function sMaze(): GridSpec {
	return spec([...column(4, 2, 7), ...column(8, 0, 5)], [0, 7], [11, 0]);
}

/** Alternates used by the palette's "poke the gridworld" action. */
export const PRESETS: Array<() => GridSpec> = [
	sMaze,
	() => spec([...column(3, 1, 7), ...column(6, 0, 6), ...column(9, 1, 7)], [0, 7], [11, 0]),
	() =>
		spec(
			[
				[2, 2], [3, 2], [4, 2], [5, 2], [6, 2], [7, 2], [8, 2], [9, 2],
				[2, 5], [3, 5], [4, 5], [5, 5], [6, 5], [7, 5], [8, 5], [9, 5],
				[9, 3], [2, 4],
			],
			[0, 7],
			[6, 4],
		),
];
