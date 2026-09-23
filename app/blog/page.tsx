import type { Metadata } from 'next';
import Link from 'next/link';
import { formatDate } from '@/lib/content/dates';
import { getListedPosts } from '@/lib/content/load';

export const metadata: Metadata = {
	title: 'Writing',
	description: 'Engineering notes on RL, GPUs, and LLM systems.',
	alternates: { canonical: '/blog/' },
	openGraph: { url: '/blog/', images: [{ url: '/og/blog.png', width: 1200, height: 630 }] },
};

export default function BlogIndex() {
	const posts = getListedPosts();
	const byYear = Map.groupBy(posts, (p) => p.data.pubDate.slice(0, 4));
	return (
		<div className="mx-auto max-w-4xl px-4 pt-12 sm:px-6 sm:pt-16">
			<header className="mb-14 space-y-4">
				<p className="kicker">writing · {posts.length} posts</p>
				<h1 className="font-display text-5xl font-semibold tracking-tight">Writing</h1>
				<p className="text-xl text-muted">
					Lab notes, mostly. Short on hype; the caveats are in the post, not buried in a footnote.{' '}
					<a className="link" href="/rss.xml">
						RSS
					</a>
				</p>
			</header>
			{[...byYear].map(([year, list]) => (
				<section key={year} aria-labelledby={`y${year}`} className="mb-12">
					<h2 id={`y${year}`} className="kicker mb-3">
						{year}
					</h2>
					<ul className="divide-y divide-rule border-y border-rule">
						{list.map((post) => (
							<li key={post.slug}>
								<Link href={`/blog/${post.slug}/`} className="group grid gap-1 py-6 sm:grid-cols-[7rem_1fr] sm:gap-6">
									<span className="font-mono text-xs text-muted sm:pt-1.5">{formatDate(post.data.pubDate)}</span>
									<span className="space-y-1.5">
										<span className="block font-display text-2xl leading-tight font-semibold group-hover:text-accent-ink">
											{post.data.title}
										</span>
										<span className="block leading-relaxed text-muted">{post.data.description}</span>
										{post.data.tags.length > 0 && (
											<span className="block font-mono text-[0.68rem] text-muted">#{post.data.tags.join(' #')}</span>
										)}
									</span>
								</Link>
							</li>
						))}
					</ul>
				</section>
			))}
		</div>
	);
}
