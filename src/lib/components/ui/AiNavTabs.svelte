<script lang="ts">
  export interface AiNavTabItem {
    id: string;
    label: string;
    href?: string;
  }

  interface Props {
    active?: string;
    tabs?: AiNavTabItem[];
    onselect?: (id: string) => void;
    class?: string;
  }

  const DEFAULT_TABS: AiNavTabItem[] = [
    { id: 'routing', label: 'Providers & Routing Matrix', href: '/settings/ai-routing' },
    { id: 'skills', label: 'Custom Skills (@skills)', href: '/settings/ai-skills' },
    { id: 'personas', label: 'Personas & Prompt Rules', href: '/settings/ai-personas' },
    { id: 'habits', label: 'Persistent Habit Memory (FTS5)', href: '/settings/ai-habits' },
    { id: 'quick', label: 'Quick AI Config', href: '/settings?tab=ai' }
  ];

  let {
    active = 'routing',
    tabs = DEFAULT_TABS,
    onselect,
    class: customClass = '',
  }: Props = $props();
</script>

<div class="border-b border-[var(--ca-border,#27272a)] flex gap-4 overflow-x-auto text-xs sm:text-sm font-medium scrollbar-none {customClass}" role="tablist">
  {#each tabs as tab}
    {@const isSelected = active === tab.id}
    {#if tab.href && !onselect}
      <a
        href={tab.href}
        role="tab"
        aria-selected={isSelected}
        class="pb-3 whitespace-nowrap transition-colors border-b-2 {isSelected
          ? 'border-[var(--ca-brand,#6366f1)] text-[var(--ca-text-primary,#fafafa)] font-semibold'
          : 'border-transparent text-[var(--ca-text-muted,#a1a1aa)] hover:text-[var(--ca-text-primary,#fafafa)]'}"
      >
        {tab.label}
      </a>
    {:else}
      <button
        type="button"
        role="tab"
        aria-selected={isSelected}
        onclick={() => onselect?.(tab.id)}
        class="pb-3 whitespace-nowrap transition-colors border-b-2 cursor-pointer {isSelected
          ? 'border-[var(--ca-brand,#6366f1)] text-[var(--ca-text-primary,#fafafa)] font-semibold'
          : 'border-transparent text-[var(--ca-text-muted,#a1a1aa)] hover:text-[var(--ca-text-primary,#fafafa)]'}"
      >
        {tab.label}
      </button>
    {/if}
  {/each}
</div>
