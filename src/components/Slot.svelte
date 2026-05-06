<script>
  /** @type {{ symbol: 'X'|'O', name?: string, role?: string, status?: 'ready'|'waiting' }} */
  let { symbol, name = '—', role = '', status = 'waiting' } = $props();
  const isEmpty = $derived(!name || name === '—');
</script>

<div class="slot">
  <div class="slot__avatar slot__avatar--{symbol.toLowerCase()}" style:opacity={isEmpty ? 0.3 : 1}>
    {symbol}
  </div>
  <div>
    <div class="slot__name" style:opacity={isEmpty ? 0.4 : 1}>{name}</div>
    <div class="slot__role" style:opacity={isEmpty ? 0.4 : 1}>{role || (isEmpty ? 'Esperando rival...' : '')}</div>
  </div>
  <div class="slot__status">
    {#if status === 'ready'}
      <span class="dot dot--ok"></span> Listo
    {:else}
      <span class="dots-line"><span></span><span></span><span></span></span>
    {/if}
  </div>
</div>
