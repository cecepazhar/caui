<script lang="ts">
  interface Props {
    open?: boolean;
    title?: string;
    description?: string;
    onsubmit?: (data: { rating: number; content: string; name?: string; profession?: string }) => Promise<void> | void;
    ondismiss?: () => void;
    class?: string;
  }

  let {
    open = $bindable(false),
    title = 'How is your experience?',
    description = 'Help us polish and perfect the ecosystem.',
    onsubmit,
    ondismiss,
    class: customClass = '',
  }: Props = $props();

  let rating = $state(5);
  let hoverRating = $state(0);
  let name = $state('');
  let profession = $state('');
  let content = $state('');
  let isSubmitting = $state(false);
  let submitted = $state(false);
  let errorMessage = $state('');

  const ratingLabels: Record<number, string> = {
    1: 'Poor',
    2: 'Fair',
    3: 'Good',
    4: 'Very Good',
    5: 'Excellent'
  };

  async function handleSubmit(e: Event) {
    e.preventDefault();
    if (rating < 1 || rating > 5) {
      errorMessage = 'Please select a rating between 1 and 5 stars.';
      return;
    }

    isSubmitting = true;
    errorMessage = '';

    try {
      if (onsubmit) {
        await onsubmit({ rating, content: content.trim() || `${rating} stars`, name, profession });
      }
      submitted = true;
    } catch (err: any) {
      errorMessage = err?.message || 'Failed to submit feedback';
    } finally {
      isSubmitting = false;
    }
  }

  function handleClose() {
    open = false;
    ondismiss?.();
  }
</script>

{#if open}
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs {customClass}">
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="feedback-title"
      class="relative w-full max-w-md rounded-2xl border border-[var(--ca-border,#27272a)] bg-[var(--ca-surface-base,#141414)] shadow-2xl p-6 text-left space-y-4 text-xs text-[var(--ca-text-primary,#fafafa)] animate-in fade-in zoom-in-95"
    >
      <div class="flex items-start justify-between">
        <div>
          <h3 id="feedback-title" class="text-sm font-bold text-[var(--ca-text-primary,#fafafa)]">{title}</h3>
          <p class="text-[11px] text-[var(--ca-text-muted,#a1a1aa)] mt-0.5">{description}</p>
        </div>
        <button
          type="button"
          onclick={handleClose}
          class="p-1 rounded text-[var(--ca-text-muted,#a1a1aa)] hover:text-[var(--ca-text-primary,#fafafa)] hover:bg-[var(--ca-surface-subtle,#27272a)] cursor-pointer"
          aria-label="Close"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {#if submitted}
        <div class="py-8 text-center space-y-2">
          <div class="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 mx-auto flex items-center justify-center">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h4 class="text-sm font-bold text-[var(--ca-text-primary,#fafafa)]">Thank You!</h4>
          <p class="text-[11px] text-[var(--ca-text-muted,#a1a1aa)]">Your feedback helps us continuously improve.</p>
          <button
            type="button"
            onclick={handleClose}
            class="mt-4 px-4 py-2 bg-[var(--ca-brand,#6366f1)] text-white rounded-lg text-xs font-semibold hover:opacity-90 cursor-pointer"
          >
            Close
          </button>
        </div>
      {:else}
        <form onsubmit={handleSubmit} class="space-y-3.5">
          <!-- Star Rating -->
          <div>
            <div class="flex items-center gap-1.5 justify-center py-2" role="group" aria-label="Star rating">
              {#each [1, 2, 3, 4, 5] as star}
                <button
                  type="button"
                  onclick={() => (rating = star)}
                  onmouseenter={() => (hoverRating = star)}
                  onmouseleave={() => (hoverRating = 0)}
                  class="p-1 text-2xl transition-transform hover:scale-110 cursor-pointer focus:outline-none"
                  aria-label={`${star} star`}
                >
                  <span class={(hoverRating || rating) >= star ? 'text-amber-400' : 'text-[var(--ca-border,#3f3f46)]'}>★</span>
                </button>
              {/each}
            </div>
            <p class="text-center text-[11px] font-semibold text-amber-400">
              {ratingLabels[hoverRating || rating]}
            </p>
          </div>

          <div>
            <label for="fb-notes" class="block text-[11px] font-semibold text-[var(--ca-text-secondary,#d4d4d8)] mb-1">Your Feedback</label>
            <textarea
              id="fb-notes"
              rows="3"
              bind:value={content}
              placeholder="What do you love? What can be improved?"
              class="w-full px-3 py-2 bg-[var(--ca-surface-subtle,#18181b)] border border-[var(--ca-border,#27272a)] rounded-lg text-xs text-[var(--ca-text-primary,#fafafa)] placeholder-[var(--ca-text-muted,#71717a)] focus:outline-none focus:border-[var(--ca-brand,#6366f1)]"
            ></textarea>
          </div>

          <div class="grid grid-cols-2 gap-2">
            <div>
              <label for="fb-name" class="block text-[10px] font-medium text-[var(--ca-text-muted,#a1a1aa)] mb-1">Name (optional)</label>
              <input
                id="fb-name"
                type="text"
                bind:value={name}
                placeholder="Alex"
                class="w-full px-2.5 py-1.5 bg-[var(--ca-surface-subtle,#18181b)] border border-[var(--ca-border,#27272a)] rounded-lg text-xs text-[var(--ca-text-primary,#fafafa)] focus:outline-none focus:border-[var(--ca-brand,#6366f1)]"
              />
            </div>
            <div>
              <label for="fb-prof" class="block text-[10px] font-medium text-[var(--ca-text-muted,#a1a1aa)] mb-1">Role / Tech (optional)</label>
              <input
                id="fb-prof"
                type="text"
                bind:value={profession}
                placeholder="DevOps Engineer"
                class="w-full px-2.5 py-1.5 bg-[var(--ca-surface-subtle,#18181b)] border border-[var(--ca-border,#27272a)] rounded-lg text-xs text-[var(--ca-text-primary,#fafafa)] focus:outline-none focus:border-[var(--ca-brand,#6366f1)]"
              />
            </div>
          </div>

          {#if errorMessage}
            <p class="text-rose-400 text-[11px]">{errorMessage}</p>
          {/if}

          <div class="flex items-center justify-end gap-2 pt-2 border-t border-[var(--ca-border,#27272a)]">
            <button
              type="button"
              onclick={handleClose}
              class="px-3 py-1.5 rounded-lg text-xs text-[var(--ca-text-muted,#a1a1aa)] hover:text-[var(--ca-text-primary,#fafafa)] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              class="px-4 py-1.5 rounded-lg text-xs font-semibold bg-[var(--ca-brand,#6366f1)] text-white hover:opacity-90 disabled:opacity-50 transition-all cursor-pointer shadow-xs"
            >
              {isSubmitting ? 'Submitting...' : 'Send Feedback'}
            </button>
          </div>
        </form>
      {/if}
    </div>
  </div>
{/if}
