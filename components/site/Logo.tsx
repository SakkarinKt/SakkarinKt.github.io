/** 3×3 gridworld glyph: teal agent, persimmon goal. Doubles as the favicon. */
export function LogoMark({ className = 'size-7' }: { className?: string }) {
	return (
		<svg viewBox="0 0 24 24" className={className} aria-hidden>
			<rect x="1" y="1" width="22" height="22" rx="6" fill="var(--surface)" stroke="var(--rule)" />
			{[0, 1, 2].map((r) =>
				[0, 1, 2].map((c) => (
					<circle key={`${r}${c}`} cx={6 + c * 6} cy={6 + r * 6} r="0.9" fill="var(--grid)" />
				)),
			)}
			<circle cx="6" cy="18" r="2.6" fill="var(--teal)" />
			<circle cx="18" cy="6" r="2.9" fill="none" stroke="var(--accent)" strokeWidth="1.6" />
			<path d="M6 18 L6 12 L12 12 L12 6 L15 6" fill="none" stroke="var(--teal)" strokeWidth="1.2" strokeDasharray="1.6 1.6" strokeLinecap="round" />
		</svg>
	);
}
