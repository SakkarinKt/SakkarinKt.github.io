import clsx from 'clsx';
import { EVIDENCE, type Evidence } from '@/lib/content/schema';

// Full class names on purpose: Tailwind can't see interpolated ones.
const EVIDENCE_TONE: Record<Evidence, string> = {
	'null-result': 'border-teal/40 text-teal',
	inconclusive: 'border-amber/50 text-amber',
	preliminary: 'border-amber/50 text-amber',
	'self-check': 'border-rule text-muted',
	synthetic: 'border-rule text-muted',
	measured: 'border-teal/40 text-teal',
	none: 'border-rule text-muted',
};

const DOT_TONE: Record<Evidence, string> = {
	'null-result': 'bg-teal',
	inconclusive: 'bg-amber',
	preliminary: 'bg-amber',
	'self-check': 'bg-muted',
	synthetic: 'bg-muted',
	measured: 'bg-teal',
	none: 'bg-muted',
};

const base = 'inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-0.5 font-mono text-[0.68rem] leading-5';

export function EvidenceChip({ evidence, className }: { evidence: Evidence; className?: string }) {
	return (
		<span className={clsx(base, EVIDENCE_TONE[evidence], className)} title="Strength of evidence behind the numbers">
			<span className={clsx('size-1.5 rounded-full', DOT_TONE[evidence])} aria-hidden />
			evidence: {EVIDENCE[evidence]}
		</span>
	);
}

const STATUS_TONE: Record<string, string> = {
	active: 'border-accent/40 text-accent-ink',
	paused: 'border-rule text-muted',
	shipped: 'border-teal/40 text-teal',
	prototype: 'border-amber/50 text-amber',
	planned: 'border-dashed border-rule text-muted',
};

export function StatusChip({ status, className }: { status: string; className?: string }) {
	return (
		<span className={clsx(base, STATUS_TONE[status] ?? 'border-rule text-muted', className)}>
			{status === 'active' && (
				<span className="relative flex size-1.5" aria-hidden>
					<span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-60 motion-reduce:animate-none" />
					<span className="relative inline-flex size-1.5 rounded-full bg-accent" />
				</span>
			)}
			{status}
		</span>
	);
}

export function Chip({ children, className }: { children: React.ReactNode; className?: string }) {
	return <span className={clsx(base, 'border-rule text-muted', className)}>{children}</span>;
}
