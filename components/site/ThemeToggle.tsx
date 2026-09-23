'use client';

import { useTheme } from 'next-themes';
import { useSyncExternalStore } from 'react';

const noop = () => () => {};

export function ThemeToggle() {
	const { resolvedTheme, setTheme } = useTheme();
	// True only on the client, so the icon never mismatches the server render.
	const mounted = useSyncExternalStore(noop, () => true, () => false);
	const dark = mounted && resolvedTheme === 'dark';

	return (
		<button
			type="button"
			onClick={() => setTheme(dark ? 'light' : 'dark')}
			className="grid size-9 place-items-center rounded-full border border-rule text-muted transition-colors hover:border-ink/30 hover:text-ink"
			aria-label={mounted ? `Switch to ${dark ? 'light' : 'dark'} theme` : 'Toggle theme'}
			title="Toggle theme"
		>
			{mounted ? (
				dark ? (
					<svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
						<circle cx="12" cy="12" r="4.2" />
						<path d="M12 2.5v2.2M12 19.3v2.2M4.6 4.6l1.6 1.6M17.8 17.8l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.6 19.4l1.6-1.6M17.8 6.2l1.6-1.6" strokeLinecap="round" />
					</svg>
				) : (
					<svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
						<path d="M20.5 14.2A8.5 8.5 0 1 1 9.8 3.5a6.8 6.8 0 0 0 10.7 10.7Z" strokeLinejoin="round" />
					</svg>
				)
			) : (
				<span className="size-4" />
			)}
		</button>
	);
}
