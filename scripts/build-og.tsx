/**
 * Renders Open Graph cards to public/og/*.png with satori + resvg.
 * (Next's opengraph-image.tsx emits extension-less files under static export,
 * which GitHub Pages serves with the wrong content type.)
 */
import fs from 'node:fs';
import path from 'node:path';
import { Resvg } from '@resvg/resvg-js';
import satori from 'satori';
import { EVIDENCE } from '../lib/content/schema';
import { getCaseStudies, getPosts } from '../lib/content/load';
import { formatDate } from '../lib/content/dates';

const OUT = path.join(process.cwd(), 'public', 'og');
const font = (pkg: string, file: string) => fs.readFileSync(path.join(process.cwd(), 'node_modules', '@fontsource', pkg, 'files', file));

const fonts = [
	{ name: 'Fraunces', data: font('fraunces', 'fraunces-latin-600-normal.woff'), weight: 600 as const, style: 'normal' as const },
	{ name: 'JetBrains Mono', data: font('jetbrains-mono', 'jetbrains-mono-latin-400-normal.woff'), weight: 400 as const, style: 'normal' as const },
];

const C = { paper: '#faf7f2', ink: '#1e1a16', muted: '#6b6259', rule: '#e3dacd', grid: '#ddd3c4', accent: '#d9481f', teal: '#1f7a70', amber: '#b7791f' };

interface Card {
	key: string;
	kicker: string;
	title: string;
	subtitle?: string;
}

function Glyph() {
	const dots = [];
	for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) dots.push(<circle key={`${r}${c}`} cx={6 + c * 6} cy={6 + r * 6} r="0.9" fill={C.grid} />);
	return (
		<svg width="56" height="56" viewBox="0 0 24 24">
			<rect x="1" y="1" width="22" height="22" rx="6" fill="#f2ece3" stroke={C.rule} />
			{dots}
			<path d="M6 18 L6 12 L12 12 L12 6 L15 6" fill="none" stroke={C.teal} strokeWidth="1.2" strokeDasharray="1.6 1.6" />
			<circle cx="6" cy="18" r="2.6" fill={C.teal} />
			<circle cx="18" cy="6" r="2.9" fill="none" stroke={C.accent} strokeWidth="1.6" />
		</svg>
	);
}

function render(card: Card) {
	return (
		<div
			style={{
				width: 1200,
				height: 630,
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'space-between',
				padding: '64px 72px',
				backgroundColor: C.paper,
				backgroundImage: `radial-gradient(${C.grid} 1.4px, transparent 1.6px)`,
				backgroundSize: '28px 28px',
				color: C.ink,
			}}
		>
			<div style={{ display: 'flex', fontFamily: 'JetBrains Mono', fontSize: 22, color: C.muted, letterSpacing: 2, textTransform: 'uppercase' }}>
				{card.kicker}
			</div>
			<div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
				<div style={{ display: 'flex', fontFamily: 'Fraunces', fontSize: card.title.length > 48 ? 58 : 72, lineHeight: 1.05, letterSpacing: -1.5 }}>
					{card.title}
				</div>
				{card.subtitle && (
					<div style={{ display: 'flex', fontFamily: 'JetBrains Mono', fontSize: 26, lineHeight: 1.4, color: C.muted, maxWidth: 1000 }}>
						{card.subtitle}
					</div>
				)}
			</div>
			<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
				<div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
					<Glyph />
					<div style={{ display: 'flex', fontFamily: 'Fraunces', fontSize: 30 }}>Sakkarin Krarat</div>
				</div>
				<div style={{ display: 'flex', fontFamily: 'JetBrains Mono', fontSize: 22, color: C.accent }}>sakkarinkt.github.io</div>
			</div>
		</div>
	);
}

function clip(s: string, n: number) {
	return s.length > n ? `${s.slice(0, n - 1).trimEnd()}…` : s;
}

async function main() {
	fs.mkdirSync(OUT, { recursive: true });
	const cards: Card[] = [
		{ key: 'home', kicker: 'AI/ML engineer · Taipei', title: 'I teach machines to make decisions — and measure whether they did.', subtitle: 'RL · world models · agentic LLM systems' },
		{ key: 'projects', kicker: 'work · evidence-labelled', title: 'Case studies, lab bench, and what’s next', subtitle: 'Every metric shows its n. Every case study lists its limits.' },
		{ key: 'about', kicker: 'about', title: 'Applied math, turned into software you can measure.', subtitle: 'Actuarial science → RL master’s → AI engineering' },
		{ key: 'blog', kicker: 'writing', title: 'Lab notes on RL, GPUs, and LLM systems' },
	];
	for (const s of getCaseStudies()) {
		cards.push({ key: `projects-${s.slug}`, kicker: `case study · evidence: ${EVIDENCE[s.data.evidence]}`, title: s.data.title, subtitle: clip(s.data.tagline, 160) });
	}
	for (const p of getPosts()) {
		cards.push({ key: `blog-${p.slug}`, kicker: `writing · ${formatDate(p.data.pubDate)}`, title: p.data.title, subtitle: clip(p.data.description, 160) });
	}

	await Promise.all(
		cards.map(async (card) => {
			const svg = await satori(render(card), { width: 1200, height: 630, fonts });
			const png = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();
			fs.writeFileSync(path.join(OUT, `${card.key}.png`), png);
		}),
	);
	console.log(`✓ ${cards.length} OG cards → public/og/`);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
