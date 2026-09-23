import { describe, expect, it } from 'vitest';
import { GridWorld } from './gridworld';
import { QAgent, DEFAULT_Q_PARAMS } from './qlearning';
import { sMaze, PRESETS } from './presets';
import { Trainer } from './trainer';

describe('GridWorld', () => {
	it('blocks edges and walls with a bump penalty', () => {
		const env = new GridWorld(sMaze());
		env.reset();
		const west = env.step(3); // start is x=0 → leaving the grid
		expect(west.bumped).toBe(true);
		expect(west.r).toBeCloseTo(-0.05);
		expect(env.state).toBe(env.start);
	});

	it('ends the episode with +1 at the goal', () => {
		const env = new GridWorld({ w: 2, h: 1, start: 0, goal: 1, walls: new Uint8Array(2) });
		env.reset();
		expect(env.step(1)).toEqual({ s: 1, r: 1, done: true, bumped: false });
	});

	it('refuses to wall off start or goal, and to put the goal in a wall', () => {
		const env = new GridWorld(sMaze());
		expect(env.toggleWall(env.start)).toBe(false);
		expect(env.toggleWall(env.goal)).toBe(false);
		const wall = env.walls.findIndex((w) => w === 1);
		expect(env.setGoal(wall)).toBe(false);
	});

	it('computes BFS shortest paths and detects unreachable goals', () => {
		const env = new GridWorld(sMaze());
		expect(env.shortestPath()).toBe(28);
		// Box the goal (top-right corner) in.
		env.toggleWall(env.cell(10, 0));
		env.toggleWall(env.cell(11, 1));
		expect(env.shortestPath()).toBeNull();
	});
});

describe('QAgent', () => {
	it('applies a hand-computed TD(0) update', () => {
		const agent = new QAgent(2, 4, DEFAULT_Q_PARAMS, () => 0.5);
		agent.q[1 * 4 + 2] = 0.4; // max_a Q(s'=1, a) = 0.4
		const td = agent.update(0, 1, -0.01, 1, false);
		// target = -0.01 + 0.95 * 0.4 = 0.37; Q ← 0 + 0.5 * 0.37
		expect(td).toBeCloseTo(0.37);
		expect(agent.q[1]).toBeCloseTo(0.185);
	});

	it('decays ε per episode down to the floor', () => {
		const agent = new QAgent(1, 4, DEFAULT_Q_PARAMS, () => 0.5);
		for (let i = 0; i < 500; i++) agent.endEpisode();
		expect(agent.eps).toBeCloseTo(DEFAULT_Q_PARAMS.epsMin);
	});
});

describe('Trainer', () => {
	it('learns the optimal S-maze path, and re-learns after the goal moves', () => {
		const t0 = performance.now();
		const trainer = new Trainer(sMaze(), 42);
		trainer.runEpisodes(500);
		expect(trainer.greedyRollout(96)!.length - 1).toBe(trainer.optimal);

		trainer.env.setGoal(trainer.env.cell(11, 7));
		trainer.onGridEdited();
		trainer.runEpisodes(500);
		expect(trainer.greedyRollout(96)!.length - 1).toBe(trainer.optimal);
		expect(performance.now() - t0).toBeLessThan(1500);
	});

	it('is deterministic for a given seed', () => {
		const a = new Trainer(sMaze(), 7);
		const b = new Trainer(sMaze(), 7);
		a.runEpisodes(50);
		b.runEpisodes(50);
		expect(Array.from(a.agent.q)).toEqual(Array.from(b.agent.q));
	});

	it('survives an unreachable goal without NaNs', () => {
		const trainer = new Trainer(sMaze(), 1);
		trainer.env.toggleWall(trainer.env.cell(10, 0));
		trainer.env.toggleWall(trainer.env.cell(11, 1));
		trainer.onGridEdited();
		expect(trainer.optimal).toBeNull();
		trainer.runEpisodes(5);
		expect(trainer.agent.q.every(Number.isFinite)).toBe(true);
		expect(trainer.converged).toBe(false);
	});

	it('solves every preset', () => {
		for (const make of PRESETS) {
			const trainer = new Trainer(make(), 42);
			trainer.runEpisodes(600);
			expect(trainer.optimal).not.toBeNull();
			expect(trainer.greedyRollout(96)!.length - 1).toBe(trainer.optimal);
		}
	});
});
