export interface SkillGroup {
	category: string;
	items: string[];
}

// Only skills the public repos or the day job actually show.
export const skills: SkillGroup[] = [
	{
		category: 'Reinforcement learning',
		items: ['SAC / MaxEnt RL', 'PPO', 'World models (RSSM / Dreamer-style)', 'Multi-agent RL', 'Inverse RL'],
	},
	{
		category: 'LLM & agentic systems',
		items: ['Agentic loop design', 'Prompt & context engineering', 'LLM evals', 'Hybrid frontier/local orchestration', 'Guardrails & audit logs'],
	},
	{
		category: 'ML stack',
		items: ['PyTorch', 'TensorFlow.js', 'Gymnasium', 'MLX', 'NumPy', 'CUDA (learning)'],
	},
	{
		category: 'Software',
		items: ['Python', 'TypeScript', 'C#', 'SQL / PostgreSQL', 'FastAPI', 'Next.js / React'],
	},
	{
		category: 'Infra & practice',
		items: ['Docker', 'Google Cloud (Cloud Run, GPU VMs)', 'GitHub Actions', 'ADRs & pre-registration', 'Seeded, config-snapshotted runs'],
	},
];
