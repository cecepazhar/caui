<script lang="ts">
  import type { Snippet } from 'svelte';
  import Logo from '$lib/components/Logo.svelte';
  import { ThemeSwitcher, LanguageSwitcher } from '$lib/components/ui';

  interface Props {
    children?: Snippet;
  }

  let { children }: Props = $props();

  const navCategories = [
    {
      title: 'Getting Started',
      items: [
        { label: 'Overview', href: '/docs' },
        { label: 'Installation', href: '/docs/installation' },
        { label: 'Design Tokens', href: '/docs/tokens' },
      ],
    },
    {
      title: 'Component Catalog',
      items: [
        { label: 'All Components (Interactive)', href: '/docs/components' },
        { label: 'Design System Overview', href: '/docs' },
      ],
    },
    {
      title: 'Core Primitives',
      items: [
        { label: 'Button & Badge', href: '/docs/components#button' },
        { label: 'Input & Textarea', href: '/docs/components#input' },
        { label: 'Card & Table', href: '/docs/components#card' },
        { label: 'Avatar & Tooltip', href: '/docs/components#avatar' },
      ],
    },
    {
      title: 'Forms & Controls',
      items: [
        { label: 'Switch & Checkbox', href: '/docs/components#switch' },
        { label: 'RadioGroup & Select', href: '/docs/components#forms' },
        { label: 'Slider & RangeSlider', href: '/docs/components#slider' },
        { label: 'PinInput (TOTP)', href: '/docs/components#pininput' },
        { label: 'ColorPicker', href: '/docs/components#colorpicker' },
      ],
    },
    {
      title: 'Navigation & Overlays',
      items: [
        { label: 'Tabs & SegmentedControl', href: '/docs/components#tabs' },
        { label: 'Breadcrumb & Separator', href: '/docs/components#nav' },
        { label: 'Modal & Drawer', href: '/docs/components#overlays' },
        { label: 'Dropdown & ContextMenu', href: '/docs/components#menus' },
        { label: 'Popover & HoverCard', href: '/docs/components#popover' },
      ],
    },
    {
      title: 'Feedback & Utilities',
      items: [
        { label: 'Toast Notifications', href: '/docs/components#toast' },
        { label: 'Progress & Skeleton', href: '/docs/components#feedback' },
        { label: 'Accordion & Collapsible', href: '/docs/components#accordion' },
        { label: 'TreeView (Explorer)', href: '/docs/components#treeview' },
        { label: 'Kbd & Telemetry', href: '/docs/components#utils' },
      ],
    },
  ];
</script>

<div class="min-h-screen flex flex-col bg-[var(--ca-surface)] text-[var(--ca-text-primary)] font-sans antialiased selection:bg-[var(--ca-brand)] selection:text-white transition-colors duration-200">
  <!-- Topbar -->
  <header class="sticky top-0 z-40 border-b border-[var(--ca-border)] bg-[var(--ca-surface)]/90 backdrop-blur-md px-6 py-4 flex items-center justify-between max-w-7xl w-full mx-auto">
    <div class="flex items-center gap-6">
      <a href="/" class="flex items-center gap-3 group">
        <Logo size={32} mode="brand" />
        <div class="flex flex-col text-left">
          <span class="font-bold text-sm tracking-tight group-hover:text-[var(--ca-brand)] transition">CAUI</span>
          <span class="text-[10px] font-mono text-[var(--ca-text-muted)]">The UI Foundation of the CA Ecosystem</span>
        </div>
      </a>
      <nav class="hidden md:flex items-center gap-6 text-xs font-medium text-[var(--ca-text-muted)]">
        <a href="/docs" class="text-[var(--ca-text-primary)] font-semibold">Documentation</a>
        <a href="/docs/components" class="hover:text-[var(--ca-text-primary)] transition">Components</a>
        <a href="/docs/tokens" class="hover:text-[var(--ca-text-primary)] transition">Tokens</a>
        <a href="/docs/installation" class="hover:text-[var(--ca-text-primary)] transition">Installation</a>
      </nav>
    </div>
    <div class="flex items-center gap-3">
      <LanguageSwitcher />
      <ThemeSwitcher />
    </div>
  </header>

  <!-- Docs Shell -->
  <div class="flex-1 flex max-w-7xl w-full mx-auto">
    <!-- Sidebar -->
    <aside class="w-64 shrink-0 border-r border-[var(--ca-border)] p-6 hidden lg:block overflow-y-auto max-h-[calc(100vh-57px)] sticky top-[57px]">
      <div class="space-y-6">
        {#each navCategories as cat (cat.title)}
          <div>
            <h4 class="text-[11px] font-mono uppercase tracking-wider text-[var(--ca-text-muted)] font-semibold mb-2">{cat.title}</h4>
            <ul class="space-y-1">
              {#each cat.items as item (item.href)}
                <li>
                  <a
                    href={item.href}
                    class="block px-2.5 py-1.5 text-xs rounded-md text-[var(--ca-text-secondary)] hover:text-[var(--ca-text-primary)] hover:bg-[var(--ca-surface-subtle)] transition font-medium"
                  >
                    {item.label}
                  </a>
                </li>
              {/each}
            </ul>
          </div>
        {/each}
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 p-6 md:p-10 max-w-4xl min-w-0">
      {@render children?.()}
    </main>
  </div>
</div>
