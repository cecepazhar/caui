<script lang="ts">
  export interface TeamMember {
    id: string;
    name?: string;
    email: string;
    role: 'owner' | 'admin' | 'member';
    addedAt?: string;
  }

  interface Props {
    seats?: number;
    members?: TeamMember[];
    oninvite?: (email: string, role: string) => Promise<void> | void;
    onremove?: (id: string) => Promise<void> | void;
    class?: string;
  }

  let {
    seats = 7,
    members = $bindable([
      { id: '1', name: 'Cecep Azhar', email: 'owner@fathforce.com', role: 'owner', addedAt: 'Oct 2026' }
    ]),
    oninvite,
    onremove,
    class: customClass = '',
  }: Props = $props();

  let inviteEmail = $state('');
  let inviteRole = $state('member');
  let isInviting = $state(false);
  let error = $state('');

  const usedSeats = $derived(members.length);
  const remainingSeats = $derived(Math.max(0, seats - usedSeats));

  async function handleInvite(e: Event) {
    e.preventDefault();
    if (!inviteEmail || !inviteEmail.includes('@')) {
      error = 'Please enter a valid email address.';
      return;
    }
    if (usedSeats >= seats) {
      error = 'Seat limit reached. Upgrade team seats to invite more members.';
      return;
    }

    isInviting = true;
    error = '';
    try {
      if (oninvite) {
        await oninvite(inviteEmail, inviteRole);
      } else {
        members = [
          ...members,
          {
            id: Date.now().toString(),
            email: inviteEmail,
            role: inviteRole as any,
            addedAt: 'Just now'
          }
        ];
      }
      inviteEmail = '';
    } catch (err: any) {
      error = err?.message || 'Failed to send invitation.';
    } finally {
      isInviting = false;
    }
  }

  async function handleRemove(id: string) {
    if (onremove) {
      await onremove(id);
    } else {
      members = members.filter((m) => m.id !== id);
    }
  }
</script>

<div class="bg-[var(--ca-surface-base,#141414)] border border-[var(--ca-border,#27272a)] rounded-2xl p-6 text-xs text-[var(--ca-text-primary,#fafafa)] space-y-6 {customClass}">
  <!-- Header with seats count -->
  <div class="flex items-start justify-between gap-4">
    <div>
      <div class="flex items-center gap-2">
        <h3 class="text-base font-bold text-[var(--ca-text-primary,#fafafa)]">Team Collaboration</h3>
        <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[var(--ca-brand,#6366f1)]/10 text-[var(--ca-brand,#6366f1)] border border-[var(--ca-brand,#6366f1)]/30 font-mono">
          {usedSeats} / {seats} Seats Used
        </span>
      </div>
      <p class="text-xs text-[var(--ca-text-muted,#a1a1aa)] mt-1">
        Invite teammates to collaborate with end-to-end encrypted envelope syncing.
      </p>
    </div>

    <div class="text-right">
      <span class="text-2xl font-bold font-mono text-[var(--ca-brand,#6366f1)]">{remainingSeats}</span>
      <span class="block text-[10px] text-[var(--ca-text-muted,#71717a)] uppercase tracking-wider">Seats Left</span>
    </div>
  </div>

  <!-- Invite Bar -->
  <form onsubmit={handleInvite} class="flex flex-col sm:flex-row gap-2">
    <input
      type="email"
      bind:value={inviteEmail}
      placeholder="colleague@company.com"
      class="flex-1 px-3 py-2 bg-[var(--ca-surface-subtle,#18181b)] border border-[var(--ca-border,#27272a)] rounded-xl text-xs text-[var(--ca-text-primary,#fafafa)] placeholder-[var(--ca-text-muted,#71717a)] focus:outline-none focus:border-[var(--ca-brand,#6366f1)]"
    />
    <select
      bind:value={inviteRole}
      class="px-3 py-2 bg-[var(--ca-surface-subtle,#18181b)] border border-[var(--ca-border,#27272a)] rounded-xl text-xs text-[var(--ca-text-primary,#fafafa)] focus:outline-none focus:border-[var(--ca-brand,#6366f1)] cursor-pointer"
    >
      <option value="member">Member</option>
      <option value="admin">Admin</option>
    </select>
    <button
      type="submit"
      disabled={isInviting || remainingSeats <= 0}
      class="px-4 py-2 bg-[var(--ca-brand,#6366f1)] hover:opacity-90 disabled:opacity-40 text-white font-semibold rounded-xl text-xs transition-all cursor-pointer shrink-0 shadow-xs"
    >
      {isInviting ? 'Sending...' : 'Invite Member'}
    </button>
  </form>

  {#if error}
    <p class="text-rose-400 text-[11px]">{error}</p>
  {/if}

  <!-- Members List -->
  <div class="space-y-2">
    <h4 class="text-[11px] font-semibold text-[var(--ca-text-secondary,#d4d4d8)] uppercase tracking-wider">Active Members</h4>
    <div class="divide-y divide-[var(--ca-border,#27272a)] border border-[var(--ca-border,#27272a)] rounded-xl overflow-hidden bg-[var(--ca-surface-subtle,#18181b)]/50">
      {#each members as member (member.id)}
        <div class="p-3 flex items-center justify-between gap-3">
          <div class="flex items-center gap-3 min-w-0">
            <div class="w-8 h-8 rounded-full bg-[var(--ca-surface-subtle,#27272a)] border border-[var(--ca-border,#3f3f46)] flex items-center justify-center font-bold text-xs text-[var(--ca-brand,#6366f1)]">
              {(member.name || member.email).slice(0, 1).toUpperCase()}
            </div>
            <div class="min-w-0">
              <div class="flex items-center gap-2">
                <span class="font-semibold text-[var(--ca-text-primary,#fafafa)] truncate">{member.name || member.email}</span>
                <span class="px-1.5 py-0.2 rounded text-[10px] font-mono uppercase bg-[var(--ca-surface-subtle,#27272a)] border border-[var(--ca-border,#3f3f46)] text-[var(--ca-text-muted,#a1a1aa)]">
                  {member.role}
                </span>
              </div>
              <span class="text-[10px] text-[var(--ca-text-muted,#71717a)] truncate block">{member.email}</span>
            </div>
          </div>

          {#if member.role !== 'owner'}
            <button
              type="button"
              onclick={() => handleRemove(member.id)}
              class="p-1 rounded text-[var(--ca-text-muted,#71717a)] hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
              title="Remove member"
              aria-label="Remove member"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          {/if}
        </div>
      {/each}
    </div>
  </div>
</div>
