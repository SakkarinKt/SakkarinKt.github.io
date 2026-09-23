import type { DiagramSpec } from './types';

const janus: DiagramSpec = {
	title: 'janus-chrysalis research loop',
	description:
		'Top row: a scheduled Claude agent reads the goal file, runs one bounded increment, and opens a PR with a stand-up; the human reviews, records irreversible decisions as ADRs, and merges, which updates the goal. Bottom row: the experiment — a two-agent gridworld feeds per-agent RSSM world models; one agent is frozen at step k, and paired runs with the partner learning versus frozen give the drift-attributable prediction error, which flows back into the PR.',
	width: 820,
	height: 345,
	groups: [
		{ label: 'daily loop', x: 20, y: 16, w: 780, h: 144 },
		{ label: 'experiment', x: 20, y: 196, w: 780, h: 132 },
	],
	nodes: [
		{ id: 'goal', label: 'loop/GOAL.md', sub: 'standing goal + limits', x: 105, y: 108, w: 140 },
		{ id: 'agent', label: 'Claude agent', sub: 'one bounded increment/day', x: 290, y: 108, w: 165, tone: 'teal' },
		{ id: 'pr', label: 'PR + stand-up', sub: 'done · learned · asks', x: 475, y: 108, w: 150 },
		{ id: 'human', label: 'Human review', sub: 'ADRs for irreversible calls', x: 680, y: 108, w: 185, tone: 'accent' },
		{ id: 'env', label: '2-agent gridworld', sub: '8×8, partial views', x: 105, y: 268, w: 150 },
		{ id: 'wm', label: 'RSSM × 2', sub: 'tfjs · KL free bits', x: 280, y: 268, w: 130, tone: 'teal' },
		{ id: 'freeze', label: 'Freeze agent at k', sub: 'paired runs, parity-checked', x: 462, y: 268, w: 180 },
		{ id: 'delta', label: 'Δ prediction error', sub: 'partner learning − frozen', x: 680, y: 268, w: 185, tone: 'amber' },
	],
	edges: [
		{ from: 'goal', to: 'agent' },
		{ from: 'agent', to: 'pr' },
		{ from: 'pr', to: 'human' },
		{ from: 'human', to: 'goal', label: 'merge → next increment', bend: 78 },
		{ from: 'env', to: 'wm' },
		{ from: 'wm', to: 'freeze' },
		{ from: 'freeze', to: 'delta' },
		{ from: 'agent', to: 'wm', label: 'runs', dashed: true },
		{ from: 'delta', to: 'pr', label: 'results', dashed: true },
	],
};

const maxent: DiagramSpec = {
	title: 'maxent-actorcritic-portfolio pipeline',
	description:
		'A YAML config and seed, optionally modified by the ablation runner, configure a data provider (synthetic or Yahoo) and a long-only portfolio environment with a cash bucket and transaction costs. A SAC agent with twin Q-networks and automatic entropy tuning trains against it. An evaluator scores the agent and three baselines (buy-and-hold, periodic rebalance, random) on the same split and writes results plus a config snapshot into a per-run directory.',
	width: 880,
	height: 370,
	nodes: [
		{ id: 'abl', label: 'Ablation runner', sub: '6 overrides', x: 110, y: 60, w: 150, tone: 'amber' },
		{ id: 'sac', label: 'SAC agent', sub: 'twin Q · auto-entropy', x: 520, y: 60, w: 165, tone: 'teal' },
		{ id: 'cfg', label: 'YAML config + seed', sub: 'snapshotted per run', x: 110, y: 195, w: 165 },
		{ id: 'data', label: 'Data provider', sub: 'synthetic | Yahoo', x: 310, y: 195, w: 140 },
		{ id: 'env', label: 'Portfolio env', sub: 'long-only · cash · costs', x: 520, y: 195, w: 170 },
		{ id: 'eval', label: 'Evaluator', sub: 'Sharpe · MDD · turnover', x: 765, y: 195, w: 175, tone: 'accent' },
		{ id: 'base', label: 'Baselines', sub: 'B&H · rebalance · random', x: 765, y: 320, w: 180 },
	],
	edges: [
		{ from: 'abl', to: 'cfg' },
		{ from: 'cfg', to: 'data' },
		{ from: 'data', to: 'env' },
		{ from: 'sac', to: 'env', label: 'weights', bend: 60 },
		{ from: 'env', to: 'sac', label: 'reward', bend: 60 },
		{ from: 'env', to: 'eval' },
		{ from: 'base', to: 'eval', label: 'same split', dashed: true },
	],
};

export const DIAGRAMS = { janus, maxent } as const;
export type DiagramName = keyof typeof DIAGRAMS;
