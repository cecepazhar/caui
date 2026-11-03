<script lang="ts">
  import type { LicenseTier } from '../../license/types';
  import { t } from '../../i18n.svelte';

  interface Props {
    tier?: Exclude<LicenseTier, 'free'>;
    /** Optional override text. */
    label?: string;
    class?: string;
  }

  let { tier = 'pro', label, class: customClass = '' }: Props = $props();
</script>

<span
  data-tier={tier}
  class="inline-flex items-center rounded-[var(--ca-radius-sm)] border border-[var(--ca-brand)]/40 bg-[var(--ca-brand)]/10 px-1.5 py-px font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--ca-brand)] {customClass}"
>
  {label ?? t(`pro.${tier}`)}
</span>
