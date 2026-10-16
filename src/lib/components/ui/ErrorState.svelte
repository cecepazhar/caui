<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    title?: string;
    message?: string;
    code?: string;
    retryLabel?: string;
    onretry?: () => void;
    class?: string;
    children?: Snippet;
    action?: Snippet;
  }

  let {
    title = 'Something went wrong',
    message = 'An error occurred while loading this section.',
    code,
    retryLabel = 'Try again',
    onretry,
    class: customClass = '',
    children,
    action,
  }: Props = $props();
</script>

<div class="flex flex-col items-center justify-center py-12 px-4 text-center {customClass}" role="alert">
  <div class="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 mb-4 shadow-inner">
    <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  </div>

  <h3 class="text-base font-semibold text-[var(--ca-text-primary,#fafafa)]">{title}</h3>
  <p class="text-xs text-[var(--ca-text-muted,#a1a1aa)] mt-1 max-w-sm leading-relaxed">{message}</p>

  {#if code}
    <div class="mt-3 px-3 py-1 rounded bg-[var(--ca-surface-subtle,#18181b)] border border-[var(--ca-border,#27272a)] text-[11px] font-mono text-rose-400">
      Error Code: {code}
    </div>
  {/if}

  {#if action}
    <div class="mt-5">
      {@render action()}
    </div>
  {:else if onretry}
    <button
      type="button"
      onclick={onretry}
      class="mt-5 inline-flex items-center gap-2 px-4 py-2 bg-[var(--ca-surface-subtle,#27272a)] hover:bg-[var(--ca-border,#3f3f46)] text-[var(--ca-text-primary,#fafafa)] rounded-lg text-xs font-semibold transition-all border border-[var(--ca-border,#3f3f46)] cursor-pointer"
    >
      <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
      {retryLabel}
    </button>
  {/if}

  {@render children?.()}
</div>
