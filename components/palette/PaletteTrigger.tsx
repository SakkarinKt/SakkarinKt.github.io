'use client';

import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import type { PaletteItem } from '@/lib/palette/types';

const loadPalette = () => import('./CommandPalette');
const CommandPalette = lazy(loadPalette);

function isTyping(target: EventTarget | null): boolean {
	if (!(target instanceof HTMLElement)) return false;
	return target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName);
}

export function PaletteTrigger({ items }: { items: PaletteItem[] }) {
	const [open, setOpen] = useState(false);
	const [wanted, setWanted] = useState(false);

	const show = useCallback(() => {
		setWanted(true);
		setOpen(true);
	}, []);

	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
				e.preventDefault();
				setWanted(true);
				setOpen((o) => !o);
			} else if (e.key === '/' && !isTyping(e.target)) {
				e.preventDefault();
				show();
			}
		};
		const onOpen = () => show();
		window.addEventListener('keydown', onKey);
		window.addEventListener('palette:open', onOpen);
		// Warm the chunk when the browser is idle so the first ⌘K feels instant.
		const idle = 'requestIdleCallback' in window ? window.requestIdleCallback(() => void loadPalette()) : undefined;
		return () => {
			window.removeEventListener('keydown', onKey);
			window.removeEventListener('palette:open', onOpen);
			if (idle !== undefined) window.cancelIdleCallback(idle);
		};
	}, [show]);

	return (
		<>
			<button
				type="button"
				onClick={show}
				onPointerEnter={() => void loadPalette()}
				className="group flex h-9 items-center gap-2 rounded-full border border-rule px-2.5 text-sm text-muted transition-colors hover:border-ink/30 hover:text-ink sm:px-3"
				aria-label="Open command palette"
				aria-keyshortcuts="Meta+K Control+K /"
			>
				<svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
					<circle cx="11" cy="11" r="6.5" />
					<path d="m16 16 4.5 4.5" strokeLinecap="round" />
				</svg>
				<kbd className="hidden font-mono text-[0.7rem] tracking-wide sm:inline">⌘K</kbd>
			</button>
			{wanted && (
				<Suspense fallback={null}>
					<CommandPalette open={open} onOpenChange={setOpen} items={items} />
				</Suspense>
			)}
		</>
	);
}
