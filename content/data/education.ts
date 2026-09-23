export interface Degree {
	year: string;
	degree: string;
	school: string;
	note: string;
}

export const education: Degree[] = [
	{
		year: '2024',
		degree: 'MSc, Information Systems & Applications',
		school: 'National Tsing Hua University · Taiwan',
		note: 'Thesis on inverse RL for autonomous driving (double critic + MCTS). Where RL stopped being a textbook chapter for me.',
	},
	{
		year: '2017',
		degree: 'BSc, Actuarial Science',
		school: 'Mahidol University · Thailand',
		note: 'Probability, statistics, and pricing risk — the applied-math base everything else sits on.',
	},
];
