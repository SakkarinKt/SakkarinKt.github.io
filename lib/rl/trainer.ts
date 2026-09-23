import { GridWorld, N_ACTIONS, type GridSpec } from './gridworld';
import { DEFAULT_Q_PARAMS, QAgent, type QParams } from './qlearning';
import { mulberry32 } from './rng';

export const HISTORY = 100;

export interface TrainerStats {
	episode: number;
	eps: number;
	lastSteps: number;
	optimal: number | null;
	greedyLen: number | null;
	converged: boolean;
	totalSteps: number;
}

/** Couples a GridWorld and a QAgent and runs them step by step (for animation) or in bulk. */
export class Trainer {
	readonly env: GridWorld;
	readonly agent: QAgent;
	readonly history = new Int32Array(HISTORY);
	historyLen = 0;
	episode = 0;
	epSteps = 0;
	lastSteps = 0;
	totalSteps = 0;
	optimal: number | null;
	greedyLen: number | null = null;
	private streak = 0;

	constructor(spec: GridSpec, seed = 42, params: QParams = DEFAULT_Q_PARAMS) {
		this.env = new GridWorld(spec);
		this.agent = new QAgent(this.env.size, N_ACTIONS, params, mulberry32(seed));
		this.optimal = this.env.shortestPath();
		this.env.reset();
	}

	get converged(): boolean {
		return this.streak >= 3;
	}

	/** Advance one environment step. Returns true when an episode just ended. */
	step(): boolean {
		const s = this.env.state;
		const a = this.agent.act(s);
		const { s: s2, r, done } = this.env.step(a);
		const terminal = s2 === this.env.goal;
		this.agent.update(s, a, r, s2, terminal);
		this.epSteps++;
		this.totalSteps++;
		if (done) {
			this.finishEpisode();
			return true;
		}
		return false;
	}

	private finishEpisode(): void {
		this.lastSteps = this.epSteps;
		this.history[this.historyLen % HISTORY] = this.epSteps;
		this.historyLen++;
		this.epSteps = 0;
		this.episode++;
		this.agent.endEpisode();
		this.env.reset();
		this.checkConvergence();
	}

	private checkConvergence(): void {
		const path = this.greedyRollout(this.env.size);
		this.greedyLen = path ? path.length - 1 : null;
		if (this.optimal !== null && this.greedyLen === this.optimal) this.streak++;
		else this.streak = 0;
	}

	/** Run steps until the time budget or step cap is spent. Returns steps taken. */
	runFor(budgetMs: number, maxSteps: number, now: () => number = () => performance.now()): number {
		const t0 = now();
		let n = 0;
		while (n < maxSteps) {
			this.step();
			n++;
			if ((n & 15) === 0 && now() - t0 > budgetMs) break;
		}
		return n;
	}

	runEpisodes(n: number): void {
		const target = this.episode + n;
		while (this.episode < target) this.step();
	}

	/** Greedy path from start (cells, inclusive), or null if it loops or runs out of steps. */
	greedyRollout(maxLen: number): number[] | null {
		const env = this.env;
		const seen = new Uint8Array(env.size);
		let c = env.start;
		const path = [c];
		seen[c] = 1;
		for (let i = 0; i < maxLen; i++) {
			if (c === env.goal) return path;
			const a = this.agent.greedy(c);
			const n = env.neighbor(c, a);
			if (n === -1 || seen[n]) return null;
			seen[n] = 1;
			c = n;
			path.push(c);
		}
		return c === env.goal ? path : null;
	}

	/** Call after editing walls or the goal: keep the Q-table so the agent visibly unlearns. */
	onGridEdited(): void {
		this.optimal = this.env.shortestPath();
		this.agent.boostExploration(0.3);
		this.streak = 0;
		this.greedyLen = null;
		this.epSteps = 0;
		this.env.reset();
	}

	/** Swap in a new maze but keep the Q-table, so the agent has to unlearn the old one. */
	loadSpec(spec: GridSpec): void {
		this.env.walls.set(spec.walls);
		this.env.start = spec.start;
		this.env.goal = spec.goal;
		this.onGridEdited();
	}

	resetLearning(): void {
		this.agent.reset();
		this.episode = 0;
		this.historyLen = 0;
		this.lastSteps = 0;
		this.totalSteps = 0;
		this.onGridEdited();
		this.agent.eps = this.agent.p.eps;
	}

	recentHistory(): number[] {
		const n = Math.min(this.historyLen, HISTORY);
		const out: number[] = [];
		for (let i = this.historyLen - n; i < this.historyLen; i++) out.push(this.history[i % HISTORY]!);
		return out;
	}

	stats(): TrainerStats {
		return {
			episode: this.episode,
			eps: this.agent.eps,
			lastSteps: this.lastSteps,
			optimal: this.optimal,
			greedyLen: this.greedyLen,
			converged: this.converged,
			totalSteps: this.totalSteps,
		};
	}
}
