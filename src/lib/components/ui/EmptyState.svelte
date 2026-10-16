<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    title?: string;
    description?: string;
    icon?: 'inbox' | 'notes' | 'search' | 'folder' | 'document' | string;
    actionLabel?: string;
    onaction?: () => void;
    class?: string;
    children?: Snippet;
    action?: Snippet;
  }

  let {
    title = 'No items found',
    description = 'Get started by creating a new item.',
    icon = 'inbox',
    actionLabel,
    onaction,
    class: customClass = '',
    children,
    action,
  }: Props = $props();
</script>

<div class="flex flex-col items-center justify-center py-16 px-4 text-center {customClass}" role="region" aria-label={title}>
  <div class="w-16 h-16 rounded-2xl bg-[var(--ca-surface-subtle,#27272a)] border border-[var(--ca-border,#3f3f46)] flex items-center justify-center text-[var(--ca-text-muted,#a1a1aa)] mb-4 shadow-inner">
    {#if icon === 'inbox'}
      <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
      </svg>
    {:else if icon === 'notes' || icon === 'document'}
      <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    {:else if icon === 'search'}
      <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    {:else if icon === 'folder'}
      <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
      </svg>
    {:else}
      <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    {/if}
  </div>

  <h3 class="text-base font-semibold text-[var(--ca-text-primary,#fafafa)]">{title}</h3>
  <p class="text-xs text-[var(--ca-text-muted,#a1a1aa)] mt-1 max-w-sm leading-relaxed">{description}</p>

  {#if action}
    <div class="mt-5">
      {@render action()}
    </div>
  {:else if actionLabel && onaction}
    <button
      type="button"
      onclick={onaction}
      class="mt-5 inline-flex items-center gap-2 px-4 py-2 bg-[var(--ca-brand,#6366f1)] hover:opacity-90 text-white rounded-lg text-xs font-semibold transition-all shadow-sm cursor-pointer"
    >
      <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
      {actionLabel}
    </button>
  {/if}

  {@render children?.()}
</div>
