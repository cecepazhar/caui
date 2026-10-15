<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { ComponentSize } from './types';

  interface Props {
    size?: ComponentSize;
    class?: string;
    /** Top leading icon / avatar */
    icon?: Snippet;
    /** Main title text */
    title?: string;
    /** Subtitle or secondary text under title */
    subtitle?: string;
    /** Status badge / tag row */
    badges?: Snippet;
    /** Key-value metadata row */
    meta?: Snippet;
    /** Footer action buttons cluster */
    actions?: Snippet;
    /** Body custom content */
    body?: Snippet;
    /** Selection state highlight */
    selected?: boolean;
  }

  let {
    size = 'md',
    class: customClass = '',
    icon,
    title = '',
    subtitle = '',
    badges,
    meta,
    actions,
    body,
    selected = false,
  }: Props = $props();

  const sizeClasses: Record<ComponentSize, string> = {
    xs: 'p-2.5 text-[10px]',
    sm: 'p-3 text-xs',
    md: 'p-4 text-sm',
    lg: 'p-5 text-base',
    xl: 'p-6 text-lg',
    icon: 'p-1.5 text-xs',
  };
</script>

<div
  role="article"
  class="group rounded-xl border transition-colors flex flex-col {sizeClasses[size]} {selected ? 'border-neutral-900 dark:border-white ring-1 ring-neutral-900/10 dark:ring-white/20 bg-neutral-100/50 dark:bg-neutral-900/60' : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/40 hover:border-neutral-300 dark:hover:border-neutral-700'} {customClass}"
>
  {#if icon}
    <div class="flex items-start gap-3">
      <div class="w-10 h-10 rounded-lg bg-neutral-100 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700/80 flex items-center justify-center shrink-0 text-neutral-700 dark:text-neutral-300">
        {@render icon?.()}
      </div>
      <div class="min-w-0 flex-1">
        {#if title}
          <p class="font-semibold text-neutral-900 dark:text-white truncate">{title}</p>
        {/if}
        {#if subtitle}
          <p class="text-xs text-neutral-500 dark:text-neutral-400 truncate mt-0.5">{subtitle}</p>
        {/if}
      </div>
    </div>
  {:else}
    {#if title}
      <div class="flex-1 min-w-0">
        <p class="font-semibold text-neutral-900 dark:text-white truncate">{title}</p>
        {#if subtitle}
          <p class="text-xs text-neutral-500 dark:text-neutral-400 truncate mt-0.5">{subtitle}</p>
        {/if}
      </div>
    {/if}
  {/if}

  {#if badges}
    <div class="mt-3 flex flex-wrap items-center gap-1.5 text-[11px]">
      {@render badges()}
    </div>
  {/if}

  {#if meta}
    <div class="mt-3 text-xs text-neutral-500 dark:text-neutral-400 flex flex-wrap items-center gap-x-3 gap-y-1">
      {@render meta()}
    </div>
  {/if}

  {#if body}
    <div class="mt-3 flex-1">
      {@render body()}
    </div>
  {/if}

  {#if actions}
    <div class="mt-3 pt-3 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center gap-1.5">
      {@render actions()}
    </div>
  {/if}
</div>
