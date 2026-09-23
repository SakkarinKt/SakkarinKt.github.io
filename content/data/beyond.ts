export interface Hobby {
	emoji: string;
	title: string;
	body: string;
}

export const beyond: Hobby[] = [
	{
		emoji: '🥋',
		title: 'Brazilian jiu-jitsu',
		body: 'The most honest feedback loop I know: bad policy, immediate negative reward. TODO(owner): belt / gym / how long you have been rolling.',
	},
	{
		emoji: '🍳',
		title: 'Cooking',
		body: 'Recipe testing is just hyperparameter search with better snacks. TODO(owner): a signature dish.',
	},
	{
		emoji: '🎬',
		title: 'Films',
		body: 'TODO(owner): two or three films you keep recommending.',
	},
];
