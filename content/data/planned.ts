import type { PlannedItem } from '@/lib/content/schema';

// Planned work. Nothing here is built yet, and the site says so.
export const planned: PlannedItem[] = [
	{
		slug: 'rag-fin-qa',
		title: 'rag-fin-qa',
		oneLiner:
			'Q&A over SEC filings and earnings calls with GPU-served retrieval and faithfulness evals. Scaffolded; the latency and faithfulness targets are targets, not results.',
		stack: ['RAG', 'Ragas', 'Triton'],
	},
	{
		slug: 'cuda-quant-kernels',
		title: 'cuda-quant-kernels',
		oneLiner: 'Hand-written CUDA kernels for quant workloads, profiled with Nsight — my own kernels this time, not the samples.',
		stack: ['CUDA', 'Nsight'],
	},
];
