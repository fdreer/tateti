<script>
  /** @type {{ code: string }} */
  let { code } = $props();

  let copied = $state(false);
  let hint = $state('// Compartí este código con tu rival');

  async function copyCode() {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      copied = true;
      hint = '// ¡Copiado al portapapeles!';
    } catch {
      hint = '// Código: ' + code;
    }
    setTimeout(() => {
      copied = false;
      hint = '// Compartí este código con tu rival';
    }, 2000);
  }
</script>

<div class="code-display">
  <div class="code-display__ghost" aria-hidden="true">88888</div>
  <div class="code-display__code">{code || '-----'}</div>
  <button
    class="code-display__copy"
    class:is-copied={copied}
    onclick={copyCode}
    title="Copiar código"
  >
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
         stroke="currentColor" stroke-width="1.5"
         stroke-linecap="round" stroke-linejoin="round">
      <rect x="5" y="5" width="9" height="9" rx="1"/>
      <path d="M3 11H2a1 1 0 01-1-1V2a1 1 0 011-1h8a1 1 0 011 1v1"/>
    </svg>
  </button>
  <div class="code-display__hint">{hint}</div>
</div>
