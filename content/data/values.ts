export interface Value {
	label: string;
	body: string;
}

export const values: Value[] = [
	{
		label: 'I publish my null results',
		body: 'janus-chrysalis pre-registered a replication, the effect vanished (p≈0.039 → 0.388), and the write-up says so. A result that only survives in the slide deck is not a result.',
	},
	{
		label: 'Agents propose, I review & merge',
		body: 'I co-build with Claude: a scheduled agent does one bounded increment a day and opens a PR with a stand-up report. Irreversible decisions go through ADRs that a human signs off. Autonomy with gates, not vibes.',
	},
	{
		label: 'Attach a number, then attach its n',
		body: 'Every metric on this site says how many seeds, documents, or runs it rests on — and what it does not show. If a number is synthetic, it is labelled synthetic.',
	},
	{
		label: 'Production is the bar',
		body: 'My day job is audited financial software. That habit carries over: tests, reproducible configs, and flagging “this won’t work” early instead of late.',
	},
];
