<script lang="ts">
  export interface AiConfigData {
    provider: string;
    model: string;
    apiKey?: string;
    temperature: number;
    maxTokens: number;
    customEndpoint?: string;
  }

  interface Props {
    config?: AiConfigData;
    onsave?: (data: AiConfigData) => Promise<void> | void;
    class?: string;
  }

  let {
    config = $bindable({
      provider: 'openai',
      model: 'gpt-4o',
      apiKey: '',
      temperature: 0.7,
      maxTokens: 4096,
      customEndpoint: ''
    }),
    onsave,
    class: customClass = '',
  }: Props = $props();

  let isSaving = $state(false);
  let saved = $state(false);
  let error = $state('');

  const providers = [
    { id: 'openai', name: 'OpenAI (Official)' },
    { id: 'anthropic', name: 'Anthropic (Claude)' },
    { id: 'local', name: 'Local Ollama / 9Router' },
    { id: 'custom', name: 'Custom OpenAI-Compatible' }
  ];

  async function handleSubmit(e: Event) {
    e.preventDefault();
    isSaving = true;
    error = '';
    saved = false;

    try {
      if (onsave) {
        await onsave(config);
      }
      saved = true;
      setTimeout(() => (saved = false), 3000);
    } catch (err: any) {
      error = err?.message || 'Failed to save AI configuration.';
    } finally {
      isSaving = false;
    }
  }
</script>

<div class="bg-[var(--ca-surface-base,#141414)] border border-[var(--ca-border,#27272a)] rounded-2xl p-6 text-xs text-[var(--ca-text-primary,#fafafa)] space-y-6 {customClass}">
  <div>
    <h3 class="text-base font-bold text-[var(--ca-text-primary,#fafafa)]">AI Assistant & Model Configuration</h3>
    <p class="text-xs text-[var(--ca-text-muted,#a1a1aa)] mt-1">
      Connect your local or cloud intelligence providers to power copilots, code review, and prompt workflows.
    </p>
  </div>

  <form onsubmit={handleSubmit} class="space-y-4">
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label for="ai-provider" class="block text-[11px] font-semibold text-[var(--ca-text-muted,#a1a1aa)] mb-1">Provider</label>
        <select
          id="ai-provider"
          bind:value={config.provider}
          class="w-full px-3 py-2 bg-[var(--ca-surface-subtle,#18181b)] border border-[var(--ca-border,#27272a)] rounded-lg text-xs text-[var(--ca-text-primary,#fafafa)] focus:outline-none focus:border-[var(--ca-brand,#6366f1)]"
        >
          {#each providers as p}
            <option value={p.id}>{p.name}</option>
          {/each}
        </select>
      </div>

      <div>
        <label for="ai-model" class="block text-[11px] font-semibold text-[var(--ca-text-muted,#a1a1aa)] mb-1">Model Name</label>
        <input
          id="ai-model"
          type="text"
          bind:value={config.model}
          placeholder="e.g. gpt-4o, claude-3-5-sonnet, llama3.2"
          class="w-full px-3 py-2 bg-[var(--ca-surface-subtle,#18181b)] border border-[var(--ca-border,#27272a)] rounded-lg text-xs text-[var(--ca-text-primary,#fafafa)] focus:outline-none focus:border-[var(--ca-brand,#6366f1)]"
        />
      </div>
    </div>

    <div>
      <label for="ai-api-key" class="block text-[11px] font-semibold text-[var(--ca-text-muted,#a1a1aa)] mb-1">API Secret Key (E2EE Vault Protected)</label>
      <input
        id="ai-api-key"
        type="password"
        bind:value={config.apiKey}
        placeholder="sk-••••••••••••••••••••••••••••••••"
        class="w-full px-3 py-2 bg-[var(--ca-surface-subtle,#18181b)] border border-[var(--ca-border,#27272a)] rounded-lg text-xs text-[var(--ca-text-primary,#fafafa)] focus:outline-none focus:border-[var(--ca-brand,#6366f1)]"
      />
    </div>

    {#if config.provider === 'local' || config.provider === 'custom'}
      <div>
        <label for="ai-endpoint" class="block text-[11px] font-semibold text-[var(--ca-text-muted,#a1a1aa)] mb-1">Base Endpoint URL</label>
        <input
          id="ai-endpoint"
          type="url"
          bind:value={config.customEndpoint}
          placeholder="http://127.0.0.1:11434/v1 or http://127.0.0.1:20128"
          class="w-full px-3 py-2 bg-[var(--ca-surface-subtle,#18181b)] border border-[var(--ca-border,#27272a)] rounded-lg text-xs text-[var(--ca-text-primary,#fafafa)] focus:outline-none focus:border-[var(--ca-brand,#6366f1)]"
        />
      </div>
    {/if}

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
      <div>
        <div class="flex items-center justify-between mb-1">
          <label for="ai-temp" class="text-[11px] font-semibold text-[var(--ca-text-muted,#a1a1aa)]">Temperature</label>
          <span class="font-mono text-[10px] text-[var(--ca-text-muted,#71717a)]">{config.temperature}</span>
        </div>
        <input
          id="ai-temp"
          type="range"
          min="0"
          max="2"
          step="0.05"
          bind:value={config.temperature}
          class="w-full accent-[var(--ca-brand,#6366f1)] cursor-pointer"
        />
      </div>

      <div>
        <div class="flex items-center justify-between mb-1">
          <label for="ai-max-tokens" class="text-[11px] font-semibold text-[var(--ca-text-muted,#a1a1aa)]">Max Tokens</label>
          <span class="font-mono text-[10px] text-[var(--ca-text-muted,#71717a)]">{config.maxTokens}</span>
        </div>
        <input
          id="ai-max-tokens"
          type="range"
          min="512"
          max="16384"
          step="512"
          bind:value={config.maxTokens}
          class="w-full accent-[var(--ca-brand,#6366f1)] cursor-pointer"
        />
      </div>
    </div>

    {#if error}
      <p class="text-rose-400 text-[11px]">{error}</p>
    {/if}

    {#if saved}
      <p class="text-emerald-400 text-[11px]">✓ AI configuration saved successfully.</p>
    {/if}

    <div class="pt-2 flex justify-end">
      <button
        type="submit"
        disabled={isSaving}
        class="px-5 py-2 bg-[var(--ca-brand,#6366f1)] hover:opacity-90 disabled:opacity-50 text-white font-semibold rounded-xl text-xs transition-all cursor-pointer shadow-xs"
      >
        {isSaving ? 'Saving...' : 'Save AI Settings'}
      </button>
    </div>
  </form>
</div>
