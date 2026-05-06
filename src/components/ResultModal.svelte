<script>
  import { game, nextRound } from '../lib/state.svelte.js';
  import { navigate } from '../lib/router.svelte.js';

  /** @type {{ result: 'win'|'draw', winnerName?: string, onNextRound?: () => void, onExit?: () => void }} */
  let {
    result,
    winnerName  = '',
    onNextRound = nextRound,
    onExit      = () => navigate('/'),
  } = $props();

  const scoreLine = $derived(
    `${game.names.X} ${game.scores.X} — ${game.scores.O} ${game.names.O}`
  );
</script>

<div class="overlay">
  <div class="modal">
    <span class="regmark tl"></span><span class="regmark tr"></span>
    <span class="regmark bl"></span><span class="regmark br"></span>
    <div class="modal__sub">// Resultado</div>
    <h2 class="modal__title {result}">
      {result === 'win' ? `¡${winnerName} GANÓ!` : 'EMPATE'}
    </h2>
    <p class="muted sm" style="margin:0 0 20px">
      {#if result === 'draw'}
        Nadie gana esta ronda.<br/>
      {/if}
      Marcador: <strong>{scoreLine}</strong>
    </p>
    <div class="stack">
      <button class="btn btn--primary btn--lg btn--block" onclick={onNextRound}>
        Jugar otra →
      </button>
      <button class="btn btn--ghost btn--block" onclick={onExit}>
        Salir
      </button>
    </div>
  </div>
</div>
