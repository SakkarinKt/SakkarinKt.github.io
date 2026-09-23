import GithubSlugger from 'github-slugger';

export interface Heading {
	depth: 2 | 3;
	text: string;
	id: string;
}

/** Strip inline markdown so the slug matches what rehype-slug derives from rendered text. */
function plain(text: string): string {
	return text
		.replace(/`([^`]*)`/g, '$1')
		.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
		.replace(/[*_~]/g, '')
		.trim();
}

/** h2/h3 headings outside code fences, with the same ids rehype-slug will generate. */
export function extractHeadings(markdown: string): Heading[] {
	const slugger = new GithubSlugger();
	const out: Heading[] = [];
	let fenced = false;
	for (const line of markdown.split('\n')) {
		if (/^\s*(```|~~~)/.test(line)) fenced = !fenced;
		if (fenced) continue;
		const m = /^(#{1,6})\s+(.+?)\s*#*\s*$/.exec(line);
		if (!m) continue;
		const text = plain(m[2]!);
		const id = slugger.slug(text);
		const depth = m[1]!.length;
		if (depth === 2 || depth === 3) out.push({ depth, text, id });
	}
	return out;
}
