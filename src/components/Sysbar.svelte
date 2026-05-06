<script>
  import Clock from './Clock.svelte';
  import Battery from './Battery.svelte';

  /** @type {{ left?: string, right?: string, connection?: 'offline'|'online'|'waiting'|'reconnecting', bars?: number }} */
  let { left = 'TATETI v0.1', right = 'OFFLINE', connection = 'offline', bars = 3 } = $props();
</script>

<div class="sysbar">
  <span>{left}</span>
  <span class="sep"></span>
  <Clock />
  <span class="sep"></span>
  <span style="display:inline-flex;align-items:center;gap:6px">
    {#if connection === 'waiting'}
      <span class="dot dot--warn"></span> ESPERANDO
    {:else if connection === 'reconnecting'}
      <span class="dot dot--warn"></span> RECONECTANDO
    {:else if connection === 'online'}
      <span class="dot dot--ok"></span> ONLINE
    {:else}
      {right}
    {/if}
    <Battery {bars} />
  </span>
</div>
