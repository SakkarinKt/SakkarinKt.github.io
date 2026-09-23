/**
 * Post-build gate for the static export in out/:
 * route files exist, every internal link and #anchor resolves, OG images are real PNGs,
 * nothing references the legacy /SakkarinKt base path, and no TODO(owner) placeholder shipped.
 */
import fs from 'node:fs';
import path from 'node:path';
import { getCaseStudies, getListedPosts, getPosts } from '../lib/content/load';

const OUT = path.join(process.cwd(), 'out');
const problems: string[] = [];
const allowTodo = process.env.ALLOW_TODO === '1';

function walk(dir: string): string[] {
	return fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
		const p = path.join(dir, d.name);
		return d.isDirectory() ? walk(p) : [p];
	});
}

const mustExist = [
	'index.html',
	'404.html',
	'about/index.html',
	'projects/index.html',
	'blog/index.html',
	'rss.xml',
	'sitemap.xml',
	'robots.txt',
	'.nojekyll',
	...getCaseStudies().map((p) => `projects/${p.slug}/index.html`),
	...getPosts().map((p) => `blog/${p.slug}/index.html`),
];
for (const f of mustExist) {
	const abs = path.join(OUT, f);
	if (!fs.existsSync(abs) || !fs.statSync(abs).isFile()) problems.push(`missing file: out/${f}`);
}
if (fs.existsSync(path.join(OUT, 'SakkarinKt')) || fs.existsSync(path.join(OUT, 'sakkarinkt'))) {
	problems.push('out/ must not contain a /SakkarinKt route (the legacy project site owns that path)');
}

const files = walk(OUT);
const htmlFiles = files.filter((f) => f.endsWith('.html'));

// Map each page URL to the ids it defines, for anchor checks.
const idsByPage = new Map<string, Set<string>>();
const pageUrl = (file: string) => {
	const rel = path.relative(OUT, file).split(path.sep).join('/');
	if (rel === 'index.html') return '/';
	if (rel.endsWith('/index.html')) return `/${rel.slice(0, -'index.html'.length)}`;
	return `/${rel}`;
};
const html = new Map<string, string>();
for (const file of htmlFiles) {
	const src = fs.readFileSync(file, 'utf8');
	html.set(file, src);
	idsByPage.set(pageUrl(file), new Set([...src.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]!)));
}

function resolves(urlPath: string): boolean {
	const clean = decodeURIComponent(urlPath);
	const abs = path.join(OUT, clean);
	if (clean.endsWith('/')) return fs.existsSync(path.join(abs, 'index.html'));
	return fs.existsSync(abs) && fs.statSync(abs).isFile();
}

for (const [file, src] of html) {
	const from = pageUrl(file);
	if (from === '/404.html') continue;
	if (/TODO\(owner\)/.test(src) && !allowTodo) problems.push(`${from}: contains TODO(owner) placeholder`);
	if (/(href|src)="\/SakkarinKt/i.test(src)) problems.push(`${from}: references the legacy /SakkarinKt base path`);
	for (const m of src.matchAll(/\s(?:href|src)="(\/[^"]*|#[^"]*)"/g)) {
		const raw = m[1]!.replace(/&amp;/g, '&');
		if (raw.startsWith('//')) continue;
		const [p, hash] = raw.split('#') as [string, string | undefined];
		const target = p === '' ? from : p.split('?')[0]!;
		if (target.startsWith('/_next/')) {
			if (!resolves(target)) problems.push(`${from}: broken asset ${target}`);
			continue;
		}
		if (!resolves(target)) {
			problems.push(`${from}: broken link ${raw}${target.endsWith('/') || target.includes('.') ? '' : ' (missing trailing slash?)'}`);
			continue;
		}
		if (hash && target.endsWith('/')) {
			const ids = idsByPage.get(target);
			if (!ids?.has(decodeURIComponent(hash))) problems.push(`${from}: link to missing anchor ${target}#${hash}`);
		}
	}
	for (const m of src.matchAll(/<meta property="og:image" content="([^"]+)"/g)) {
		const u = new URL(m[1]!);
		const abs = path.join(OUT, u.pathname);
		if (!fs.existsSync(abs)) {
			problems.push(`${from}: og:image missing ${u.pathname}`);
			continue;
		}
		const sig = fs.readFileSync(abs).subarray(0, 4).toString('hex');
		if (sig !== '89504e47') problems.push(`${from}: og:image ${u.pathname} is not a PNG`);
	}
}

const home = idsByPage.get('/');
for (const id of ['projects', 'contact', 'fig-1']) {
	if (!home?.has(id)) problems.push(`home page is missing #${id} (old links and the palette depend on it)`);
}

const rss = fs.existsSync(path.join(OUT, 'rss.xml')) ? fs.readFileSync(path.join(OUT, 'rss.xml'), 'utf8') : '';
const items = (rss.match(/<item>/g) ?? []).length;
if (items !== getListedPosts().length) problems.push(`rss.xml has ${items} items, expected ${getListedPosts().length}`);

if (problems.length) {
	console.error(`✗ export verification failed (${problems.length}):\n${problems.map((p) => `  - ${p}`).join('\n')}`);
	process.exit(1);
}
console.log(`✓ export verified: ${htmlFiles.length} pages, ${files.length} files`);
