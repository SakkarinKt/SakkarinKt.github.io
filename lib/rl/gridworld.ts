/** Actions: 0..3 = N, E, S, W. Cells are indexed y * w + x. */
export const ACTIONS = [
	[0, -1],
	[1, 0],
	[0, 1],
	[-1, 0],
] as const;
export const N_ACTIONS = 4;

export interface GridSpec {
	w: number;
	h: number;
	start: number;
	goal: number;
	walls: Uint8Array;
}

export interface Rewards {
	step: number;
	bump: number;
	goal: number;
}

export interface StepResult {
	s: number;
	r: number;
	done: boolean;
	bumped: boolean;
}

export const DEFAULT_REWARDS: Rewards = { step: -0.01, bump: -0.05, goal: 1 };

export class GridWorld {
	readonly w: number;
	readonly h: number;
	readonly walls: Uint8Array;
	start: number;
	goal: number;
	state: number;
	t = 0;

	constructor(
		spec: GridSpec,
		readonly rewards: Rewards = DEFAULT_REWARDS,
		readonly maxSteps = 300,
	) {
		this.w = spec.w;
		this.h = spec.h;
		this.walls = spec.walls.slice();
		this.start = spec.start;
		this.goal = spec.goal;
		this.state = spec.start;
	}

	get size(): number {
		return this.w * this.h;
	}

	xy(c: number): [number, number] {
		return [c % this.w, Math.floor(c / this.w)];
	}

	cell(x: number, y: number): number {
		return y * this.w + x;
	}

	reset(): number {
		this.state = this.start;
		this.t = 0;
		return this.state;
	}

	/** Next cell for an action from `c`, or -1 when it would leave the grid or hit a wall. */
	neighbor(c: number, a: number): number {
		const [x, y] = this.xy(c);
		const [dx, dy] = ACTIONS[a]!;
		const nx = x + dx;
		const ny = y + dy;
		if (nx < 0 || ny < 0 || nx >= this.w || ny >= this.h) return -1;
		const n = this.cell(nx, ny);
		return this.walls[n] ? -1 : n;
	}

	step(a: number): StepResult {
		this.t++;
		const n = this.neighbor(this.state, a);
		const bumped = n === -1;
		if (!bumped) this.state = n;
		if (this.state === this.goal) return { s: this.state, r: this.rewards.goal, done: true, bumped };
		const r = bumped ? this.rewards.bump : this.rewards.step;
		return { s: this.state, r, done: this.t >= this.maxSteps, bumped };
	}

	/** Toggle a wall. Refuses start and goal cells. Returns true if the grid changed. */
	toggleWall(c: number): boolean {
		if (c === this.start || c === this.goal || c < 0 || c >= this.size) return false;
		this.walls[c] = this.walls[c] ? 0 : 1;
		return true;
	}

	setWall(c: number, on: boolean): boolean {
		if (c === this.start || c === this.goal || c < 0 || c >= this.size) return false;
		if (Boolean(this.walls[c]) === on) return false;
		this.walls[c] = on ? 1 : 0;
		return true;
	}

	/** Move the goal. Refuses walls and the start cell. */
	setGoal(c: number): boolean {
		if (c === this.start || c < 0 || c >= this.size || this.walls[c] || c === this.goal) return false;
		this.goal = c;
		return true;
	}

	/** BFS shortest path length from start to goal, or null when unreachable. */
	shortestPath(): number | null {
		const dist = new Int32Array(this.size).fill(-1);
		const queue = [this.start];
		dist[this.start] = 0;
		for (let i = 0; i < queue.length; i++) {
			const c = queue[i]!;
			if (c === this.goal) return dist[c]!;
			for (let a = 0; a < N_ACTIONS; a++) {
				const n = this.neighbor(c, a);
				if (n !== -1 && dist[n] === -1) {
					dist[n] = dist[c]! + 1;
					queue.push(n);
				}
			}
		}
		return null;
	}
}
