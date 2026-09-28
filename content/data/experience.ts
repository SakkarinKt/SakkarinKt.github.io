export interface Role {
	period: string;
	title: string;
	org: string;
	place: string;
	/** Who the work was for, when that's the interesting part. */
	client?: string;
	points: string[];
	stack?: string[];
}

export interface Stat {
	value: string;
	label: string;
}

/** Current role: the one recruiters should read first. */
export const current = {
	period: 'Oct 2023 — now',
	title: 'Software Developer',
	org: 'SystemWeb Technologies',
	place: 'Taipei, Taiwan',
	lede: 'I build the AI tooling our engineering team works with every day, on top of the C# fund-administration systems we ship.',
	stats: [
		{ value: '3', label: 'Claude Code plugins published internally' },
		{ value: 'days → hours', label: 'per-feature development time' },
		{ value: '3–4', label: 'engineers using them daily' },
		{ value: '500', label: 'documents in the agent memory graph' },
	] satisfies Stat[],
	points: [
		'Architected and published 3 plugins to our internal Claude Code plugin marketplace, for task execution, ideation, and AI-native SDLC onboarding for engineers new to AI-assisted work. Per-feature development went from days to hours, and 3–4 engineers use them every day.',
		'Designed a graph-based persistent memory layer for our agent system, replacing ad-hoc context handling. It indexes 500 documents so agents can recall what happened in earlier sessions.',
		'Underneath it all: the C# Transfer Agent System for asset- and wealth-management clients (and the Portfolio Management System before it), built with a 5–10 person team split between Thailand and Taiwan.',
	],
	stack: ['Claude Code', 'Agent memory (graph)', 'LLM multi-agent systems', 'C#', 'JavaScript', 'SQL'],
};

/** 2017–2020: data engineering and analytics in Bangkok, mostly embedded with clients. */
export const earlier: Role[] = [
	{
		period: 'Feb — Jun 2020',
		title: 'Data Analyst',
		org: 'Tri Petch IT Solutions',
		place: 'Bangkok',
		client: 'Isuzu Motors',
		points: ['Predictive models for Isuzu’s marketing campaigns, plus the databases and cloud services behind them.'],
		stack: ['Python', 'SQL', 'Cloud'],
	},
	{
		period: 'Oct — Dec 2019',
		title: 'Data Engineer (contract)',
		org: 'Pruksa Real Estate',
		place: 'Bangkok',
		points: ['Designed the data workflows and migrated on-premises data to AWS for the DataOps team.'],
		stack: ['AWS', 'ETL'],
	},
	{
		period: 'Jul — Sep 2019',
		title: 'Data Analyst (contract)',
		org: 'Advanced Info Service (AIS)',
		place: 'Bangkok',
		points: ['Regional data-business requirements for Thailand’s largest mobile operator (40M+ customers).'],
		stack: ['Analytics'],
	},
	{
		period: 'Mar 2018 — May 2019',
		title: 'Hadoop Developer',
		org: 'ATA IT Limited',
		place: 'Bangkok',
		client: 'National Bank of Canada',
		points: ['ETL pipelines and semi-structured data integration on Hadoop for National Bank of Canada.'],
		stack: ['Hadoop', 'Spark', 'ETL'],
	},
	{
		period: 'Jan — Feb 2018',
		title: 'Junior Data Scientist',
		org: 'GameSpace',
		place: 'Bangkok',
		points: ['Data analysis and databases for a retail client with 10+ branches.'],
	},
	{
		period: 'Sep — Nov 2017',
		title: 'Data Analyst',
		org: 'Betimes Solution',
		place: 'Bangkok',
		points: ['ETL, interactive dashboards, and prediction models for government-sector clients.'],
		stack: ['ETL', 'Tableau'],
	},
];
