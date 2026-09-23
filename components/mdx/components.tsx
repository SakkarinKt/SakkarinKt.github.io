import type { MDXComponents } from 'mdx/types';
import Link from 'next/link';
import type { ComponentProps } from 'react';
import { Diagram } from '@/components/diagram/Diagram';
import { Kbd } from '@/components/notebook/Kbd';

function A({ href = '', children, ...rest }: ComponentProps<'a'>) {
	if (href.startsWith('/') || href.startsWith('#')) {
		return (
			<Link href={href} {...rest}>
				{children}
			</Link>
		);
	}
	return (
		<a href={href} target="_blank" rel="noopener" {...rest}>
			{children}
		</a>
	);
}

function Table(props: ComponentProps<'table'>) {
	return (
		<div className="not-prose my-6 overflow-x-auto rounded-xl border border-rule">
			<table className="w-full min-w-[520px] border-collapse text-left text-sm [&_td]:border-t [&_td]:border-rule [&_td]:px-4 [&_td]:py-2.5 [&_th]:px-4 [&_th]:py-2.5 [&_th]:font-mono [&_th]:text-[0.68rem] [&_th]:font-medium [&_th]:tracking-wider [&_th]:text-muted [&_th]:uppercase [&_thead]:bg-surface" {...props} />
		</div>
	);
}

export function mdxComponents(extra: MDXComponents = {}): MDXComponents {
	return { a: A, table: Table, Diagram, Kbd, ...extra };
}
