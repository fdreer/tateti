<script>
  /** @type {{ nameX: string, nameO: string, scoreX: number, scoreO: number, round: number }} */
  let { nameX, nameO, scoreX, scoreO, round } = $props();
</script>

<div class="scoreboard">
  <div class="scoreboard__player">
    <div class="scoreboard__name">{nameX}</div>
    <div class="scoreboard__meta">
      <span class="scoreboard__symbol scoreboard__symbol--x">X</span>
      <span>Vos</span>
    </div>
  </div>

  <div class="scoreboard__center">
    <div class="scoreboard__digits">
      <span class="ghost-d" data-num={scoreX}>8</span>
      <span style="color:var(--c-ink-soft);font-size:32px;line-height:1">—</span>
      <span class="ghost-d" data-num={scoreO}>8</span>
    </div>
    <div class="scoreboard__round">Ronda {round}</div>
  </div>

  <div class="scoreboard__player is-right">
    <div class="scoreboard__name">{nameO}</div>
    <div class="scoreboard__meta">
      <span>Rival</span>
      <span class="scoreboard__symbol scoreboard__symbol--o">O</span>
    </div>
  </div>
</div>
