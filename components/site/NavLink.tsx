'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

export function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
	const pathname = usePathname() ?? '/';
	const active = pathname === href || (href !== '/' && pathname.startsWith(href));
	return (
		<Link
			href={href}
			aria-current={active ? 'page' : undefined}
			className={clsx(
				'rounded-full px-2.5 py-1.5 text-sm transition-colors sm:px-3',
				active ? 'bg-surface text-ink' : 'text-muted hover:text-ink',
			)}
		>
			{children}
		</Link>
	);
}
