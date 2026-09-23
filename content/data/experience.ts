export interface Role {
	period: string;
	title: string;
	org: string;
	points: string[];
	stack?: string[];
}

export const experience: Role[] = [
	{
		period: '2023 — now',
		title: 'Software Developer',
		org: 'SystemWeb Technologies',
		points: [
			'Currently building the Transfer Agent System for asset- and wealth-management clients — the unglamorous, audited plumbing that tracks who owns which fund units.',
			'Before that, built the Portfolio Management System for the same client base.',
			'Work across a 5–10 person team split between Thailand and Taiwan.',
		],
		stack: ['C#', 'JavaScript', 'SQL'],
	},
	{
		period: '2020',
		title: 'Data Analyst',
		org: 'Tri Petch IT Solutions',
		points: [
			'Built a predictive model to target Isuzu Motors marketing campaigns.',
			'Owned the supporting databases and cloud services end to end.',
		],
		stack: ['Python', 'SQL', 'Cloud'],
	},
];
