import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { mdxComponents } from '@/components/mdx/components';
import { CaseStudyLayout } from '@/components/projects/CaseStudyLayout';
import { HonestLimits } from '@/components/projects/HonestLimits';
import { extractHeadings } from '@/lib/content/headings';
import { getCaseStudies, getCaseStudy } from '@/lib/content/load';
import { renderMarkdown } from '@/lib/content/mdx';

export const dynamicParams = false;

export function generateStaticParams() {
	return getCaseStudies().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<'/projects/[slug]'>): Promise<Metadata> {
	const { slug } = await params;
	const project = getCaseStudy(slug);
	if (!project) return {};
	return {
		title: project.data.title,
		description: project.data.tagline,
		alternates: { canonical: `/projects/${slug}/` },
		openGraph: { type: 'article', url: `/projects/${slug}/`, images: [{ url: `/og/projects-${slug}.png`, width: 1200, height: 630 }] },
	};
}

export default async function CaseStudyPage({ params }: PageProps<'/projects/[slug]'>) {
	const { slug } = await params;
	const project = getCaseStudy(slug);
	if (!project) notFound();
	const limits = project.data.honestLimits;
	const content = await renderMarkdown(
		project.body,
		project.format,
		mdxComponents({ HonestLimits: () => <HonestLimits items={limits} /> }),
	);
	return (
		<CaseStudyLayout project={project} headings={extractHeadings(project.body)}>
			{content}
		</CaseStudyLayout>
	);
}
