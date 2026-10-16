<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { GlobalSplitLayout } from './GlobalSplitControls.svelte';

  export interface ViewportGroup<T = any> {
    id: string;
    panes: T[];
    splitDirection?: 'none' | 'horizontal' | 'vertical';
    [key: string]: any;
  }

  interface Props<T = any> {
    layout?: GlobalSplitLayout;
    groups?: ViewportGroup<T>[];
    activeGroupId?: string;
    renderPane: Snippet<[{ item: T; group: ViewportGroup<T> }]>;
    emptyMessage?: string;
    class?: string;
  }

  let {
    layout = 'single',
    groups = [],
    activeGroupId = '',
    renderPane,
    emptyMessage = 'No active tab groups',
    class: customClass = '',
  }: Props = $props();

  const activeGroup = $derived(groups.find((g) => g.id === activeGroupId) || groups[0]);

  const macroContainerClass = $derived(
    layout === '2-rows'
      ? 'flex flex-col h-full gap-2'
      : layout === '2-columns'
        ? 'flex h-full gap-2'
        : layout === '2x2-grid'
          ? 'grid grid-cols-2 auto-rows-fr h-full gap-2'
          : 'relative h-full w-full'
  );

  function groupInPaneClass(group: ViewportGroup): string {
    if (layout !== 'single') return 'min-h-0 min-w-0 flex-1';
    return group.id === activeGroup?.id
      ? 'absolute inset-0 z-10'
      : 'absolute inset-0 invisible pointer-events-none';
  }

  function getMicroSplitClass(group: ViewportGroup): string {
    if (group.panes.length <= 1 || group.splitDirection === 'none') {
      return 'h-full w-full';
    }
    return group.splitDirection === 'horizontal'
      ? 'flex flex-col h-full gap-1'
      : 'flex h-full gap-1';
  }
</script>

<div class="h-full w-full overflow-hidden {customClass}">
  {#if groups.length === 0}
    <div class="h-full flex items-center justify-center border border-dashed border-[var(--ca-border,#27272a)] rounded-xl text-[var(--ca-text-muted,#71717a)] text-xs">
      {emptyMessage}
    </div>
  {:else}
    <div class={macroContainerClass}>
      {#each groups as group (group.id)}
        <div class="{groupInPaneClass(group)} flex flex-col rounded-lg border border-[var(--ca-border,#27272a)] overflow-hidden bg-[var(--ca-surface-base,#0a0a0a)]/50">
          <div class="flex-1 min-h-0 min-w-0 {getMicroSplitClass(group)}">
            {#each group.panes as pane (pane.id || pane)}
              <div class="flex-1 min-h-0 min-w-0 h-full w-full overflow-hidden flex flex-col">
                {@render renderPane({ item: pane, group })}
              </div>
            {/each}
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>
