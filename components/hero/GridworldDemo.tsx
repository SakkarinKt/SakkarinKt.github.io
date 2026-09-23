'use client';

import clsx from 'clsx';
import { useTheme } from 'next-themes';
import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from 'react';
import { lerp3, normalizeValues, type RGB } from '@/lib/rl/colormap';
import { ACTIONS } from '@/lib/rl/gridworld';
import { PRESETS, sMaze } from '@/lib/rl/presets';
import { Trainer, type TrainerStats } from '@/lib/rl/trainer';
import { Sparkline } from './Sparkline';

const SPEEDS = [
	{ label: '1×', steps: 1 },
	{ label: '4×', steps: 4 },
	{ label: '40×', steps: 40 },
	{ label: 'max', steps: 20000 },
] as const;
const FRAME_BUDGET_MS = 4;
const TRAIL = 12;

interface Palette {
	heat: [RGB, RGB, RGB];
	wall: string;
	ink: string;
	teal: string;
	accent: string;
	muted: string;
	paper: string;
	raised: string;
}

function hexToRgb(hex: string): RGB {
	const h = hex.trim().replace('#', '');
	const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
	const n = parseInt(full, 16);
	return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function readPalette(): Palette {
	const css = getComputedStyle(document.documentElement);
	const v = (name: string) => css.getPropertyValue(name).trim();
	return {
		heat: [hexToRgb(v('--heat-0')), hexToRgb(v('--heat-1')), hexToRgb(v('--heat-2'))],
		wall: v('--wall'),
		ink: v('--ink'),
		teal: v('--teal'),
		accent: v('--accent'),
		muted: v('--muted'),
		paper: v('--paper'),
		raised: v('--raised'),
	};
}

const REDUCED = '(prefers-reduced-motion: reduce)';
function subscribeReduced(cb: () => void) {
	const mq = window.matchMedia(REDUCED);
	mq.addEventListener('change', cb);
	return () => mq.removeEventListener('change', cb);
}

export function GridworldDemo({ children }: { children: ReactNode }) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const wrapRef = useRef<HTMLDivElement>(null);
	const trainerRef = useRef<Trainer | null>(null);
	const trailRef = useRef<number[]>([]);
	const paletteRef = useRef<Palette | null>(null);
	const inViewRef = useRef(false);
	const dirtyRef = useRef(true);
	const presetRef = useRef(0);
	const dragRef = useRef<{ mode: 'paint' | 'goal' | 'tap'; paint: boolean; x: number; y: number } | null>(null);

	// Autoplay unless the visitor prefers reduced motion; an explicit play/pause always wins.
	const reduced = useSyncExternalStore(subscribeReduced, () => window.matchMedia(REDUCED).matches, () => true);
	const [override, setOverride] = useState<boolean | null>(null);
	const playing = override ?? !reduced;
	const setPlaying = useCallback((next: boolean) => setOverride(next), []);
	const [ready, setReady] = useState(false);
	const [speed, setSpeed] = useState(2);
	const [arrows, setArrows] = useState(false);
	const [tool, setTool] = useState<'wall' | 'goal'>('wall');
	const [cursor, setCursor] = useState<number | null>(null);
	const [stats, setStats] = useState<TrainerStats | null>(null);
	const [history, setHistory] = useState<number[]>([]);
	const [announce, setAnnounce] = useState('');
	const { resolvedTheme } = useTheme();

	// The frame loop reads these through refs so it never has to restart.
	const cursorRef = useRef(cursor);
	const arrowsRef = useRef(arrows);
	const speedRef = useRef(speed);
	const playingRef = useRef(playing);
	useEffect(() => {
		cursorRef.current = cursor;
		arrowsRef.current = arrows;
		speedRef.current = speed;
		playingRef.current = playing;
		dirtyRef.current = true;
	}, [cursor, arrows, speed, playing]);

	const touchedRef = useRef(false);

	// Only ever called from effects and handlers, so window is available.
	const trainer = () => {
		if (!trainerRef.current) {
			const t = new Trainer(sMaze(), 42);
			// Reduced motion: start from the same converged policy as the static figure.
			if (window.matchMedia(REDUCED).matches) t.runEpisodes(600);
			trainerRef.current = t;
		}
		return trainerRef.current;
	};

	useEffect(() => {
		paletteRef.current = readPalette();
		dirtyRef.current = true;
	}, [resolvedTheme]);

	const draw = useCallback(() => {
		const canvas = canvasRef.current;
		const pal = paletteRef.current;
		if (!canvas || !pal) return;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;
		const t = trainer();
		const env = t.env;
		const W = canvas.width;
		const H = canvas.height;
		const cw = W / env.w;
		const ch = H / env.h;
		const gap = Math.max(1, cw * 0.06);
		const v = normalizeValues(t.agent.values(), env.walls);

		// Opaque background so the server-rendered figure underneath never shows through the gaps.
		ctx.fillStyle = pal.raised;
		ctx.fillRect(0, 0, W, H);
		for (let i = 0; i < env.size; i++) {
			const [x, y] = env.xy(i);
			if (env.walls[i]) {
				ctx.fillStyle = pal.wall;
			} else {
				const [r, g, b] = lerp3(pal.heat, v[i]!);
				ctx.fillStyle = `rgb(${r | 0},${g | 0},${b | 0})`;
			}
			ctx.beginPath();
			ctx.roundRect(x * cw + gap / 2, y * ch + gap / 2, cw - gap, ch - gap, cw * 0.16);
			ctx.fill();
		}

		if (arrowsRef.current) {
			ctx.strokeStyle = pal.ink;
			ctx.globalAlpha = 0.45;
			ctx.lineWidth = Math.max(1, cw * 0.05);
			for (let i = 0; i < env.size; i++) {
				if (env.walls[i] || i === env.goal) continue;
				const [x, y] = env.xy(i);
				const [dx, dy] = ACTIONS[t.agent.greedy(i)]!;
				const cx = (x + 0.5) * cw;
				const cy = (y + 0.5) * ch;
				const len = cw * 0.22;
				const tx = cx + dx * len;
				const ty = cy + dy * len;
				// Arrowhead wings: back along the direction, out along the perpendicular (-dy, dx).
				const bx = tx - dx * len * 0.6;
				const by = ty - dy * len * 0.6;
				ctx.beginPath();
				ctx.moveTo(cx - dx * len, cy - dy * len);
				ctx.lineTo(tx, ty);
				ctx.moveTo(bx - dy * len * 0.45, by + dx * len * 0.45);
				ctx.lineTo(tx, ty);
				ctx.lineTo(bx + dy * len * 0.45, by - dx * len * 0.45);
				ctx.stroke();
			}
			ctx.globalAlpha = 1;
		}

		// Goal ring
		const [gx, gy] = env.xy(env.goal);
		ctx.strokeStyle = pal.ink;
		ctx.lineWidth = Math.max(1.5, cw * 0.09);
		ctx.beginPath();
		ctx.arc((gx + 0.5) * cw, (gy + 0.5) * ch, cw * 0.28, 0, Math.PI * 2);
		ctx.stroke();

		// Trail + agent
		const trail = trailRef.current;
		trail.forEach((c, k) => {
			const [x, y] = env.xy(c);
			ctx.globalAlpha = ((k + 1) / trail.length) * 0.35;
			ctx.fillStyle = pal.teal;
			ctx.beginPath();
			ctx.arc((x + 0.5) * cw, (y + 0.5) * ch, cw * 0.14, 0, Math.PI * 2);
			ctx.fill();
		});
		ctx.globalAlpha = 1;
		const [ax, ay] = env.xy(env.state);
		ctx.fillStyle = pal.teal;
		ctx.beginPath();
		ctx.arc((ax + 0.5) * cw, (ay + 0.5) * ch, cw * 0.24, 0, Math.PI * 2);
		ctx.fill();
		ctx.strokeStyle = pal.paper;
		ctx.lineWidth = Math.max(1, cw * 0.05);
		ctx.stroke();

		const cur = cursorRef.current;
		if (cur !== null) {
			const [x, y] = env.xy(cur);
			ctx.strokeStyle = pal.accent;
			ctx.lineWidth = Math.max(2, cw * 0.08);
			ctx.strokeRect(x * cw + gap, y * ch + gap, cw - gap * 2, ch - gap * 2);
		}
	}, []);

	// Size the backing store to the element × devicePixelRatio (capped at 2).
	useEffect(() => {
		const wrap = wrapRef.current;
		const canvas = canvasRef.current;
		if (!wrap || !canvas) return;
		const ro = new ResizeObserver(([entry]) => {
			if (!entry) return;
			const dpr = Math.min(window.devicePixelRatio || 1, 2);
			canvas.width = Math.round(entry.contentRect.width * dpr);
			canvas.height = Math.round(entry.contentRect.height * dpr);
			dirtyRef.current = true;
		});
		ro.observe(wrap);
		const io = new IntersectionObserver(([entry]) => {
			inViewRef.current = Boolean(entry?.isIntersecting);
		});
		io.observe(wrap);
		return () => {
			ro.disconnect();
			io.disconnect();
		};
	}, []);

	// Frame loop: only steps while playing, on screen, and the tab is visible.
	useEffect(() => {
		let raf = 0;
		const frame = () => {
			raf = requestAnimationFrame(frame);
			if (!inViewRef.current || document.hidden) return;
			const t = trainer();
			if (playingRef.current) {
				const cap = SPEEDS[speedRef.current]!.steps;
				// Once the policy is optimal, cruise at 1× unless asked for max.
				const steps = t.converged && cap < 1000 ? 1 : cap;
				const before = t.totalSteps;
				t.runFor(FRAME_BUDGET_MS, steps);
				if (steps <= 40) {
					const trail = trailRef.current;
					trail.push(t.env.state);
					if (trail.length > TRAIL) trail.shift();
				} else {
					trailRef.current = [];
				}
				if (t.totalSteps !== before) dirtyRef.current = true;
			}
			// Keep the server-rendered figure until something actually moves or the visitor interacts.
			if (dirtyRef.current && (playingRef.current || touchedRef.current)) {
				dirtyRef.current = false;
				draw();
				setReady(true);
			}
		};
		raf = requestAnimationFrame(frame);
		return () => cancelAnimationFrame(raf);
	}, [draw]);

	// Stats for the caption and sparkline: twice a second, never per frame.
	useEffect(() => {
		const tick = () => {
			const t = trainer();
			setStats(t.stats());
			setHistory(t.recentHistory());
		};
		tick();
		const id = window.setInterval(tick, 500);
		return () => window.clearInterval(id);
	}, []);

	const edited = useCallback((message?: string) => {
		touchedRef.current = true;
		trainer().onGridEdited();
		trailRef.current = [];
		dirtyRef.current = true;
		if (message) setAnnounce(message);
	}, []);

	const poke = useCallback(() => {
		presetRef.current = (presetRef.current + 1) % PRESETS.length;
		trainer().loadSpec(PRESETS[presetRef.current]!());
		edited('New maze loaded; the agent keeps its old Q-table and has to unlearn it.');
		setPlaying(true);
	}, [edited, setPlaying]);

	useEffect(() => {
		const onPoke = () => poke();
		window.addEventListener('gridworld:poke', onPoke);
		// Arrived here from the palette on another page: poke on the first frame.
		let raf = 0;
		try {
			if (sessionStorage.getItem('gridworld:poke')) {
				sessionStorage.removeItem('gridworld:poke');
				raf = requestAnimationFrame(onPoke);
			}
		} catch {}
		return () => {
			cancelAnimationFrame(raf);
			window.removeEventListener('gridworld:poke', onPoke);
		};
	}, [poke]);

	const cellAt = (e: React.PointerEvent<HTMLCanvasElement>): number => {
		const rect = e.currentTarget.getBoundingClientRect();
		const env = trainer().env;
		const x = Math.min(env.w - 1, Math.max(0, Math.floor(((e.clientX - rect.left) / rect.width) * env.w)));
		const y = Math.min(env.h - 1, Math.max(0, Math.floor(((e.clientY - rect.top) / rect.height) * env.h)));
		return env.cell(x, y);
	};

	const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
		touchedRef.current = true;
		const env = trainer().env;
		const c = cellAt(e);
		if (e.pointerType === 'touch') {
			dragRef.current = { mode: 'tap', paint: false, x: e.clientX, y: e.clientY };
			return;
		}
		e.currentTarget.setPointerCapture(e.pointerId);
		if (c === env.goal) {
			dragRef.current = { mode: 'goal', paint: false, x: e.clientX, y: e.clientY };
		} else {
			const paint = !env.walls[c];
			dragRef.current = { mode: 'paint', paint, x: e.clientX, y: e.clientY };
			if (env.setWall(c, paint)) edited();
		}
	};

	const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
		const drag = dragRef.current;
		if (!drag || drag.mode === 'tap') return;
		const env = trainer().env;
		const c = cellAt(e);
		if (drag.mode === 'goal') {
			if (env.setGoal(c)) edited();
		} else if (env.setWall(c, drag.paint)) {
			edited();
		}
	};

	const onPointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
		const drag = dragRef.current;
		dragRef.current = null;
		if (!drag) return;
		if (drag.mode === 'tap' && Math.hypot(e.clientX - drag.x, e.clientY - drag.y) < 10) {
			const env = trainer().env;
			const c = cellAt(e);
			if (tool === 'goal' ? env.setGoal(c) : env.toggleWall(c)) edited();
		} else if (drag.mode !== 'tap') {
			setAnnounce(drag.mode === 'goal' ? 'Goal moved; the agent is re-learning.' : 'Walls changed; the agent is re-learning.');
		}
	};

	const onKeyDown = (e: React.KeyboardEvent<HTMLCanvasElement>) => {
		touchedRef.current = true;
		const env = trainer().env;
		const cur = cursor ?? env.start;
		const [x, y] = env.xy(cur);
		const move: Record<string, [number, number]> = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0] };
		const key = e.key;
		if (key in move) {
			e.preventDefault();
			const [dx, dy] = move[key]!;
			setCursor(env.cell(Math.min(env.w - 1, Math.max(0, x + dx)), Math.min(env.h - 1, Math.max(0, y + dy))));
			dirtyRef.current = true;
		} else if (key === ' ' || key === 'Enter') {
			e.preventDefault();
			if (env.toggleWall(cur)) edited(env.walls[cur] ? 'Wall added.' : 'Wall removed.');
		} else if (key === 'g') {
			if (env.setGoal(cur)) edited('Goal moved.');
		} else if (key === 'p') {
			setPlaying(!playing);
		} else if (key === 'r') {
			trainer().resetLearning();
			edited('Q-table reset to zero.');
		} else if (key === 'n') {
			poke();
		}
	};

	const optimal = stats?.optimal ?? null;
	const statusChip = !stats
		? null
		: optimal === null
			? { text: 'goal unreachable — agent will wander', tone: 'text-accent-ink border-accent/40' }
			: stats.converged
				? { text: 'policy optimal', tone: 'text-teal border-teal/40' }
				: { text: 'learning…', tone: 'text-amber border-amber/50' };

	const btn = 'rounded-full border border-rule px-3 py-1 font-mono text-[0.7rem] text-muted transition-colors hover:border-ink/30 hover:text-ink aria-pressed:border-ink/40 aria-pressed:bg-surface aria-pressed:text-ink';

	return (
		<div className="space-y-3">
			<div ref={wrapRef} className="card relative aspect-[3/2] overflow-hidden p-0">
				<div className={clsx('absolute inset-0 transition-opacity duration-500', ready && 'opacity-0')} aria-hidden={ready}>
					{children}
				</div>
				<canvas
					ref={canvasRef}
					tabIndex={0}
					role="img"
					aria-label="Interactive gridworld. A tabular Q-learning agent learns a path from the bottom-left start to the ring-shaped goal. Arrow keys move a cursor, space toggles a wall, G moves the goal, P pauses, R resets, N loads a new maze."
					aria-roledescription="interactive reinforcement-learning demo"
					onPointerDown={onPointerDown}
					onPointerMove={onPointerMove}
					onPointerUp={onPointerUp}
					onPointerCancel={() => (dragRef.current = null)}
					onKeyDown={onKeyDown}
					onFocus={() => setCursor((c) => c ?? trainer().env.start)}
					onBlur={() => {
						setCursor(null);
						dirtyRef.current = true;
					}}
					className={clsx(
						'absolute inset-0 h-full w-full cursor-crosshair touch-pan-y transition-opacity duration-500',
						ready ? 'opacity-100' : 'opacity-0',
					)}
				/>
				<p className="sr-only" aria-live="polite">
					{announce}
				</p>
			</div>

			<div className="flex flex-wrap items-center gap-2">
				<button type="button" className={btn} onClick={() => setPlaying(!playing)} aria-pressed={playing}>
					{playing ? '❚❚ pause' : '▶ run'}
				</button>
				<div className="flex overflow-hidden rounded-full border border-rule" role="group" aria-label="Speed">
					{SPEEDS.map((s, i) => (
						<button
							key={s.label}
							type="button"
							onClick={() => setSpeed(i)}
							aria-pressed={speed === i}
							className="px-2.5 py-1 font-mono text-[0.7rem] text-muted transition-colors hover:text-ink aria-pressed:bg-surface aria-pressed:text-ink"
						>
							{s.label}
						</button>
					))}
				</div>
				<button type="button" className={btn} onClick={() => setArrows((a) => !a)} aria-pressed={arrows}>
					policy ↗
				</button>
				<button type="button" className={btn} onClick={poke}>
					new maze
				</button>
				<button
					type="button"
					className={btn}
					onClick={() => {
						trainer().resetLearning();
						edited('Q-table reset to zero.');
					}}
				>
					reset Q
				</button>
				<div className="flex overflow-hidden rounded-full border border-rule [@media(pointer:fine)]:hidden" role="group" aria-label="Tap tool">
					{(['wall', 'goal'] as const).map((t) => (
						<button
							key={t}
							type="button"
							onClick={() => setTool(t)}
							aria-pressed={tool === t}
							className="px-2.5 py-1 font-mono text-[0.7rem] text-muted aria-pressed:bg-surface aria-pressed:text-ink"
						>
							tap: {t}
						</button>
					))}
				</div>
				<div className="ml-auto hidden sm:block">
					<Sparkline values={history} optimal={optimal} />
				</div>
			</div>
			<p className="font-mono text-xs leading-relaxed text-muted">
				<span className="text-ink">fig. 1</span> — tabular Q-learning, live in your browser · 12×8 · α .5 · γ .95
				{stats && (
					<>
						{' '}· ε {stats.eps.toFixed(2)} · episode {stats.episode} · last {stats.lastSteps || '—'} steps
						{optimal !== null && <> (optimal {optimal})</>}
					</>
				)}
				<span className="hidden [@media(pointer:fine)]:inline">
					{' '}· click/drag to draw walls, drag ◎ to move the goal
				</span>
				{statusChip && (
					<span className={clsx('ml-2 inline-block rounded-full border px-2 py-px', statusChip.tone)}>{statusChip.text}</span>
				)}
			</p>
		</div>
	);
}
