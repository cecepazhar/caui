<script lang="ts">
  import '../app.css';
  import { onMount } from 'svelte';
  let { children } = $props();

  onMount(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    const savedBrand = localStorage.getItem('ca-brand');
    if (savedBrand) {
      document.documentElement.style.setProperty('--ca-brand', savedBrand);
    }
  });
</script>

<div class="min-h-screen bg-[var(--ca-surface)] text-[var(--ca-text-primary)] font-sans antialiased transition-colors duration-200">
  {@render children()}
</div>
