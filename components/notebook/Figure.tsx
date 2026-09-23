import clsx from 'clsx';
import type { ReactNode } from 'react';

export function Figure({
	n,
	caption,
	children,
	id,
	className,
}: {
	n: string | number;
	caption: ReactNode;
	children: ReactNode;
	id?: string;
	className?: string;
}) {
	return (
		<figure id={id} className={clsx('space-y-3', className)}>
			{children}
			<figcaption className="font-mono text-xs leading-relaxed text-muted">
				<span className="text-ink">fig. {n}</span> — {caption}
			</figcaption>
		</figure>
	);
}
