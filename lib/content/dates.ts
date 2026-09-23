const long = new Intl.DateTimeFormat('en', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' });
const monthYear = new Intl.DateTimeFormat('en', { year: 'numeric', month: 'short', timeZone: 'UTC' });

/** ISO dates are calendar dates; format them in UTC so Taipei and CI agree. */
export function formatDate(iso: string): string {
	return long.format(new Date(`${iso}T00:00:00Z`));
}

export function formatMonth(iso: string): string {
	return monthYear.format(new Date(`${iso.length === 7 ? `${iso}-01` : iso}T00:00:00Z`));
}

export function formatPeriod(period: { start: string; end?: string }): string {
	const fmt = (s: string) => (s.length === 4 ? s : formatMonth(s));
	return `${fmt(period.start)} — ${period.end ? fmt(period.end) : 'now'}`;
}
