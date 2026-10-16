<script lang="ts">
  import type { Snippet } from 'svelte';
  import Badge from './Badge.svelte';

  interface Props {
    title: string;
    badge?: string;
    onSplitRight?: () => void;
    onSplitDown?: () => void;
    onClose?: () => void;
    splitRightLabel?: string;
    splitDownLabel?: string;
    closeLabel?: string;
    actions?: Snippet;
    class?: string;
  }

  let {
    title,
    badge,
    onSplitRight,
    onSplitDown,
    onClose,
    splitRightLabel = 'Split right',
    splitDownLabel = 'Split down',
    closeLabel = 'Close pane',
    actions,
    class: customClass = '',
  }: Props = $props();
</script>

<div class="h-9 px-3 bg-[var(--ca-surface-base,#0a0a0a)] border-b border-[var(--ca-border,#27272a)] flex items-center justify-between shrink-0 select-none text-xs {customClass}">
  <div class="flex items-center gap-2 min-w-0">
    <span class="font-medium text-[var(--ca-text-primary,#fafafa)] truncate">{title}</span>
    {#if badge}
      <Badge variant="outline" class="px-1.5 py-0.5 text-[10px] font-mono">
        {badge}
      </Badge>
    {/if}
  </div>

  <div class="flex items-center gap-1">
    {#if actions}
      {@render actions()}
    {/if}

    {#if onSplitRight}
      <button
        type="button"
        onclick={onSplitRight}
        class="p-1 rounded text-[var(--ca-text-muted,#a1a1aa)] hover:text-[var(--ca-text-primary,#fafafa)] hover:bg-[var(--ca-surface-subtle,#27272a)] transition-colors cursor-pointer"
        title={splitRightLabel}
        aria-label={splitRightLabel}
      >
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V5z M12 4v16" />
        </svg>
      </button>
    {/if}

    {#if onSplitDown}
      <button
        type="button"
        onclick={onSplitDown}
        class="p-1 rounded text-[var(--ca-text-muted,#a1a1aa)] hover:text-[var(--ca-text-primary,#fafafa)] hover:bg-[var(--ca-surface-subtle,#27272a)] transition-colors cursor-pointer"
        title={splitDownLabel}
        aria-label={splitDownLabel}
      >
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V5z M4 12h16" />
        </svg>
      </button>
    {/if}

    {#if onClose}
      <button
        type="button"
        onclick={onClose}
        class="p-1 rounded text-[var(--ca-text-muted,#a1a1aa)] hover:text-rose-400 hover:bg-[var(--ca-surface-subtle,#27272a)] transition-colors cursor-pointer"
        title={closeLabel}
        aria-label={closeLabel}
      >
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    {/if}
  </div>
</div>
