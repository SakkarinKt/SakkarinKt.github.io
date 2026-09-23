import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { mdxComponents } from '@/components/mdx/components';
import { formatDate } from '@/lib/content/dates';
import { getPost, getPosts } from '@/lib/content/load';
import { renderMarkdown } from '@/lib/content/mdx';
import { profile } from '@/content/data/profile';

export const dynamicParams = false;

export function generateStaticParams() {
	return getPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<'/blog/[slug]'>): Promise<Metadata> {
	const { slug } = await params;
	const post = getPost(slug);
	if (!post) return {};
	return {
		title: post.data.title,
		description: post.data.description,
		alternates: { canonical: `/blog/${slug}/` },
		robots: post.data.archived ? { index: false } : undefined,
		openGraph: {
			type: 'article',
			url: `/blog/${slug}/`,
			publishedTime: post.data.pubDate,
			modifiedTime: post.data.updatedDate,
			tags: post.data.tags,
			images: [{ url: `/og/blog-${slug}.png`, width: 1200, height: 630 }],
		},
	};
}

export default async function PostPage({ params }: PageProps<'/blog/[slug]'>) {
	const { slug } = await params;
	const post = getPost(slug);
	if (!post) notFound();
	const { data } = post;
	const content = await renderMarkdown(post.body, post.format, mdxComponents());
	return (
		<article className="mx-auto max-w-3xl px-4 pt-10 sm:px-6 sm:pt-14">
			<nav aria-label="Breadcrumb" className="mb-8 font-mono text-xs text-muted">
				<Link href="/blog/" className="hover:text-ink">
					writing
				</Link>{' '}
				/ {slug}
			</nav>
			<header className="mb-10 space-y-4 border-b border-rule pb-8">
				<p className="font-mono text-xs text-muted">
					<time dateTime={data.pubDate}>{formatDate(data.pubDate)}</time>
					{data.updatedDate && (
						<>
							{' '}· updated <time dateTime={data.updatedDate}>{formatDate(data.updatedDate)}</time>
						</>
					)}
					{' '}· {profile.name}
				</p>
				<h1 className="font-display text-4xl leading-tight font-semibold tracking-tight sm:text-5xl">{data.title}</h1>
				<p className="text-xl leading-snug text-muted">{data.description}</p>
				{data.tags.length > 0 && <p className="font-mono text-xs text-muted">#{data.tags.join(' #')}</p>}
			</header>
			{data.editorNote && (
				<aside className="mb-10 rounded-xl border border-dashed border-amber/60 bg-amber/5 p-5">
					<p className="kicker mb-2 !text-amber">editor’s note</p>
					<p className="leading-relaxed">{data.editorNote}</p>
				</aside>
			)}
			<div className="prose prose-lg">{content}</div>
			<footer className="mt-16 border-t border-rule pt-8 text-muted">
				<Link href="/blog/" className="link">
					← all writing
				</Link>
			</footer>
		</article>
	);
}
