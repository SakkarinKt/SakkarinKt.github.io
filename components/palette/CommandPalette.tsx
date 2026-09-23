'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { Command } from 'cmdk';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { PaletteItem } from '@/lib/palette/types';

const GROUP_ORDER: PaletteItem['group'][] = ['Pages', 'Case studies', 'Lab bench', 'Writing', 'Actions', 'Elsewhere'];

/**
 * Substring ranking instead of cmdk's default subsequence fuzz, which matches almost
 * anything once long hints are in the haystack. keywords[0] is the label.
 */
function rank(_value: string, search: string, keywords?: string[]): number {
	const q = search.trim().toLowerCase();
	if (!q) return 1;
	const label = (keywords?.[0] ?? '').toLowerCase();
	if (label.startsWith(q)) return 1;
	if (label.includes(q)) return 0.8;
	const hay = (keywords ?? []).join(' ').toLowerCase();
	return q.split(/\s+/).every((t) => hay.includes(t)) ? 0.5 : 0;
}

export default function CommandPalette({
	open,
	onOpenChange,
	items,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	items: PaletteItem[];
}) {
	const router = useRouter();
	const { resolvedTheme, setTheme } = useTheme();
	const [toast, setToast] = useState<string | null>(null);

	const run = async (item: PaletteItem) => {
		if (item.action === 'toggle-theme') {
			setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
		} else if (item.action === 'copy-email') {
			try {
				await navigator.clipboard.writeText(item.hint ?? '');
				setToast('Email copied');
				setTimeout(() => setToast(null), 1400);
				return;
			} catch {
				window.open(`mailto:${item.hint}`, '_self');
			}
		} else if (item.action === 'poke-gridworld') {
			onOpenChange(false);
			if (window.location.pathname !== '/') {
				// The demo isn't mounted yet; it checks this flag when it mounts on the home page.
				try {
					sessionStorage.setItem('gridworld:poke', '1');
				} catch {}
				router.push('/#fig-1');
			} else {
				document.getElementById('fig-1')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
				window.dispatchEvent(new CustomEvent('gridworld:poke'));
			}
			return;
		} else if (item.href) {
			if (item.external) window.open(item.href, item.href.startsWith('/') ? '_self' : '_blank', 'noopener');
			else router.push(item.href);
		}
		onOpenChange(false);
	};

	return (
		<Dialog.Root open={open} onOpenChange={onOpenChange}>
			<Dialog.Portal>
				<Dialog.Overlay className="palette-overlay fixed inset-0 z-50 bg-ink/25 backdrop-blur-[2px]" />
				<Dialog.Content
					className="palette-content card fixed left-1/2 top-[12vh] z-50 w-[min(640px,calc(100vw-2rem))] -translate-x-1/2 overflow-hidden bg-raised shadow-2xl shadow-ink/10"
					aria-describedby={undefined}
				>
					<Dialog.Title className="sr-only">Command palette</Dialog.Title>
					<Command label="Command palette" loop filter={rank}>
						<div className="flex items-center gap-3 border-b border-rule px-4">
							<span className="font-mono text-sm text-accent" aria-hidden>
								›
							</span>
							<Command.Input
								autoFocus
								placeholder="Jump to a project, post, or action…"
								className="h-14 w-full bg-transparent text-base text-ink outline-none placeholder:text-muted"
							/>
							<kbd className="rounded border border-rule px-1.5 py-0.5 font-mono text-[0.65rem] text-muted">esc</kbd>
						</div>
						<Command.List className="max-h-[min(60vh,440px)] overflow-y-auto overscroll-contain px-2 pb-2">
							<Command.Empty className="px-4 py-8 text-center text-sm text-muted">
								Nothing matches that keyword.
							</Command.Empty>
							{GROUP_ORDER.map((group) => {
								const groupItems = items.filter((i) => i.group === group);
								if (!groupItems.length) return null;
								return (
									<Command.Group key={group} heading={group}>
										{groupItems.map((item) => (
											<Command.Item
												key={item.id}
												value={item.id}
												keywords={[item.label, ...(item.keywords ?? []), item.hint ?? '']}
												onSelect={() => void run(item)}
												className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm"
											>
												<span className="shrink-0 font-medium text-ink">{item.label}</span>
												{item.hint && <span className="truncate text-xs text-muted">{item.hint}</span>}
												{item.external && (
													<span className="ml-auto font-mono text-[0.65rem] text-muted" aria-hidden>
														↗
													</span>
												)}
											</Command.Item>
										))}
									</Command.Group>
								);
							})}
						</Command.List>
						<div className="flex items-center justify-between border-t border-rule px-4 py-2 font-mono text-[0.68rem] text-muted">
							<span>↑↓ navigate · ↵ open</span>
							<span aria-live="polite">{toast ?? 'keyword search · runs locally'}</span>
						</div>
					</Command>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
}
