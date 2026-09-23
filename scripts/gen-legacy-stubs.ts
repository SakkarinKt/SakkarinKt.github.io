/**
 * Generates the redirect site for the legacy SakkarinKt/SakkarinKt repo (served at /SakkarinKt/).
 *   npx tsx scripts/gen-legacy-stubs.ts --out ../SakkarinKt-profile/site
 */
import fs from 'node:fs';
import path from 'node:path';
import { getPosts } from '../lib/content/load';
import { buildLegacyMap, resolveLegacy } from '../lib/redirects';
import { SITE_NAME, SITE_URL } from '../lib/site';

const outArg = process.argv.indexOf('--out');
if (outArg === -1 || !process.argv[outArg + 1]) {
	console.error('usage: tsx scripts/gen-legacy-stubs.ts --out <dir>');
	process.exit(1);
}
const OUT = path.resolve(process.argv[outArg + 1]!);
const map = buildLegacyMap(getPosts({ includeDrafts: true }).map((p) => ({ slug: p.slug, legacySlugs: p.data.legacySlugs })));

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

function stub(target: string): string {
	const url = `${SITE_URL}${target}`;
	return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Moved · ${SITE_NAME}</title>
<meta name="robots" content="noindex">
<link rel="canonical" href="${esc(url)}">
<script>location.replace(${JSON.stringify(url)} + location.search + location.hash);</script>
<meta http-equiv="refresh" content="0; url=${esc(url)}">
</head>
<body style="font-family:system-ui,sans-serif;padding:2rem">
<p>This site moved to <a href="${esc(url)}">${esc(url)}</a>.</p>
</body>
</html>
`;
}

function notFound(): string {
	// Catch-all for deep links the stubs don't cover: same resolver, inlined.
	return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Moved · ${SITE_NAME}</title>
<meta name="robots" content="noindex">
<script>
var map = ${JSON.stringify(map)};
var resolveLegacy = ${resolveLegacy.toString()};
location.replace(${JSON.stringify(SITE_URL)} + resolveLegacy(location.pathname, map) + location.search + location.hash);
</script>
</head>
<body style="font-family:system-ui,sans-serif;padding:2rem">
<p>This site moved to <a href="${SITE_URL}/">${SITE_URL}/</a>.</p>
</body>
</html>
`;
}

const feed = `<?xml version="1.0" encoding="utf-8"?>
<rss version="2.0">
<channel>
<title>${SITE_NAME} — this feed moved</title>
<link>${SITE_URL}/</link>
<description>The feed now lives at ${SITE_URL}/rss.xml</description>
<item>
<title>This feed moved to ${SITE_URL}/rss.xml</title>
<link>${SITE_URL}/rss.xml</link>
<guid isPermaLink="false">feed-moved-2026</guid>
<description>Please update your subscription to ${SITE_URL}/rss.xml</description>
</item>
</channel>
</rss>
`;

fs.rmSync(OUT, { recursive: true, force: true });
for (const [from, to] of Object.entries(map)) {
	const dir = path.join(OUT, from);
	fs.mkdirSync(dir, { recursive: true });
	fs.writeFileSync(path.join(dir, 'index.html'), stub(to));
}
fs.writeFileSync(path.join(OUT, '404.html'), notFound());
fs.writeFileSync(path.join(OUT, 'rss.xml'), feed);
fs.writeFileSync(path.join(OUT, '.nojekyll'), '');
console.log(`✓ ${Object.keys(map).length} redirect stubs + 404.html + rss.xml → ${OUT}`);
