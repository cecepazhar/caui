<script lang="ts">
  import type { LicenseClient } from '../../license/client.svelte';
  import { formatExpiry } from '../../license';
  import { t, getLocale } from '../../i18n.svelte';
  import ProBadge from '../ui/ProBadge.svelte';

  interface Props {
    client: LicenseClient;
    /** Shows an extra field to paste a signed token (air-gapped activation). */
    allowOfflineImport?: boolean;
    class?: string;
  }

  let { client, allowOfflineImport = true, class: customClass = '' }: Props = $props();

  let key = $state('');
  let offlineToken = $state('');
  let feedback = $state<{ ok: boolean; text: string } | null>(null);

  const statusText = (s: string) => t(`pro.status_${s}`, s);

  async function activate() {
    if (!key.trim()) {
      feedback = { ok: false, text: t('pro.license_enter_key') };
      return;
    }
    const r = await client.activate(key);
    feedback = { ok: r.ok, text: r.status === 'rejected' ? `${statusText(r.status)}: ${r.message}` : statusText(r.status) };
    if (r.ok) key = '';
  }

  async function importOffline() {
    const r = await client.importToken(offlineToken);
    feedback = { ok: r.ok, text: statusText(r.status) };
    if (r.ok) offlineToken = '';
  }

  async function copyToken() {
    const tok = await client.exportToken();
    if (!tok) return;
    await navigator.clipboard.writeText(tok);
    feedback = { ok: true, text: t('pro.license_copied') };
  }

  const inputCls =
    'w-full rounded-[var(--ca-radius-md)] border border-[var(--ca-border)] bg-[var(--ca-surface)] px-3 py-2 font-mono text-xs text-[var(--ca-text-primary)] placeholder:text-[var(--ca-text-muted)] focus-visible:outline-none focus-visible:border-[var(--ca-brand)]';
  const btnPrimary =
    'w-full rounded-[var(--ca-radius-md)] bg-[var(--ca-brand)] px-4 py-2 text-xs font-semibold text-[var(--ca-brand-contrast)] transition-opacity hover:opacity-90 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ca-brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ca-surface)]';
  const btnSecondary =
    'w-full rounded-[var(--ca-radius-md)] border border-[var(--ca-border)] bg-[var(--ca-surface-subtle)] px-4 py-2 text-xs font-semibold text-[var(--ca-text-primary)] transition-colors hover:border-[var(--ca-border-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ca-brand)]';
</script>

<section
  aria-labelledby="ca-license-title"
  class="rounded-[var(--ca-radius-lg)] border border-[var(--ca-border)] bg-[var(--ca-surface-elevated)] p-4 {customClass}"
>
  <header class="mb-4 flex items-center justify-between">
    <h3 id="ca-license-title" class="text-sm font-bold text-[var(--ca-text-primary)]">{t('pro.license_title')}</h3>
    {#if client.isPro}
      <ProBadge tier={client.tier === 'free' ? 'pro' : client.tier} />
    {:else}
      <span class="rounded-[var(--ca-radius-sm)] border border-[var(--ca-border)] px-1.5 py-px font-mono text-[10px] uppercase text-[var(--ca-text-muted)]">{t('pro.free')}</span>
    {/if}
  </header>

  {#if client.isPro && client.claims}
    <dl class="mb-4 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 rounded-[var(--ca-radius-md)] bg-[var(--ca-surface)] p-3 text-xs">
      <dt class="text-[var(--ca-text-muted)]">{t('pro.license_key')}</dt>
      <dd class="font-mono text-[var(--ca-text-primary)]">{client.claims.key}</dd>
      <dt class="text-[var(--ca-text-muted)]">{t('pro.license_product')}</dt>
      <dd class="text-[var(--ca-text-primary)]">{client.claims.product}</dd>
      <dt class="text-[var(--ca-text-muted)]">{t('pro.license_expires')}</dt>
      <dd class="text-[var(--ca-text-primary)]">{formatExpiry(client.tier === 'lifetime' ? 0 : client.claims.exp, getLocale() === 'id' ? 'id-ID' : 'en-US')}</dd>
    </dl>
    <div class="grid gap-2 sm:grid-cols-2">
      <button type="button" class={btnSecondary} onclick={copyToken}>{t('pro.license_export')}</button>
      <button type="button" class={btnSecondary} onclick={() => client.deactivate()}>{t('pro.license_remove')}</button>
    </div>
  {:else}
    <p class="mb-3 text-xs text-[var(--ca-text-secondary)]">
      {client.status === 'none' ? t('pro.license_none') : statusText(client.status)}
    </p>
    <form class="space-y-2" onsubmit={(e) => { e.preventDefault(); activate(); }}>
      <label for="ca-license-key" class="sr-only">{t('pro.license_key')}</label>
      <input id="ca-license-key" bind:value={key} autocomplete="off" spellcheck="false" placeholder="CAXXX-XXXXXX-X" class={inputCls} />
      <button type="submit" disabled={client.busy} class={btnPrimary}>
        {client.busy ? t('pro.license_activating') : t('pro.license_activate')}
      </button>
    </form>
    {#if allowOfflineImport}
      <details class="mt-3 text-xs text-[var(--ca-text-secondary)]">
        <summary class="cursor-pointer select-none">{t('pro.license_import')}</summary>
        <div class="mt-2 space-y-2">
          <label for="ca-license-token" class="sr-only">{t('pro.license_import')}</label>
          <textarea id="ca-license-token" bind:value={offlineToken} rows="3" spellcheck="false" class={inputCls}></textarea>
          <button type="button" class={btnSecondary} onclick={importOffline}>{t('pro.license_import')}</button>
        </div>
      </details>
    {/if}
  {/if}

  {#if feedback}
    <p role="status" class="mt-3 text-xs {feedback.ok ? 'text-[var(--ca-success)]' : 'text-[var(--ca-danger)]'}">{feedback.text}</p>
  {/if}
</section>
