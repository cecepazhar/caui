<script lang="ts">
  import { onMount } from 'svelte';

  interface Props {
    isMaximized?: boolean;
    onminimize?: () => void;
    onmaximize?: () => void;
    onclose?: () => void;
    minimizeLabel?: string;
    maximizeLabel?: string;
    closeLabel?: string;
    class?: string;
  }

  let {
    isMaximized = $bindable(false),
    onminimize,
    onmaximize,
    onclose,
    minimizeLabel = 'Minimize',
    maximizeLabel = 'Maximize',
    closeLabel = 'Close',
    class: customClass = '',
  }: Props = $props();

  let tauriWindow: any = null;

  onMount(async () => {
    try {
      if (typeof window !== 'undefined' && ((window as any).__TAURI_INTERNALS__ || (window as any).__TAURI__)) {
        const { getCurrentWindow } = await import('@tauri-apps/api/window');
        tauriWindow = getCurrentWindow();
        if (tauriWindow) {
          isMaximized = await tauriWindow.isMaximized();
        }
      }
    } catch {
      // Browser preview mode
    }
  });

  async function handleMinimize() {
    if (onminimize) {
      onminimize();
      return;
    }
    if (tauriWindow) {
      try {
        await tauriWindow.minimize();
      } catch (e) {
        console.warn('Tauri minimize error', e);
      }
    }
  }

  async function handleMaximize() {
    if (onmaximize) {
      onmaximize();
      return;
    }
    if (tauriWindow) {
      try {
        await tauriWindow.toggleMaximize();
        isMaximized = await tauriWindow.isMaximized();
      } catch (e) {
        console.warn('Tauri maximize error', e);
      }
    } else {
      isMaximized = !isMaximized;
    }
  }

  async function handleClose() {
    if (onclose) {
      onclose();
      return;
    }
    if (tauriWindow) {
      try {
        await tauriWindow.close();
      } catch (e) {
        console.warn('Tauri close error', e);
      }
    }
  }
</script>

<div class="flex items-center gap-0.5 select-none no-drag {customClass}" role="group" aria-label="Window controls">
  <button
    type="button"
    onclick={handleMinimize}
    class="p-1.5 rounded text-[var(--ca-text-muted,#a1a1aa)] hover:text-[var(--ca-text-primary,#fafafa)] hover:bg-[var(--ca-surface-subtle,#27272a)] transition-colors cursor-pointer"
    title={minimizeLabel}
    aria-label={minimizeLabel}
  >
    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
    </svg>
  </button>

  <button
    type="button"
    onclick={handleMaximize}
    class="p-1.5 rounded text-[var(--ca-text-muted,#a1a1aa)] hover:text-[var(--ca-text-primary,#fafafa)] hover:bg-[var(--ca-surface-subtle,#27272a)] transition-colors cursor-pointer"
    title={maximizeLabel}
    aria-label={maximizeLabel}
  >
    {#if isMaximized}
      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <rect x="4" y="8" width="12" height="12" rx="1.5" stroke-width="2" />
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 4h10a2 2 0 012 2v10" />
      </svg>
    {:else}
      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <rect x="4" y="4" width="16" height="16" rx="2" stroke-width="2" />
      </svg>
    {/if}
  </button>

  <button
    type="button"
    onclick={handleClose}
    class="p-1.5 rounded text-[var(--ca-text-muted,#a1a1aa)] hover:text-white hover:bg-rose-600 transition-colors cursor-pointer"
    title={closeLabel}
    aria-label={closeLabel}
  >
    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
    </svg>
  </button>
</div>
