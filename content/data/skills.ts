export interface SkillGroup {
	category: string;
	items: string[];
}

// Only skills the résumé, the public repos, or the day job actually show.
export const skills: SkillGroup[] = [
	{
		category: 'LLM & agentic systems',
		items: ['Claude Code plugins', 'LLM multi-agent systems', 'Agent memory (graph-based)', 'Prompt & context engineering', 'LLM evals', 'Hybrid frontier/local orchestration'],
	},
	{
		category: 'Reinforcement learning',
		items: ['SAC / MaxEnt RL', 'PPO', 'World models (RSSM / Dreamer-style)', 'Multi-agent RL', 'Inverse RL'],
	},
	{
		category: 'ML stack',
		items: ['PyTorch', 'TensorFlow.js', 'Gymnasium', 'MLX', 'Apple FoundationModels', 'CUDA (learning)'],
	},
	{
		category: 'Data engineering',
		items: ['Apache Spark', 'Hadoop', 'ETL pipelines', 'AWS migration', 'SQL / PostgreSQL', 'Tableau'],
	},
	{
		category: 'Software',
		items: ['Python', 'TypeScript / JavaScript', 'C#', 'C / C++', 'R', 'FastAPI', 'Next.js / React', 'SwiftUI'],
	},
	{
		category: 'Infra & practice',
		items: ['Docker', 'AWS', 'Google Cloud', 'GitHub Actions', 'ADRs & pre-registration', 'Seeded, config-snapshotted runs'],
	},
];
