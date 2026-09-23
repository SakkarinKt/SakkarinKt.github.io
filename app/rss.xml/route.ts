import { Feed } from 'feed';
import { profile } from '@/content/data/profile';
import { getListedPosts } from '@/lib/content/load';
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL, absoluteUrl } from '@/lib/site';

export const dynamic = 'force-static';

export function GET() {
	const posts = getListedPosts();
	const feed = new Feed({
		title: `${SITE_NAME} — writing`,
		description: SITE_DESCRIPTION,
		id: `${SITE_URL}/`,
		link: `${SITE_URL}/`,
		language: 'en',
		copyright: `© ${new Date().getUTCFullYear()} ${SITE_NAME}`,
		updated: posts[0] ? new Date(`${posts[0].data.pubDate}T00:00:00Z`) : undefined,
		feedLinks: { rss: absoluteUrl('/rss.xml') },
		author: { name: SITE_NAME, link: SITE_URL, email: profile.email },
	});
	for (const post of posts) {
		const url = absoluteUrl(`/blog/${post.slug}/`);
		feed.addItem({
			title: post.data.title,
			id: url,
			link: url,
			description: post.data.description,
			date: new Date(`${post.data.pubDate}T00:00:00Z`),
			category: post.data.tags.map((name) => ({ name })),
		});
	}
	return new Response(feed.rss2(), { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}
