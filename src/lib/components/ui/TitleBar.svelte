<script lang="ts">
  import type { Snippet } from 'svelte';
  import WindowControls from './WindowControls.svelte';

  interface Props {
    title?: string;
    version?: string;
    isMaximized?: boolean;
    onminimize?: () => void;
    onmaximize?: () => void;
    onclose?: () => void;
    /** Rendered in the left zone. */
    left?: Snippet;
    /** Rendered in the right zone (before WindowControls). */
    right?: Snippet;
    /** Show window controls (min / max / close) at the far right. */
    showControls?: boolean;
    class?: string;
  }

  let {
    title = '',
    version,
    isMaximized = $bindable(false),
    onminimize,
    onmaximize,
    onclose,
    left,
    right,
    showControls = true,
    class: customClass = '',
  }: Props = $props();
</script>

<div data-tauri-drag-region class="h-9 px-2.5 bg-[var(--ca-surface-base,#0a0a0a)] border-b border-[var(--ca-border,#27272a)] flex items-center justify-between select-none shrink-0 {customClass}">
  <div class="flex items-center gap-2 min-w-0 flex-1">
    {#if left}
      {@render left()}
    {:else}
      {#if title}
        <span class="text-xs font-medium text-[var(--ca-text-secondary,#a1a1aa)] truncate data-[tauri-drag-region]">{title}</span>
      {/if}
      {#if version}
        <span class="px-1.5 py-0.5 rounded bg-[var(--ca-surface-subtle,#18181b)] border border-[var(--ca-border,#27272a)] text-[10px] font-mono text-[var(--ca-text-muted,#71717a)]">
          v{version}
        </span>
      {/if}
    {/if}
  </div>

  <div class="flex items-center gap-2 min-w-0">
    {#if right}
      {@render right()}
    {/if}

    {#if showControls}
      <WindowControls
        bind:isMaximized
        {onminimize}
        {onmaximize}
        {onclose}
      />
    {/if}
  </div>
</div>
