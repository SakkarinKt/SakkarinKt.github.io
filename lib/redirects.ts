/**
 * The old Astro site lived at /SakkarinKt/ (a project page of the SakkarinKt/SakkarinKt repo).
 * That repo keeps serving tiny redirect stubs generated from this map, so old links land here.
 */
export type LegacyMap = Record<string, string>;

const STATIC_LEGACY: LegacyMap = {
	'/': '/',
	'/about/': '/about/',
	'/blog/': '/blog/',
	'/blog/archive/': '/blog/',
	// Template filler posts from the Astro starter, dropped in v3.
	'/blog/markdown-style-guide/': '/blog/',
	'/blog/third-post/': '/blog/',
};

export function buildLegacyMap(posts: Array<{ slug: string; legacySlugs: string[] }>): LegacyMap {
	const map: LegacyMap = { ...STATIC_LEGACY };
	for (const post of posts) {
		for (const old of post.legacySlugs) map[`/blog/${old}/`] = `/blog/${post.slug}/`;
	}
	return map;
}

/**
 * Map a path requested on the legacy project site to its new home.
 * Strips the /SakkarinKt segment (case-insensitive, whole segment only) and normalizes the trailing slash.
 * Kept dependency-free: it's serialized verbatim into the legacy 404.html.
 */
export function resolveLegacy(pathname: string, map: LegacyMap): string {
	const base = /^\/sakkarinkt(?=\/|$)/i.exec(pathname);
	let rest = base ? pathname.slice(base[0].length) : pathname;
	if (!rest.startsWith('/')) rest = `/${rest}`;
	const isFile = /\.[a-z0-9]+$/i.test(rest);
	const normalized = isFile || rest.endsWith('/') ? rest : `${rest}/`;
	return map[normalized] ?? normalized;
}
