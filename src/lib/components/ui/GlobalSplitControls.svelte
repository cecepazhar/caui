<script lang="ts">
  export type GlobalSplitLayout = 'single' | '2-columns' | '2-rows' | '2x2-grid';

  interface Props {
    layout?: GlobalSplitLayout;
    groupCount?: number;
    onchange?: (layout: GlobalSplitLayout) => void;
    class?: string;
  }

  let {
    layout = $bindable('single'),
    groupCount = 1,
    onchange,
    class: customClass = '',
  }: Props = $props();

  const options: Array<{ value: GlobalSplitLayout; label: string; minGroups: number; icon: string }> = [
    { value: 'single', label: 'Single', minGroups: 1, icon: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V5z' },
    { value: '2-columns', label: '2 Col', minGroups: 2, icon: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V5z M12 4v16' },
    { value: '2-rows', label: '2 Row', minGroups: 2, icon: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V5z M4 12h16' },
    { value: '2x2-grid', label: 'Grid', minGroups: 3, icon: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V5z M12 4v16 M4 12h16' }
  ];

  function selectLayout(val: GlobalSplitLayout) {
    layout = val;
    onchange?.(val);
  }
</script>

<div class="flex items-center gap-1 p-1 bg-[var(--ca-surface-base,#0a0a0a)] border border-[var(--ca-border,#27272a)] rounded-lg select-none {customClass}" role="group" aria-label="Split layout options">
  {#each options as opt}
    <button
      type="button"
      disabled={groupCount < opt.minGroups}
      onclick={() => selectLayout(opt.value)}
      class="px-2 py-1 flex items-center gap-1 rounded text-xs font-medium transition-colors disabled:opacity-30 cursor-pointer {layout === opt.value ? 'bg-[var(--ca-brand,#6366f1)] text-white shadow-xs' : 'text-[var(--ca-text-muted,#a1a1aa)] hover:text-[var(--ca-text-primary,#fafafa)] hover:bg-[var(--ca-surface-subtle,#27272a)]'}"
      title={`${opt.label} View`}
      aria-label={`${opt.label} View`}
    >
      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={opt.icon} />
      </svg>
      <span class="text-[10px] hidden sm:inline">{opt.label}</span>
    </button>
  {/each}
</div>
