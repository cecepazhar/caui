// CA Design System (CAUI) - Svelte 5 Library
export * from './components/ui/index.js';
export * from './components/templates/index.js';
export { default as PageHeader, type PageHeaderAccent } from './components/PageHeader.svelte';
export * from './i18n.svelte';
export * from './theme';
import './tokens/tokens.css';

// Shared type vocabulary
export type {
	ComponentVariant,
	ComponentSize,
	ComponentState,
	StatusVariant,
	BaseComponentProps
} from './components/ui/types';

// Accessibility utilities
export { focusTrap, clickOutside, uid } from './utils/a11y';

// Color palette data
export {
	DEFAULT_COLOR_PRESETS,
	ACCENT_SWATCHES,
	type ColorPreset,
	type AccentSwatch
} from './tokens/palettes';
