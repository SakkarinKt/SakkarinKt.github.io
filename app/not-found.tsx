import Link from 'next/link';
import { Kbd } from '@/components/notebook/Kbd';

export default function NotFound() {
	return (
		<div className="mx-auto flex max-w-2xl flex-col items-start gap-6 px-4 pt-24 pb-12 sm:px-6">
			<p className="kicker">404 · episode terminated</p>
			<h1 className="font-display text-5xl font-semibold tracking-tight">This cell is a wall.</h1>
			<p className="text-xl leading-snug text-muted">
				The page you were looking for isn’t here. The agent took a wrong turn, and so did this URL.
			</p>
			<p className="text-muted">
				Try <Kbd>⌘</Kbd> <Kbd>K</Kbd> to search, or head back to the start.
			</p>
			<Link href="/" className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper">
				← back to start
			</Link>
		</div>
	);
}
