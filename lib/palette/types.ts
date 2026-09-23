export type PaletteAction = 'toggle-theme' | 'copy-email' | 'poke-gridworld';

export interface PaletteItem {
	id: string;
	group: 'Pages' | 'Case studies' | 'Lab bench' | 'Writing' | 'Actions' | 'Elsewhere';
	label: string;
	hint?: string;
	keywords?: string[];
	href?: string;
	external?: boolean;
	action?: PaletteAction;
}
