<script lang="ts">
  export interface TabGroupItem {
    id: string;
    name: string;
    color?: string;
    paneCount?: number;
    splitDirection?: 'none' | 'horizontal' | 'vertical';
  }

  interface Props {
    groups: TabGroupItem[];
    activeId?: string;
    onSelect?: (id: string) => void;
    onClose?: (id: string) => void;
    onAdd?: () => void;
    addLabel?: string;
    class?: string;
  }

  let {
    groups = [],
    activeId = '',
    onSelect,
    onClose,
    onAdd,
    addLabel = 'Add group',
    class: customClass = '',
  }: Props = $props();
</script>

<div class="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none select-none {customClass}" role="tablist">
  {#each groups as group (group.id)}
    {@const isActive = group.id === activeId}
    <div
      class="group flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs transition-all cursor-pointer {isActive ? 'bg-[var(--ca-surface-subtle,#18181b)] border-[var(--ca-brand,#6366f1)] text-[var(--ca-text-primary,#fafafa)] shadow-sm' : 'bg-[var(--ca-surface-base,#0a0a0a)] border-[var(--ca-border,#27272a)] text-[var(--ca-text-muted,#a1a1aa)] hover:text-[var(--ca-text-primary,#fafafa)] hover:border-[var(--ca-border-strong,#3f3f46)]'}"
      onclick={() => onSelect?.(group.id)}
      role="tab"
      aria-selected={isActive}
      tabindex="0"
      onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') onSelect?.(group.id); }}
    >
      <span
        class="w-2 h-2 rounded-full shrink-0"
        style="background-color: {group.color || '#6366f1'}"
      ></span>

      <span class="font-medium truncate max-w-[120px]">{group.name}</span>

      {#if (group.paneCount ?? 1) > 1}
        <span class="px-1.5 py-0.2 rounded text-[10px] font-mono bg-[var(--ca-surface-subtle,#27272a)] text-[var(--ca-text-muted,#a1a1aa)]">
          {group.paneCount} {group.splitDirection === 'horizontal' ? 'H' : 'V'}
        </span>
      {/if}

      {#if onClose}
        <button
          type="button"
          class="opacity-0 group-hover:opacity-100 p-0.5 rounded text-[var(--ca-text-muted,#a1a1aa)] hover:text-rose-400 hover:bg-[var(--ca-surface-subtle,#27272a)] transition-opacity"
          title="Close group"
          aria-label="Close group"
          onclick={(e) => {
            e.stopPropagation();
            onClose(group.id);
          }}
        >
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      {/if}
    </div>
  {/each}

  {#if onAdd}
    <button
      type="button"
      onclick={onAdd}
      class="flex items-center justify-center p-1.5 rounded-lg border border-dashed border-[var(--ca-border,#27272a)] text-[var(--ca-text-muted,#a1a1aa)] hover:text-[var(--ca-text-primary,#fafafa)] hover:border-[var(--ca-border-strong,#52525b)] transition-colors cursor-pointer"
      title={addLabel}
      aria-label={addLabel}
    >
      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
    </button>
  {/if}
</div>
