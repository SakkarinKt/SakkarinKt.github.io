export function HonestLimits({ items }: { items: string[] }) {
	return (
		<aside aria-labelledby="honest-limits" className="not-prose my-8 rounded-xl border border-dashed border-amber/60 bg-amber/5 p-5">
			<p id="honest-limits" className="kicker mb-3 !text-amber">
				Honest limits · what these numbers don’t show
			</p>
			<ul className="space-y-2 text-[0.95rem] leading-relaxed">
				{items.map((item) => (
					<li key={item} className="flex gap-3">
						<span className="mt-[0.55em] size-1.5 shrink-0 rounded-full bg-amber" aria-hidden />
						<span>{item}</span>
					</li>
				))}
			</ul>
		</aside>
	);
}
