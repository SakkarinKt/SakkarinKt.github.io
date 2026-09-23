import type { BenchItem } from '@/lib/content/schema';

// Smaller or local-only experiments. One line each, honest status, no links unless public.
export const bench: BenchItem[] = [
	{
		slug: 'planner-executor',
		title: 'planner-executor',
		oneLiner:
			'Frontier model plans and rescues, a local Qwen 9B on MLX executes behind per-step JSON gates. On a 15-document extraction pilot it matched all-frontier accuracy at ~56% of the serving cost.',
		evidence: 'preliminary',
		chips: ['n = 15 docs', 'local only'],
		visibility: 'local-only',
		stack: ['Python', 'MLX', 'Claude CLI'],
	},
	{
		slug: 'constitutional-guardrail-gateway',
		title: 'constitutional-guardrail-gateway',
		oneLiner:
			'OpenAI-compatible gateway that enforces a written 10-principle constitution as policy-as-code, with PII / injection detectors and a hash-chained audit log. Red-team eval designed, not yet run.',
		evidence: 'self-check',
		chips: ['62 tests', 'local only'],
		visibility: 'local-only',
		stack: ['FastAPI', 'pydantic', 'YAML policy'],
	},
	{
		slug: 'model-router-alpha',
		title: 'model-router-alpha',
		oneLiner:
			'Routes each query to the cheapest Claude tier that clears a quality bar. The eval design is the point: calibrated classifiers, bootstrap CIs, a κ-checked LLM judge.',
		evidence: 'synthetic',
		chips: ['830-prompt test sets'],
		visibility: 'local-only',
		stack: ['scikit-learn', 'MiniLM', 'FastAPI'],
	},
	{
		slug: 'agentic-production-pipeline',
		title: 'PASSAGE',
		oneLiner:
			'KYC/AML onboarding for a fictional bank: a 4-stage LangGraph pipeline with schema-checked handoffs, a rules-based risk engine, and a human review step.',
		evidence: 'synthetic',
		chips: ['offline core', '34 tests'],
		visibility: 'local-only',
		stack: ['LangGraph', 'pydantic'],
	},
	{
		slug: 'ember',
		title: 'EMBER',
		oneLiner:
			'SQLite-backed agent memory where memories decay and get reinforced, ACT-R style. Storage and brute-force search work; HNSW and benchmarks are next.',
		evidence: 'none',
		chips: ['milestone 1'],
		visibility: 'local-only',
		stack: ['SQLite', 'Python'],
	},
	{
		slug: 'swift-afm3',
		title: 'Overture',
		oneLiner:
			'On-device iOS “morning brief” that fans out parallel Apple FoundationModels sessions and keeps personal data on the phone.',
		evidence: 'none',
		chips: ['mock model only'],
		visibility: 'local-only',
		stack: ['SwiftUI', 'FoundationModels'],
	},
	{
		slug: 'rl-from-scratch',
		title: 'RL from scratch',
		oneLiner:
			'Single-file PPO (CartPole, Pendulum) and a Dreamer-v1-style world model with a live React training view. The PPO results are seed-sensitive, and I report them that way.',
		evidence: 'measured',
		chips: ['seed-sensitive'],
		visibility: 'local-only',
		stack: ['PyTorch', 'Gymnasium', 'React'],
	},
];
