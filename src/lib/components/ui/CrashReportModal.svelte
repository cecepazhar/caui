<script lang="ts">
  export interface CrashReportData {
    id: string;
    appName?: string;
    appVersion?: string;
    os?: string;
    timestamp?: number;
    stackTrace?: string;
    breadcrumbs?: string[];
  }

  interface Props {
    open?: boolean;
    report: CrashReportData;
    onsubmit?: (id: string) => Promise<void> | void;
    ondismiss?: (id: string, neverAgain: boolean) => Promise<void> | void;
    class?: string;
  }

  let {
    open = $bindable(false),
    report,
    onsubmit,
    ondismiss,
    class: customClass = '',
  }: Props = $props();

  let showDetails = $state(false);
  let neverAgain = $state(false);
  let isSubmitting = $state(false);
  let isDeleting = $state(false);

  async function handleSend() {
    isSubmitting = true;
    try {
      await onsubmit?.(report.id);
      open = false;
    } finally {
      isSubmitting = false;
    }
  }

  async function handleDelete() {
    isDeleting = true;
    try {
      await ondismiss?.(report.id, neverAgain);
      open = false;
    } finally {
      isDeleting = false;
    }
  }
</script>

{#if open}
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs {customClass}">
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="crash-modal-title"
      class="relative w-full max-w-lg rounded-2xl border border-[var(--ca-border)] bg-[var(--ca-surface-base)] shadow-2xl p-6 text-left space-y-4 text-xs text-[var(--ca-text-primary)] animate-in fade-in zoom-in-95"
    >
      <div class="flex items-start gap-3">
        <div class="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shrink-0">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>

        <div class="flex-1 min-w-0">
          <h3 id="crash-modal-title" class="text-sm font-bold text-[var(--ca-text-primary)]">Application Crash Diagnostic</h3>
          <p class="text-[11px] text-[var(--ca-text-muted)] mt-0.5 leading-relaxed">
            A previous session ended unexpectedly. Would you like to submit an anonymous, scrubbed crash report to help us fix the issue?
          </p>
        </div>
      </div>

      <div class="p-3 rounded-xl bg-[var(--ca-surface-subtle)] border border-[var(--ca-border)] space-y-1.5 font-mono text-[11px]">
        <div class="flex items-center justify-between text-[var(--ca-text-muted)]">
          <span>Crash ID:</span>
          <span class="text-[var(--ca-text-secondary)]">{report.id}</span>
        </div>
        {#if report.appName}
          <div class="flex items-center justify-between text-[var(--ca-text-muted)]">
            <span>Application:</span>
            <span class="text-[var(--ca-text-secondary)]">{report.appName} v{report.appVersion || '0.1.0'}</span>
          </div>
        {/if}
        {#if report.os}
          <div class="flex items-center justify-between text-[var(--ca-text-muted)]">
            <span>Operating System:</span>
            <span class="text-[var(--ca-text-secondary)]">{report.os}</span>
          </div>
        {/if}
      </div>

      <div>
        <button
          type="button"
          onclick={() => (showDetails = !showDetails)}
          class="text-[11px] text-[var(--ca-brand)] hover:underline flex items-center gap-1 cursor-pointer"
        >
          <span>{showDetails ? 'Hide Diagnostic Details' : 'View Scrubbed Diagnostics'}</span>
          <svg class="w-3 h-3 transition-transform {showDetails ? 'rotate-180' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {#if showDetails}
          <pre class="mt-2 p-3 rounded-lg bg-[var(--ca-surface-subtle)] border border-[var(--ca-border)] text-[10px] font-mono text-[var(--ca-text-muted)] max-h-40 overflow-y-auto whitespace-pre-wrap leading-relaxed">{report.stackTrace || 'No stack trace available.'}</pre>
        {/if}
      </div>

      <div class="flex items-center gap-2 pt-1">
        <input
          id="never-again-crash"
          type="checkbox"
          bind:checked={neverAgain}
          class="rounded border-[var(--ca-border)] bg-[var(--ca-surface-subtle)] text-[var(--ca-brand)] focus:ring-0"
        />
        <label for="never-again-crash" class="text-[11px] text-[var(--ca-text-muted)] cursor-pointer">
          Don't ask again for future reports
        </label>
      </div>

      <div class="flex items-center justify-between pt-3 border-t border-[var(--ca-border)]">
        <button
          type="button"
          disabled={isDeleting || isSubmitting}
          onclick={handleDelete}
          class="px-3 py-1.5 rounded-lg text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors cursor-pointer"
        >
          {isDeleting ? 'Discarding...' : 'Discard'}
        </button>

        <div class="flex items-center gap-2">
          <button
            type="button"
            onclick={() => (open = false)}
            class="px-3 py-1.5 rounded-lg text-xs font-medium text-[var(--ca-text-muted)] hover:text-[var(--ca-text-primary)] transition-colors cursor-pointer"
          >
            Later
          </button>
          <button
            type="button"
            disabled={isSubmitting || isDeleting}
            onclick={handleSend}
            class="px-4 py-1.5 rounded-lg text-xs font-semibold bg-[var(--ca-brand)] text-[var(--ca-brand-contrast)] hover:opacity-90 disabled:opacity-50 transition-all cursor-pointer shadow-xs"
          >
            {isSubmitting ? 'Sending...' : 'Send Anonymously'}
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}
