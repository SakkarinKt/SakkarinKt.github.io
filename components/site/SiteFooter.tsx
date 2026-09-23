import { profile } from '@/content/data/profile';
import { SOURCE_REPO } from '@/lib/site';

export function SiteFooter() {
	const sha = process.env.NEXT_PUBLIC_BUILD_SHA ?? 'local';
	const date = process.env.NEXT_PUBLIC_BUILD_DATE ?? '';
	return (
		<footer className="mt-24 border-t border-rule">
			<div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 text-sm text-muted sm:px-6 md:grid-cols-[1fr_auto] md:items-end">
				<div className="space-y-2">
					<p className="font-display text-base text-ink">Built with Next.js, Tailwind, and a Q-table.</p>
					<p>
						Static export on GitHub Pages. No trackers, no cookies. The gridworld on the home page is learning in
						your browser, not replaying a video.
					</p>
				</div>
				<ul className="flex flex-wrap gap-x-5 gap-y-2 font-mono text-xs">
					<li>
						<a className="hover:text-ink" href={profile.github} rel="me noopener" target="_blank">
							GitHub
						</a>
					</li>
					<li>
						<a className="hover:text-ink" href={profile.linkedin} rel="me noopener" target="_blank">
							LinkedIn
						</a>
					</li>
					<li>
						<a className="hover:text-ink" href="/rss.xml">
							RSS
						</a>
					</li>
					<li>
						<a className="hover:text-ink" href={SOURCE_REPO} target="_blank" rel="noopener">
							source · {sha}
						</a>
					</li>
					<li aria-label="Build date">{date}</li>
				</ul>
			</div>
		</footer>
	);
}
