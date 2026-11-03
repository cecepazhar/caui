<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { ComponentVariant } from './types';
  import type { Entitlements } from '../../license/entitlements.svelte';
  import { t } from '../../i18n.svelte';
  import { Lock } from 'lucide-svelte';

  type ProGateVariant = Extract<ComponentVariant, 'primary' | 'secondary' | 'danger' | 'ghost'>;

  interface Props {
    children?: Snippet;
    /** Custom locked-state content. Replaces the default upgrade card. */
    fallback?: Snippet;
    /** Human-readable feature name shown in the upgrade prompt. */
    featureName?: string;
    /** Feature id checked against `entitlements` (preferred over `locked`). */
    feature?: string;
    entitlements?: Entitlements;
    /** Manual override. Ignored when `entitlements` + `feature` are given. */
    locked?: boolean;
    variant?: ProGateVariant;
    upgradeLabel?: string;
    onUpgrade?: () => void;
    class?: string;
  }

  let {
    children,
    fallback,
    featureName,
    feature,
    entitlements,
    locked = false,
    variant = 'primary',
    upgradeLabel,
    onUpgrade,
    class: customClass = '',
  }: Props = $props();

  const isLocked = $derived(entitlements && feature ? !entitlements.has(feature) : locked);
  const message = $derived(
    featureName ? t('pro.pro_feature').replace('{feature}', featureName) : t('pro.pro_feature_generic')
  );

  const buttonCls: Record<ProGateVariant, string> = {
    primary: 'bg-[var(--ca-brand)] text-white hover:opacity-90',
    secondary:
      'bg-[var(--ca-surface-subtle)] border border-[var(--ca-border)] text-[var(--ca-text-primary)] hover:opacity-80',
    danger: 'bg-[var(--ca-danger)] text-white hover:opacity-90',
    ghost: 'bg-transparent text-[var(--ca-text-secondary)] hover:bg-[var(--ca-surface-subtle)]',
  };
</script>

{#if !isLocked}
  {@render children?.()}
{:else if fallback}
  {@render fallback()}
{:else}
  <div
    role="region"
    aria-label={message}
    data-pro-locked
    class="rounded-[var(--ca-radius-lg)] border border-dashed border-[var(--ca-border)] bg-[var(--ca-surface-subtle)] p-6 text-center {customClass}"
  >
    <div class="flex flex-col items-center gap-2 text-[var(--ca-text-muted)]">
      <Lock class="w-5 h-5" aria-hidden="true" />
      <p class="text-sm font-medium">{message}</p>
      {#if onUpgrade}
        <button
          type="button"
          onclick={onUpgrade}
          class="mt-2 inline-flex items-center gap-1.5 rounded-[var(--ca-radius-md)] px-3 py-1.5 text-xs font-semibold transition-opacity cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ca-brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ca-surface)] {buttonCls[variant]}"
        >
          {upgradeLabel ?? t('pro.upgrade')}
        </button>
      {/if}
    </div>
  </div>
{/if}
