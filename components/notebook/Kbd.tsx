export function Kbd({ children }: { children: React.ReactNode }) {
	return (
		<kbd className="rounded-md border border-rule bg-surface px-1.5 py-0.5 font-mono text-[0.75em] text-ink shadow-[0_1px_0_var(--rule)]">
			{children}
		</kbd>
	);
}
