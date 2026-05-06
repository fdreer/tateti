<script>
  import { screen } from '../lib/state.svelte.js';

  let canAbandon = $state(false);

  $effect(() => {
    const t = setTimeout(() => { canAbandon = true; }, 30000);
    return () => clearTimeout(t);
  });
</script>

<div class="reconnect-overlay">
  <div class="reconnect-box">
    <div class="reconnect-title">RECONECTANDO</div>
    <p class="muted sm" style="margin:0 0 var(--s-4)">
      El rival se desconectó.<br/>Esperando que vuelva...
    </p>
    <div class="dots-line" style="justify-content:center;margin-bottom:var(--s-4)">
      <span></span><span></span><span></span><span></span><span></span>
    </div>
    <button
      class="btn btn--ghost btn--block"
      disabled={!canAbandon}
      onclick={() => screen.current = 'home'}
    >Abandonar sala</button>
    {#if !canAbandon}
      <div class="xs muted" style="text-align:center;margin-top:8px">// Disponible en 30s</div>
    {/if}
  </div>
</div>
