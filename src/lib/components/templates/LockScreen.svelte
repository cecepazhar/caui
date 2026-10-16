<script lang="ts">
  import { onMount } from 'svelte';

  interface Props {
    appName?: string;
    appVersion?: string;
    isSetup?: boolean;
    title?: string;
    description?: string;
    onunlock?: (password: string) => Promise<boolean> | boolean;
    onreset?: () => Promise<void> | void;
    onsetup?: (data: { name: string; password: string }) => Promise<void> | void;
    class?: string;
  }

  let {
    appName = 'CA Sovereign Application',
    appVersion = '1.0.0',
    isSetup = false,
    title = 'Welcome Back',
    description = 'Encrypted Zero-Knowledge Workspace',
    onunlock,
    onreset,
    onsetup,
    class: customClass = '',
  }: Props = $props();

  let name = $state('');
  let password = $state('');
  let showPassword = $state(false);
  let errorMsg = $state('');
  let isLoading = $state(false);
  let failedAttempts = $state(0);
  let lockoutRemaining = $state(0);

  async function handleSubmit(e: Event) {
    e.preventDefault();
    if (lockoutRemaining > 0) return;

    if (!password) {
      errorMsg = 'Please enter your master password.';
      return;
    }
    if (password.length < 8) {
      errorMsg = 'Master password must be at least 8 characters.';
      return;
    }

    isLoading = true;
    errorMsg = '';

    try {
      if (isSetup) {
        await onsetup?.({ name, password });
      } else {
        const ok = await onunlock?.(password);
        if (ok === false) {
          failedAttempts += 1;
          if (failedAttempts >= 5) {
            lockoutRemaining = 300;
            const timer = setInterval(() => {
              lockoutRemaining -= 1;
              if (lockoutRemaining <= 0) {
                clearInterval(timer);
                failedAttempts = 0;
              }
            }, 1000);
            errorMsg = 'Too many attempts. Locked for 5 minutes.';
          } else {
            errorMsg = `Invalid master password. ${5 - failedAttempts} attempts remaining.`;
          }
        }
      }
    } catch (err: any) {
      errorMsg = err?.message || 'Authentication failed.';
    } finally {
      isLoading = false;
    }
  }
</script>

<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[var(--ca-surface-base,#0a0a0a)] text-[var(--ca-text-primary,#fafafa)] select-none {customClass}">
  <div class="w-full max-w-sm p-8 rounded-3xl border border-[var(--ca-border,#27272a)] bg-[var(--ca-surface-base,#141414)] shadow-2xl space-y-6 text-center animate-in fade-in zoom-in-95">
    <!-- Brand badge -->
    <div class="mx-auto w-12 h-12 rounded-2xl bg-[var(--ca-brand,#6366f1)]/15 border border-[var(--ca-brand,#6366f1)]/30 flex items-center justify-center text-[var(--ca-brand,#6366f1)] shadow-inner">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    </div>

    <div>
      <h2 class="text-xl font-bold tracking-tight text-[var(--ca-text-primary,#fafafa)]">
        {isSetup ? 'Setup Master Vault' : title}
      </h2>
      <p class="text-xs text-[var(--ca-text-muted,#a1a1aa)] mt-1">
        {appName} <span class="font-mono text-[10px] text-[var(--ca-text-muted,#71717a)]">v{appVersion}</span>
      </p>
    </div>

    {#if errorMsg}
      <div class="p-3 text-xs rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
        {errorMsg}
      </div>
    {/if}

    <form onsubmit={handleSubmit} class="space-y-4 text-left">
      {#if isSetup}
        <div>
          <label for="lock-name" class="block text-[11px] font-semibold text-[var(--ca-text-muted,#a1a1aa)] mb-1">Your Name</label>
          <input
            id="lock-name"
            type="text"
            bind:value={name}
            placeholder="Operator"
            class="w-full px-3 py-2.5 bg-[var(--ca-surface-subtle,#18181b)] border border-[var(--ca-border,#27272a)] rounded-xl text-xs text-[var(--ca-text-primary,#fafafa)] focus:outline-none focus:border-[var(--ca-brand,#6366f1)]"
          />
        </div>
      {/if}

      <div>
        <label for="lock-pass" class="block text-[11px] font-semibold text-[var(--ca-text-muted,#a1a1aa)] mb-1">
          {isSetup ? 'Create Master Password' : 'Enter Master Password'}
        </label>
        <div class="relative">
          <input
            id="lock-pass"
            type={showPassword ? 'text' : 'password'}
            bind:value={password}
            disabled={lockoutRemaining > 0}
            placeholder="••••••••••••"
            class="w-full pl-3 pr-10 py-2.5 bg-[var(--ca-surface-subtle,#18181b)] border border-[var(--ca-border,#27272a)] rounded-xl text-xs text-[var(--ca-text-primary,#fafafa)] focus:outline-none focus:border-[var(--ca-brand,#6366f1)] disabled:opacity-50"
          />
          <button
            type="button"
            onclick={() => (showPassword = !showPassword)}
            class="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-[var(--ca-text-muted,#a1a1aa)] hover:text-white cursor-pointer"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading || lockoutRemaining > 0}
        class="w-full py-2.5 bg-[var(--ca-brand,#6366f1)] hover:opacity-90 disabled:opacity-50 text-white font-semibold rounded-xl text-xs transition-all cursor-pointer shadow-md shadow-[var(--ca-brand,#6366f1)]/20"
      >
        {#if isLoading}
          Verifying...
        {:else if lockoutRemaining > 0}
          Locked ({lockoutRemaining}s)
        {:else if isSetup}
          Create & Encrypt Vault
        {:else}
          Unlock Vault
        {/if}
      </button>
    </form>

    <div class="flex items-center justify-between text-[11px] text-[var(--ca-text-muted,#71717a)] pt-2 border-t border-[var(--ca-border,#27272a)]">
      {#if !isSetup && onreset}
        <button
          type="button"
          onclick={onreset}
          class="hover:text-rose-400 transition-colors cursor-pointer"
        >
          Reset Vault
        </button>
      {:else}
        <span></span>
      {/if}
      <span class="font-mono text-[10px]">AES-256-GCM · Argon2id</span>
    </div>
  </div>
</div>
