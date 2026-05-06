<script>
  /** @type {{ symbol: 'X'|'O', name: string, wins: number, isActive?: boolean }} */
  let { symbol, name, wins, isActive = false } = $props();
</script>

<div class="frame player-card" class:is-active={isActive}>
  <div class="xs muted">{symbol === 'X' ? '// Jugador' : '// Rival'}</div>
  <div class="player-card__sym" style:color="var(--c-{symbol.toLowerCase()})">{symbol}</div>
  <div class="player-card__name">{name}</div>
  <hr class="rule" style="margin:10px 0;width:100%" />
  <div class="xs muted" style="margin-bottom:6px">Victorias</div>
  <div class="pc-score-wrap">
    <span class="pc-score-ghost">8</span>
    <span class="pc-score-val">{wins}</span>
  </div>
</div>
