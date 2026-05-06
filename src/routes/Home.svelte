<script>
  import Sysbar from '../components/Sysbar.svelte';
  import BrandRow from '../components/BrandRow.svelte';
  import { game, resetGame } from '../lib/state.svelte.js';
  import { navigate } from '../lib/router.svelte.js';
  import { uppercase } from '../lib/actions.js';

  let playerName = $state('');

  function startLocal() {
    const name = (playerName.trim() || 'JUGADOR 1').toUpperCase().slice(0, 12);
    game.names = { X: name, O: 'JUGADOR 2' };
    resetGame();
    navigate('/game');
  }

  function goOnline() {
    navigate('/online');
  }
</script>

<div class="device">
  <Sysbar />

  <div class="home-body">
    <BrandRow />

    <div class="frame" style="padding: var(--s-3) var(--s-4)">
      <div class="label">Tu nombre</div>
      <input
        class="input"
        type="text"
        placeholder="JUGADOR 1"
        maxlength="12"
        autocomplete="off"
        spellcheck="false"
        bind:value={playerName}
        use:uppercase
        onkeydown={(e) => e.key === 'Enter' && startLocal()}
      />
    </div>

    <button class="btn btn--primary btn--lg btn--block" onclick={startLocal}>
      Jugar acá →
    </button>

    <div class="or-divider">o</div>

    <button class="btn btn--ghost btn--lg btn--block" onclick={goOnline}>
      Jugar online
    </button>
  </div>

  <div class="home-footer">TATETI™ © '86</div>
</div>
