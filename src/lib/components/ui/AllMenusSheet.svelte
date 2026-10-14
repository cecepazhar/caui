<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { ComponentSize } from './types';
  import { X, Search } from 'lucide-svelte';

  export interface MenuGroup {
    id: string;
    title: string;
    items: Array<{
      id: string;
      label: string;
      shortcut?: string;
      icon?: Snippet;
      action?: () => void;
    }>;
  }

  type AllMenusSize = Extract<ComponentSize, 'sm' | 'md' | 'lg'>;

  interface Props {
    menus: MenuGroup[];
    open?: boolean;
    title?: string;
    searchable?: boolean;
    searchPlaceholder?: string;
    size?: AllMenusSize;
    class?: string;
    onOpenChange?: (open: boolean) => void;
  }

  let {
    menus = [],
    open = $bindable(false),
    title = 'Menus',
    searchable = false,
    searchPlaceholder = 'Search menus...',
    size = 'md',
    class: customClass = '',
    onOpenChange,
  }: Props = $props();

  let searchQuery = $state('');

  const heightCls: Record<AllMenusSize, string> = {
    sm: 'max-h-[70vh]',
    md: 'max-h-[80vh]',
    lg: 'max-h-[90vh]',
  };

  const titleSize: Record<AllMenusSize, string> = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  function close() {
    open = false;
    onOpenChange?.(false);
  }

  const filteredMenus = $derived.by(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!searchable || !q) return menus;
    return menus
      .map((group) => ({
        ...group,
        items: group.items.filter(
          (item) =>
            item.label.toLowerCase().includes(q) ||
            item.id.toLowerCase().includes(q) ||
            group.title.toLowerCase().includes(q)
        ),
      }))
      .filter((group) => group.items.length > 0);
  });
</script>

{#if open}
  <div
    class="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-[var(--ca-motion-duration-normal)]"
    role="dialog"
    aria-modal="true"
    aria-label={title}
    tabindex="-1"
    onclick={(e) => { if (e.target === e.currentTarget) close(); }}
    onkeydown={(e) => { if (e.key === 'Escape') close(); }}
  >
    <div
      class="w-full sm:max-w-md mx-4 mb-4 sm:mb-0 rounded-t-2xl sm:rounded-2xl bg-[var(--ca-surface-elevated)] border border-[var(--ca-border)] shadow-2xl overflow-hidden flex flex-col {heightCls[size]} {customClass}"
    >
      <div class="flex items-center justify-between px-4 py-3 border-b border-[var(--ca-border)]">
        <h2 class="font-semibold text-[var(--ca-text-primary)] {titleSize[size]}">{title}</h2>
        <button
          type="button"
          onclick={close}
          aria-label="Close menus"
          class="p-1.5 rounded-lg text-[var(--ca-text-muted)] hover:text-[var(--ca-text-primary)] hover:bg-[var(--ca-surface-subtle)] transition-colors duration-[var(--ca-motion-duration-fast)] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ca-brand)]"
        >
          <X class="w-4 h-4" aria-hidden="true" />
        </button>
      </div>

      {#if searchable}
        <div class="px-4 pt-3 pb-1 shrink-0">
          <div class="relative flex items-center">
            <Search class="w-3.5 h-3.5 absolute left-3 text-[var(--ca-text-muted)] pointer-events-none" aria-hidden="true" />
            <input
              type="text"
              bind:value={searchQuery}
              placeholder={searchPlaceholder}
              class="w-full pl-8.5 pr-8 py-1.5 rounded-lg text-xs bg-[var(--ca-surface-subtle)] border border-[var(--ca-border)] text-[var(--ca-text-primary)] placeholder-[var(--ca-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--ca-brand)]/40 transition-all"
            />
            {#if searchQuery}
              <button
                type="button"
                onclick={() => (searchQuery = '')}
                class="absolute right-2.5 p-0.5 text-[var(--ca-text-muted)] hover:text-[var(--ca-text-primary)] rounded cursor-pointer"
                aria-label="Clear search"
              >
                <X class="w-3 h-3" />
              </button>
            {/if}
          </div>
        </div>
      {/if}

      <div class="overflow-y-auto flex-1 p-4 space-y-5">
        {#if filteredMenus.length === 0}
          <div class="py-8 text-center text-xs text-[var(--ca-text-muted)]">
            No matching menus found.
          </div>
        {:else}
          {#each filteredMenus as group (group.id)}
            <div>
              <p class="text-xs font-semibold uppercase tracking-wider text-[var(--ca-text-muted)] mb-2 {titleSize[size]}">
                {group.title}
              </p>
              <div class="space-y-0.5">
                {#each group.items as item (item.id)}
                  <button
                    type="button"
                    onclick={() => { item.action?.(); close(); }}
                    class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-[var(--ca-text-primary)] hover:bg-[var(--ca-surface-subtle)] transition-colors duration-[var(--ca-motion-duration-fast)] cursor-pointer text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ca-brand)]"
                  >
                    {#if item.icon}
                      {@render item.icon()}
                    {/if}
                    <span class="flex-1">{item.label}</span>
                    {#if item.shortcut}
                      <kbd class="text-[10px] font-mono text-[var(--ca-text-muted)]">{item.shortcut}</kbd>
                    {/if}
                  </button>
                {/each}
              </div>
            </div>
          {/each}
        {/if}
      </div>
    </div>
  </div>
{/if}
