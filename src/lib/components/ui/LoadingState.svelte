<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    message?: string;
    /** Size of the spinner in px. */
    size?: 'sm' | 'md' | 'lg';
    /** Accessible loading label. */
    ariaLabel?: string;
    class?: string;
    children?: Snippet;
  }

  let {
    message = 'Loading...',
    size = 'md',
    ariaLabel = message,
    class: customClass = '',
    children,
  }: Props = $props();

  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base',
  };
</script>

<div class="flex flex-col items-center justify-center py-10 px-4 text-center {customClass}" role="status" aria-live="polite" aria-label={ariaLabel}>
  <div class="relative {sizeClasses[size]} mb-3">
    <div class="w-full h-full rounded-full border-2 border-[var(--ca-brand,#6366f1)]/20 border-t-[var(--ca-brand,#6366f1)] animate-spin" />
  </div>
  {#if message}
    <p class="text-xs font-medium text-[var(--ca-text-muted,#a1a1aa)]">{message}</p>
  {/if}
  {@render children?.()}
</div>
