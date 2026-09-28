export interface Degree {
	year: string;
	degree: string;
	school: string;
	note: string;
}

export const education: Degree[] = [
	{
		year: '2020 – 2024',
		degree: 'MSc, Information Systems & Applications',
		school: 'National Tsing Hua University · Hsinchu, Taiwan',
		note: 'Thesis: enhancing autonomous driving with double critic + MCTS for inverse RL. Coursework in reinforcement learning, neural networks, and cryptography.',
	},
	{
		year: 'Feb 2017',
		degree: 'BSc, Actuarial Science',
		school: 'Mahidol University · Bangkok, Thailand',
		note: 'Mathematics, statistics, finance, and economics: the applied-math base everything else sits on.',
	},
];
