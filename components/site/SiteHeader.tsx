import Link from 'next/link';
import { NAV } from '@/lib/site';
import { LogoMark } from './Logo';
import { NavLink } from './NavLink';
import { ThemeToggle } from './ThemeToggle';
import { PaletteTrigger } from '@/components/palette/PaletteTrigger';
import type { PaletteItem } from '@/lib/palette/types';

export function SiteHeader({ paletteItems }: { paletteItems: PaletteItem[] }) {
	return (
		<header className="sticky top-0 z-40 border-b border-rule/70 bg-paper/80 backdrop-blur-md">
			<div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:px-6">
				<Link href="/" className="group flex items-center gap-2.5 font-display text-[1.05rem] font-semibold tracking-tight">
					<LogoMark className="size-7 transition-transform group-hover:-rotate-6" />
					<span className="hidden sm:inline">Sakkarin Krarat</span>
				</Link>
				<nav aria-label="Primary" className="ml-auto flex items-center sm:gap-1">
					{NAV.map((item) => (
						<NavLink key={item.href} href={item.href}>
							{item.label}
						</NavLink>
					))}
				</nav>
				<div className="flex items-center gap-1.5 sm:ml-2 sm:gap-2">
					<PaletteTrigger items={paletteItems} />
					<ThemeToggle />
				</div>
			</div>
		</header>
	);
}
