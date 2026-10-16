<script lang="ts">
  export interface WorkspaceItem {
    id: string;
    name: string;
    description?: string;
    color?: string;
  }

  interface Props {
    workspaces?: WorkspaceItem[];
    activeId?: string;
    onselect?: (workspace: WorkspaceItem) => void;
    title?: string;
    class?: string;
  }

  const DEFAULT_WORKSPACES: WorkspaceItem[] = [
    { id: 'ws-default', name: 'Default Workspace', description: 'Primary working area', color: '#10b981' },
    { id: 'ws-research', name: 'Research & Labs', description: 'Experimental sandbox', color: '#06b6d4' },
    { id: 'ws-prod', name: 'Production Fleet', description: 'Critical deployments', color: '#8b5cf6' }
  ];

  let {
    workspaces = DEFAULT_WORKSPACES,
    activeId = $bindable('ws-default'),
    onselect,
    title = 'Workspaces',
    class: customClass = '',
  }: Props = $props();

  let open = $state(false);
  let root: HTMLDivElement | undefined = $state();

  const activeWorkspace = $derived(
    workspaces.find((w) => w.id === activeId) || workspaces[0]
  );

  function handleOutside(e: PointerEvent) {
    if (open && root && !root.contains(e.target as Node)) {
      open = false;
    }
  }

  function selectWorkspace(w: WorkspaceItem) {
    activeId = w.id;
    open = false;
    onselect?.(w);
  }
</script>

<svelte:window
  onpointerdown={handleOutside}
  onkeydown={(e) => {
    if (e.key === 'Escape') open = false;
  }}
/>

<div class="relative inline-flex items-center no-drag {customClass}" bind:this={root}>
  <button
    type="button"
    onclick={() => (open = !open)}
    class="p-1.5 rounded-lg border transition-colors flex items-center justify-center cursor-pointer {open ? 'bg-[var(--ca-brand,#6366f1)]/15 border-[var(--ca-brand,#6366f1)]/40 text-[var(--ca-brand,#6366f1)]' : 'bg-[var(--ca-surface-base,#0a0a0a)] border-[var(--ca-border,#27272a)] text-[var(--ca-text-muted,#a1a1aa)] hover:text-[var(--ca-text-primary,#fafafa)] hover:bg-[var(--ca-surface-subtle,#18181b)]'}"
    title={`${title}: ${activeWorkspace?.name || ''}`}
    aria-label={`${title}: ${activeWorkspace?.name || ''}`}
  >
    <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  </button>

  {#if open}
    <div
      role="menu"
      aria-label="Workspaces Menu"
      class="absolute right-0 top-full mt-2 z-50 w-64 rounded-2xl border border-[var(--ca-border,#27272a)] bg-[var(--ca-surface-base,#141414)] shadow-2xl p-2 space-y-1 text-xs animate-in fade-in zoom-in-95 duration-100"
    >
      <div class="px-2.5 py-1.5 border-b border-[var(--ca-border,#27272a)] flex items-center justify-between">
        <span class="font-bold text-[var(--ca-text-primary,#fafafa)]">{title}</span>
        <span class="text-[10px] text-[var(--ca-text-muted,#71717a)] font-mono">{workspaces.length} items</span>
      </div>

      <div class="space-y-1 py-1">
        {#each workspaces as ws (ws.id)}
          {@const isSelected = activeId === ws.id}
          <button
            type="button"
            role="menuitem"
            onclick={() => selectWorkspace(ws)}
            class="w-full flex items-center gap-2.5 p-2 rounded-xl text-left transition-colors cursor-pointer {isSelected ? 'bg-[var(--ca-brand,#6366f1)]/10 border border-[var(--ca-brand,#6366f1)]/30 text-[var(--ca-brand,#6366f1)]' : 'hover:bg-[var(--ca-surface-subtle,#18181b)] text-[var(--ca-text-secondary,#d4d4d8)] border border-transparent'}"
          >
            <span class="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs" style="background-color: {ws.color || '#6366f1'}"></span>
            <div class="min-w-0 flex-1">
              <span class="block font-semibold truncate text-[var(--ca-text-primary,#fafafa)]">{ws.name}</span>
              {#if ws.description}
                <span class="block text-[10px] text-[var(--ca-text-muted,#71717a)] truncate">{ws.description}</span>
              {/if}
            </div>
            {#if isSelected}
              <svg class="w-4 h-4 text-[var(--ca-brand,#6366f1)] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
              </svg>
            {/if}
          </button>
        {/each}
      </div>
    </div>
  {/if}
</div>
