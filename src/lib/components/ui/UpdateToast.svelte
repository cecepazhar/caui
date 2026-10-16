<script lang="ts">
  interface Props {
    show?: boolean;
    version: string;
    bodyText?: string;
    changelogUrl?: string;
    changelogLabel?: string;
    installLabel?: string;
    downloading?: boolean;
    downloadPercent?: number | null;
    oninstall?: () => void;
    ondismiss?: () => void;
    class?: string;
  }

  let {
    show = true,
    version,
    bodyText = 'A new version is ready to install.',
    changelogUrl,
    changelogLabel = 'Release notes',
    installLabel = 'Restart & Update',
    downloading = false,
    downloadPercent = null,
    oninstall,
    ondismiss,
    class: customClass = '',
  }: Props = $props();
</script>

{#if show}
  <div
    role="status"
    class="no-drag pointer-events-auto w-[340px] max-w-[calc(100vw-2.5rem)] rounded-xl border border-[var(--ca-border,#27272a)] bg-[var(--ca-surface-base,#141414)]/95 backdrop-blur-md shadow-2xl p-3.5 text-xs text-[var(--ca-text-primary,#fafafa)] {customClass}"
  >
    <div class="flex items-start gap-3">
      <div class="w-7 h-7 rounded-lg bg-[var(--ca-brand,#6366f1)]/10 text-[var(--ca-brand,#6366f1)] flex items-center justify-center shrink-0 mt-0.5">
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
      </div>

      <div class="flex-1 min-w-0">
        <p class="text-xs font-semibold text-[var(--ca-text-primary,#fafafa)]">Update Available (v{version})</p>
        <p class="text-[11px] text-[var(--ca-text-muted,#a1a1aa)] mt-0.5 leading-relaxed">
          {bodyText}
          {#if changelogUrl}
            <a href={changelogUrl} target="_blank" rel="noreferrer" class="underline underline-offset-2 hover:text-[var(--ca-brand,#6366f1)] ml-1">
              {changelogLabel}
            </a>
          {/if}
        </p>
      </div>

      {#if !downloading && ondismiss}
        <button
          type="button"
          onclick={ondismiss}
          class="p-1 -mt-1 -mr-1 rounded-md text-[var(--ca-text-muted,#a1a1aa)] hover:text-[var(--ca-text-primary,#fafafa)] hover:bg-[var(--ca-surface-subtle,#27272a)] transition-colors cursor-pointer"
          aria-label="Dismiss"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      {/if}
    </div>

    <div class="mt-3 flex items-center justify-end gap-2">
      {#if downloading}
        <div class="flex-1 h-1.5 rounded-full bg-[var(--ca-surface-subtle,#27272a)] overflow-hidden">
          <div
            class="h-full bg-[var(--ca-brand,#6366f1)] transition-all {downloadPercent === null ? 'w-1/3 animate-pulse' : ''}"
            style={downloadPercent === null ? '' : `width: ${downloadPercent}%`}
          ></div>
        </div>
        <span class="text-[10px] font-mono text-[var(--ca-text-muted,#a1a1aa)] w-10 text-right">
          {downloadPercent === null ? '…' : `${downloadPercent}%`}
        </span>
      {:else if oninstall}
        <button
          type="button"
          onclick={oninstall}
          class="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[var(--ca-brand,#6366f1)] text-white hover:opacity-90 transition-all cursor-pointer shadow-xs"
        >
          {installLabel}
        </button>
      {/if}
    </div>
  </div>
{/if}
