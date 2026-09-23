import type { MetadataRoute } from 'next';
import { getCaseStudies, getListedPosts } from '@/lib/content/load';
import { absoluteUrl } from '@/lib/site';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
	const pages = ['/', '/projects/', '/blog/', '/about/'].map((p) => ({ url: absoluteUrl(p) }));
	const studies = getCaseStudies().map((p) => ({ url: absoluteUrl(`/projects/${p.slug}/`), lastModified: p.data.asOf }));
	const posts = getListedPosts().map((p) => ({ url: absoluteUrl(`/blog/${p.slug}/`), lastModified: p.data.updatedDate ?? p.data.pubDate }));
	return [...pages, ...studies, ...posts];
}
