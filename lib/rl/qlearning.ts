export interface QParams {
	alpha: number;
	gamma: number;
	eps: number;
	epsMin: number;
	epsDecay: number;
}

export const DEFAULT_Q_PARAMS: QParams = { alpha: 0.5, gamma: 0.95, eps: 1, epsMin: 0.05, epsDecay: 0.97 };

/** Tabular Q-learning with ε-greedy exploration and random tie-breaking. */
export class QAgent {
	readonly q: Float32Array;
	eps: number;

	constructor(
		readonly nS: number,
		readonly nA: number,
		readonly p: QParams,
		private readonly rng: () => number,
	) {
		this.q = new Float32Array(nS * nA);
		this.eps = p.eps;
	}

	greedy(s: number): number {
		const base = s * this.nA;
		let best = -Infinity;
		let ties = 0;
		let choice = 0;
		for (let a = 0; a < this.nA; a++) {
			const v = this.q[base + a]!;
			if (v > best) {
				best = v;
				choice = a;
				ties = 1;
			} else if (v === best) {
				// Reservoir-sample among ties so an untrained agent doesn't always go north.
				ties++;
				if (this.rng() * ties < 1) choice = a;
			}
		}
		return choice;
	}

	act(s: number): number {
		return this.rng() < this.eps ? Math.floor(this.rng() * this.nA) : this.greedy(s);
	}

	maxQ(s: number): number {
		const base = s * this.nA;
		let m = this.q[base]!;
		for (let a = 1; a < this.nA; a++) m = Math.max(m, this.q[base + a]!);
		return m;
	}

	/** One TD(0) update; returns the TD error. */
	update(s: number, a: number, r: number, s2: number, terminal: boolean): number {
		const target = terminal ? r : r + this.p.gamma * this.maxQ(s2);
		const i = s * this.nA + a;
		const td = target - this.q[i]!;
		this.q[i] = this.q[i]! + this.p.alpha * td;
		return td;
	}

	endEpisode(): void {
		this.eps = Math.max(this.p.epsMin, this.eps * this.p.epsDecay);
	}

	boostExploration(min = 0.3): void {
		this.eps = Math.max(this.eps, min);
	}

	reset(): void {
		this.q.fill(0);
		this.eps = this.p.eps;
	}

	/** V(s) = max_a Q(s, a) for every state. */
	values(out: Float32Array = new Float32Array(this.nS)): Float32Array {
		for (let s = 0; s < this.nS; s++) out[s] = this.maxQ(s);
		return out;
	}
}
