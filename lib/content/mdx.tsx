import { evaluate } from '@mdx-js/mdx';
import type { MDXComponents } from 'mdx/types';
import * as runtime from 'react/jsx-runtime';
import rehypePrettyCode, { type Options as PrettyCodeOptions } from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';

const prettyCode: PrettyCodeOptions = {
	theme: { light: 'vitesse-light', dark: 'vitesse-dark' },
	keepBackground: false,
	defaultLang: 'plaintext',
};

/** Compile and render MDX/Markdown at build time (server component only). */
export async function renderMarkdown(source: string, format: 'md' | 'mdx', components: MDXComponents) {
	const { default: Content } = await evaluate(source, {
		...runtime,
		format,
		development: false,
		remarkPlugins: [remarkGfm],
		rehypePlugins: [rehypeSlug, [rehypePrettyCode, prettyCode]],
	});
	return <Content components={components} />;
}
