export interface Value {
	label: string;
	body: string;
}

export const values: Value[] = [
	{
		label: 'Plan first, read widely, then go explore',
		body: 'Most of my projects start life as a plan doc and a reading list. janus-chrysalis keeps notes on every paper it leans on. Then I try the new approach anyway, because that’s the fun part, and the plan tells me whether it actually made things better or just made them different.',
	},
	{
		label: 'Small steps, real numbers',
		body: 'Ship something small, measure it, then decide. I’d rather show you a modest number I can defend than a big one I can’t. That’s why every number on this site comes with its n, and why one of my favourite results is a null result.',
	},
	{
		label: 'Start from the person, not the tech',
		body: 'Figure out what they actually need first. So far that’s been fund administrators, a Canadian bank’s data team, Thailand’s largest mobile operator, and, for Fortuna, me squinting at my own credit-card statement. The model comes second.',
	},
];
