'use client';

import { AnimatePresence, LazyMotion, MotionConfig, domAnimation, m } from 'motion/react';
import { useEffect, useState } from 'react';

/** Cycles สวัสดี → 你好 → Hi on its own line, so the name below never reflows. Decorative. */
export function Greeting({ words }: { words: readonly string[] }) {
	const [i, setI] = useState(words.length - 1);

	useEffect(() => {
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		const id = window.setInterval(() => setI((n) => (n + 1) % words.length), 2600);
		return () => window.clearInterval(id);
	}, [words.length]);

	return (
		<LazyMotion features={domAnimation} strict>
			<MotionConfig reducedMotion="user">
				<span className="relative inline-grid h-[1.3em] overflow-hidden align-bottom">
					<AnimatePresence mode="popLayout" initial={false}>
						<m.span
							key={words[i]}
							initial={{ y: '0.45em', opacity: 0, filter: 'blur(4px)' }}
							animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
							exit={{ y: '-0.45em', opacity: 0, filter: 'blur(4px)' }}
							transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
							className="text-accent"
						>
							{words[i]}
							<span className="text-muted"> —</span>
						</m.span>
					</AnimatePresence>
				</span>
			</MotionConfig>
		</LazyMotion>
	);
}
