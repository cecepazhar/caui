<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { ComponentSize } from './types';
  import { uid, clickOutside } from '../../utils/a11y';

  export type SearchInputSize = Extract<ComponentSize, 'sm' | 'md' | 'lg'>;

  interface Props {
    size?: SearchInputSize;
    value?: string;
    placeholder?: string;
    disabled?: boolean;
    id?: string;
    label?: string;
    shortcutHint?: string;
    class?: string;
    oninput?: (e: Event) => void;
    onkeydown?: (e: KeyboardEvent) => void;
    autofocus?: boolean;
    ref?: HTMLInputElement;
    /** Custom search icon override */
    searchIcon?: Snippet;
  }

  let {
    size = 'md',
    value = $bindable(''),
    placeholder = 'Search...',
    disabled = false,
    id,
    label = '',
    shortcutHint = '',
    class: customClass = '',
    oninput,
    onkeydown,
    autofocus = false,
    ref = $bindable(undefined),
    searchIcon,
  }: Props = $props();

  let container = $state<HTMLElement>();
  let iconId = $derived(uid('search-icon'));

  const sizeClasses: Record<SearchInputSize, string> = {
    sm: 'py-1.5 text-xs',
    md: 'py-2 text-xs',
    lg: 'py-2.5 text-sm',
  };

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape' && value) {
      value = '';
      oninput?.(new Event('input'));
    }
    onkeydown?.(e);
  }
</script>

<div class="flex flex-col gap-1.5 w-full {customClass}" bind:this={container} use:clickOutside>
  {#if label}
    <label for={id} class="text-xs font-medium text-[var(--ca-text-secondary)]">{label}</label>
  {/if}

  <div class="relative flex items-center w-full">
    <!-- Leading Search Icon -->
    <div class="absolute left-3.5 flex items-center justify-center pointer-events-none text-[var(--ca-text-muted)]" {id:iconId}>
      {#if searchIcon}
        {@render searchIcon()}
      {:else}
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
      {/if}
    </div>

    <input
      bind:this={ref}
      {id}
      type="text"
      {placeholder}
      {disabled}
      {autofocus}
      bind:value
      oninput={oninput}
      onkeydown={(e) => handleKeydown(e)}
      aria-label={label || placeholder}
      class="w-full rounded-lg bg-[var(--ca-surface)] border border-[var(--ca-border)] text-[var(--ca-text-primary)] placeholder-[var(--ca-text-muted)] {sizeClasses[size]} pl-10 pr-9 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:border-neutral-900 dark:focus-visible:border-white"
    />

    <!-- Trailing Action / Shortcut Hint -->
    {#if value}
      <button
        type="button"
        class="absolute right-3 text-[var(--ca-text-muted)] hover:text-[var(--ca-text-primary)] p-1 cursor-pointer transition-colors"
        onclick={() => { value = ''; oninput?.(new Event('input')); }}
        aria-label="Clear search"
      >
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
      </button>
    {:else if shortcutHint}
      <span class="absolute right-3 text-[10px] font-mono font-medium text-[var(--ca-text-muted)] border border-[var(--ca-border)] rounded px-1 py-0.5 pointer-events-none">
        {shortcutHint}
      </span>
    {/if}
  </div>
</div>
