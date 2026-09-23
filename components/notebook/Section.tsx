import clsx from 'clsx';
import type { ReactNode } from 'react';

export function Section({
	id,
	index,
	title,
	kicker,
	aside,
	children,
	className,
}: {
	id: string;
	index?: string;
	title: ReactNode;
	kicker?: ReactNode;
	aside?: ReactNode;
	children: ReactNode;
	className?: string;
}) {
	return (
		<section id={id} aria-labelledby={`${id}-title`} className={clsx('reveal scroll-mt-24', className)}>
			<header className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-rule pb-4">
				<div className="space-y-2">
					{index && <p className="kicker">§ {index}</p>}
					<h2 id={`${id}-title`} className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
						{title}
					</h2>
					{kicker && <p className="max-w-2xl text-muted">{kicker}</p>}
				</div>
				{aside}
			</header>
			{children}
		</section>
	);
}
