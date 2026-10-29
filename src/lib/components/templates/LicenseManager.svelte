<script lang="ts">
  import { saveLicense, loadLicense, exportKey, isPro, formatExpiry, activateLicense } from '$lib/license';
  
  let key = $state('');
  let status = $state<'idle' | 'loading' | 'success' | 'error'>('idle');
  let message = $state('');
  let license = $derived(loadLicense());
  let pro = $derived(isPro());
  
  function handleActivate() {
    if (!key.trim()) {
      status = 'error';
      message = 'Masukkan kunci lisensi';
      return;
    }
    status = 'loading';
    activateLicense(key).then((res) => {
      status = res.success ? 'success' : 'error';
      message = res.message;
      if (res.success) key = '';
    });
  }
  
  function handleExport() {
    const k = exportKey();
    if (k) {
      navigator.clipboard.writeText(k);
      message = 'Kunci disalin!';
      status = 'success';
    }
  }
</script>

<div class="license-manager p-4 bg-[#121217] rounded-lg border border-[#272732]">
  <div class="flex items-center justify-between mb-4">
    <h3 class="text-lg font-semibold text-white">Lisensi Pro</h3>
    {#if pro}
      <span class="px-2 py-1 text-xs font-medium bg-green-500/20 text-green-400 rounded">Aktif</span>
    {:else}
      <span class="px-2 py-1 text-xs font-medium bg-red-500/20 text-red-400 rounded">Free</span>
    {/if}
  </div>
  
  {#if license}
    <div class="mb-4 p-3 bg-[#0A0A0C] rounded text-sm">
      <p class="text-neutral-400">Kunci: <code class="text-[#60A5FA]">{license.key}</code></p>
      <p class="text-neutral-400">Produk: <span class="text-white">{license.product}</span></p>
      <p class="text-neutral-400">Berakhir: <span class="text-white">{formatExpiry(license.expires_at)}</span></p>
    </div>
    <button onclick={handleExport} class="w-full py-2 px-4 bg-[#272732] hover:bg-[#2563EB] text-white rounded transition-colors">
      Export Kunci
    </button>
  {:else}
    <p class="text-neutral-400 mb-4">Belum ada lisensi. Aktivasi di bawah.</p>
  {/if}
  
  <div class="mt-4 space-y-2">
    <input
      bind:value={key}
      placeholder="CAUI99-XXXXXX-X"
      class="w-full px-3 py-2 bg-[#0A0A0C] border border-[#272732] rounded text-white placeholder-neutral-500 focus:outline-none focus:border-[#2563EB]"
    />
    <button
      onclick={handleActivate}
      disabled={status === 'loading'}
      class="w-full py-2 px-4 bg-[#2563EB] hover:bg-[#60A5FA] disabled:opacity-50 text-white rounded transition-colors"
    >
      {status === 'loading' ? 'Mengaktifkan...' : 'Aktifkan Lisensi'}
    </button>
  </div>
  
  {#if message}
    <p class="mt-2 text-sm {status === 'error' ? 'text-red-400' : 'text-green-400'}">{message}</p>
  {/if}
</div>
