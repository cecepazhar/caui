<script lang="ts">
  export interface AmbientPreset {
    name: string;
    hex: string;
  }

  interface Props {
    appName?: string;
    enabled?: boolean;
    isPro?: boolean;
    accentColor?: string;
    mode?: 'solid' | 'breathe' | 'pulse' | 'rgb_cycle';
    presets?: AmbientPreset[];
    onchange?: (config: { enabled: boolean; accentColor: string; mode: string }) => void;
    class?: string;
  }

  const DEFAULT_PRESETS: AmbientPreset[] = [
    { name: 'Crimson Red', hex: '#ef4444' },
    { name: 'Cyan Blue', hex: '#06b6d4' },
    { name: 'Emerald Green', hex: '#10b981' },
    { name: 'Royal Indigo', hex: '#6366f1' },
    { name: 'Amber Gold', hex: '#f59e0b' },
    { name: 'Neon Purple', hex: '#a855f7' },
    { name: 'Rose Pink', hex: '#f43f5e' },
    { name: 'Slate Silver', hex: '#64748b' }
  ];

  let {
    appName = 'CA Ecosystem',
    enabled = $bindable(false),
    isPro = false,
    accentColor = $bindable('#6366f1'),
    mode = $bindable('solid'),
    presets = DEFAULT_PRESETS,
    onchange,
    class: customClass = '',
  }: Props = $props();

  function triggerUpdate() {
    onchange?.({ enabled, accentColor, mode });
  }

  function selectPreset(hex: string) {
    accentColor = hex;
    triggerUpdate();
  }
</script>

<div class="bg-[var(--ca-surface-base,#141414)] border border-[var(--ca-border,#27272a)] rounded-xl p-6 shadow-sm text-[var(--ca-text-primary,#fafafa)] space-y-6 {customClass}">
  <div class="flex items-start justify-between gap-4">
    <div class="space-y-1">
      <div class="flex items-center gap-2">
        <h3 class="text-sm font-semibold tracking-tight text-[var(--ca-text-primary,#fafafa)]">Ambient Underglow & Lighting</h3>
        {#if isPro}
          <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-500 border border-amber-500/30 uppercase tracking-wide">
            PRO Founder
          </span>
        {:else}
          <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--ca-surface-subtle,#27272a)] text-[var(--ca-text-muted,#71717a)] border border-[var(--ca-border,#3f3f46)] uppercase tracking-wide">
            PRO Feature
          </span>
        {/if}
      </div>
      <p class="text-xs text-[var(--ca-text-muted,#a1a1aa)] max-w-xl leading-relaxed">
        GPU-accelerated ambient rim glow surrounding the workspace. Supports solid colors, breathing accents, and dynamic RGB cycles.
      </p>
    </div>

    <div class="flex items-center gap-3">
      <span class="text-xs font-medium text-[var(--ca-text-muted,#a1a1aa)]">
        {enabled && isPro ? 'Active' : 'Disabled'}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        disabled={!isPro}
        onclick={() => { enabled = !enabled; triggerUpdate(); }}
        class="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed {enabled && isPro ? 'bg-[var(--ca-brand,#6366f1)]' : 'bg-[var(--ca-surface-subtle,#27272a)]'}"
      >
        <span
          class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out {enabled && isPro ? 'translate-x-5' : 'translate-x-0'}"
        ></span>
      </button>
    </div>
  </div>

  {#if isPro}
    <div class="space-y-4 pt-2 border-t border-[var(--ca-border,#27272a)]">
      <div>
        <label for="ambient-color-swatches" class="block text-xs font-medium text-[var(--ca-text-secondary,#d4d4d8)] mb-2">Preset Accent Swatches</label>
        <div id="ambient-color-swatches" class="flex flex-wrap gap-2.5">
          {#each presets as preset}
            <button
              type="button"
              onclick={() => selectPreset(preset.hex)}
              class="w-7 h-7 rounded-full transition-transform hover:scale-110 flex items-center justify-center cursor-pointer border border-white/20 shadow-xs {accentColor === preset.hex ? 'ring-2 ring-white ring-offset-2 ring-offset-[#141414]' : ''}"
              style="background-color: {preset.hex}"
              title={preset.name}
              aria-label={preset.name}
            >
              {#if accentColor === preset.hex}
                <svg class="w-3.5 h-3.5 text-white drop-shadow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                </svg>
              {/if}
            </button>
          {/each}
        </div>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
        {#each [
          { id: 'solid', label: 'Solid Color' },
          { id: 'breathe', label: 'Breathe' },
          { id: 'pulse', label: 'Pulse' },
          { id: 'rgb_cycle', label: 'RGB Cycle' }
        ] as m}
          <button
            type="button"
            onclick={() => { mode = m.id as any; triggerUpdate(); }}
            class="px-3 py-2 rounded-lg border text-xs font-medium transition-all cursor-pointer {mode === m.id ? 'bg-[var(--ca-brand,#6366f1)]/15 border-[var(--ca-brand,#6366f1)] text-[var(--ca-brand,#6366f1)] font-semibold' : 'bg-[var(--ca-surface-subtle,#18181b)] border-[var(--ca-border,#27272a)] text-[var(--ca-text-muted,#a1a1aa)] hover:text-white'}"
          >
            {m.label}
          </button>
        {/each}
      </div>
    </div>
  {/if}
</div>
