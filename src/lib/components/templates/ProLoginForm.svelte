<script lang="ts">
  type Mode = 'login' | 'register' | 'forgot' | 'checkEmail';

  interface Props {
    title?: string;
    onSignedIn?: (account: { email: string; name?: string; plan?: string }) => void;
    onSubmit?: (data: { mode: Mode; email: string; password?: string; name?: string }) => Promise<void> | void;
    class?: string;
  }

  let {
    title = 'Sign In to Pro Account',
    onSignedIn,
    onSubmit,
    class: customClass = '',
  }: Props = $props();

  let mode = $state<Mode>('login');
  let name = $state('');
  let email = $state('');
  let password = $state('');
  let confirm = $state('');
  let busy = $state(false);
  let error = $state('');
  let notice = $state('');

  function switchMode(next: Mode) {
    mode = next;
    error = '';
    notice = '';
  }

  async function handleSubmit(event: Event) {
    event.preventDefault();
    error = '';
    notice = '';

    if (mode === 'register' && password !== confirm) {
      error = 'Passwords do not match.';
      return;
    }

    busy = true;
    try {
      if (onSubmit) {
        await onSubmit({ mode, email, password, name });
      }
      if (mode === 'login') {
        onSignedIn?.({ email, name, plan: 'pro' });
      } else if (mode === 'register') {
        mode = 'checkEmail';
      } else if (mode === 'forgot') {
        notice = 'Password reset instructions sent to your email.';
      }
    } catch (err: any) {
      error = err?.message || 'Authentication request failed.';
    } finally {
      busy = false;
    }
  }
</script>

<div class="w-full space-y-4 text-xs text-[var(--ca-text-primary,#fafafa)] {customClass}">
  {#if mode === 'checkEmail'}
    <div class="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 space-y-2 text-center">
      <h4 class="font-bold text-sm">Check Your Inbox</h4>
      <p class="text-[11px] leading-relaxed">
        We sent a verification link to <strong class="text-white">{email}</strong>. Please confirm your email to activate your account.
      </p>
      <button
        type="button"
        onclick={() => switchMode('login')}
        class="mt-2 text-[var(--ca-brand,#6366f1)] hover:underline font-semibold cursor-pointer"
      >
        Back to Sign In
      </button>
    </div>
  {:else}
    <form onsubmit={handleSubmit} class="space-y-3.5">
      {#if mode === 'register'}
        <div>
          <label for="pro-name" class="block text-[11px] font-semibold text-[var(--ca-text-muted,#a1a1aa)] mb-1">Your Name</label>
          <input
            id="pro-name"
            type="text"
            bind:value={name}
            placeholder="Alex Vance"
            class="w-full px-3 py-2 bg-[var(--ca-surface-subtle,#18181b)] border border-[var(--ca-border,#27272a)] rounded-lg text-xs text-[var(--ca-text-primary,#fafafa)] focus:outline-none focus:border-[var(--ca-brand,#6366f1)]"
          />
        </div>
      {/if}

      <div>
        <label for="pro-email" class="block text-[11px] font-semibold text-[var(--ca-text-muted,#a1a1aa)] mb-1">Email Address</label>
        <input
          id="pro-email"
          type="email"
          required
          bind:value={email}
          placeholder="name@company.com"
          class="w-full px-3 py-2 bg-[var(--ca-surface-subtle,#18181b)] border border-[var(--ca-border,#27272a)] rounded-lg text-xs text-[var(--ca-text-primary,#fafafa)] focus:outline-none focus:border-[var(--ca-brand,#6366f1)]"
        />
      </div>

      {#if mode !== 'forgot'}
        <div>
          <div class="flex items-center justify-between mb-1">
            <label for="pro-password" class="text-[11px] font-semibold text-[var(--ca-text-muted,#a1a1aa)]">Password</label>
            {#if mode === 'login'}
              <button
                type="button"
                onclick={() => switchMode('forgot')}
                class="text-[10px] text-[var(--ca-brand,#6366f1)] hover:underline cursor-pointer"
              >
                Forgot Password?
              </button>
            {/if}
          </div>
          <input
            id="pro-password"
            type="password"
            required
            bind:value={password}
            placeholder="••••••••••••"
            class="w-full px-3 py-2 bg-[var(--ca-surface-subtle,#18181b)] border border-[var(--ca-border,#27272a)] rounded-lg text-xs text-[var(--ca-text-primary,#fafafa)] focus:outline-none focus:border-[var(--ca-brand,#6366f1)]"
          />
        </div>
      {/if}

      {#if mode === 'register'}
        <div>
          <label for="pro-confirm" class="block text-[11px] font-semibold text-[var(--ca-text-muted,#a1a1aa)] mb-1">Confirm Password</label>
          <input
            id="pro-confirm"
            type="password"
            required
            bind:value={confirm}
            placeholder="••••••••••••"
            class="w-full px-3 py-2 bg-[var(--ca-surface-subtle,#18181b)] border border-[var(--ca-border,#27272a)] rounded-lg text-xs text-[var(--ca-text-primary,#fafafa)] focus:outline-none focus:border-[var(--ca-brand,#6366f1)]"
          />
        </div>
      {/if}

      {#if error}
        <p class="text-rose-400 text-[11px]">{error}</p>
      {/if}

      {#if notice}
        <p class="text-emerald-400 text-[11px]">{notice}</p>
      {/if}

      <button
        type="submit"
        disabled={busy}
        class="w-full py-2.5 bg-[var(--ca-brand,#6366f1)] hover:opacity-90 disabled:opacity-50 text-white font-semibold rounded-lg text-xs transition-all cursor-pointer shadow-sm"
      >
        {#if busy}
          Authenticating...
        {:else if mode === 'login'}
          Sign In
        {:else if mode === 'register'}
          Create Pro Account
        {:else}
          Reset Password
        {/if}
      </button>

      <div class="text-center text-[11px] text-[var(--ca-text-muted,#71717a)] pt-2">
        {#if mode === 'login'}
          Don't have an account?
          <button type="button" onclick={() => switchMode('register')} class="text-[var(--ca-brand,#6366f1)] hover:underline ml-1 font-semibold cursor-pointer">
            Sign Up
          </button>
        {:else}
          Already have an account?
          <button type="button" onclick={() => switchMode('login')} class="text-[var(--ca-brand,#6366f1)] hover:underline ml-1 font-semibold cursor-pointer">
            Sign In
          </button>
        {/if}
      </div>
    </form>
  {/if}
</div>
