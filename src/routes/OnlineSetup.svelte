<script>
  import Sysbar from '../components/Sysbar.svelte';
  import { navigate } from '../lib/router.svelte.js';
  import { uppercase } from '../lib/actions.js';
  import * as online from '../lib/online.svelte.js';

  let playerName  = $state('');
  let joinCode    = $state('');
  let joinError   = $state('');
  let creating    = $state(false);
  let joining     = $state(false);

  async function createRoom() {
    const name = (playerName.trim() || 'JUGADOR').toUpperCase().slice(0, 12);
    creating = true;
    joinError = '';
    try {
      await online.createRoom(name);
      navigate('/waiting');
    } catch (err) {
      joinError = err.message;
    } finally {
      creating = false;
    }
  }

  async function joinRoom() {
    const code = joinCode.trim().toUpperCase();
    joinError = '';
    if (code.length < 4) { joinError = 'Ingresá un código válido'; return; }
    const name = (playerName.trim() || 'JUGADOR').toUpperCase().slice(0, 12);
    joining = true;
    try {
      await online.joinRoom(code, name);
      navigate('/game');
    } catch (err) {
      joinError = err.message;
    } finally {
      joining = false;
    }
  }
</script>

<div class="device">
  <Sysbar left="TATETI v0.1" />

  <div class="brand-row" style="padding-bottom:0">
    <h1 class="brand" style="font-size:clamp(32px,8vw,52px)">ONLINE</h1>
    <div class="brand-sub">Jugá con alguien lejos</div>
  </div>

  <div class="online-body">
    <div class="frame" style="padding: var(--s-3) var(--s-4)">
      <div class="label">Tu nombre</div>
      <input
        class="input"
        type="text"
        placeholder="JUGADOR"
        maxlength="12"
        autocomplete="off"
        spellcheck="false"
        bind:value={playerName}
        use:uppercase
      />
    </div>

    <button class="btn btn--primary btn--lg btn--block" onclick={createRoom} disabled={creating || joining}>
      {creating ? 'Creando…' : 'Crear sala →'}
    </button>

    <div class="or-divider">o</div>

    <div class="frame" style="padding: var(--s-3) var(--s-4)">
      <div class="label">Código de sala</div>
      <input
        class="input input--code"
        class:input--error={!!joinError}
        type="text"
        placeholder="XXXXX"
        maxlength="6"
        autocomplete="off"
        spellcheck="false"
        bind:value={joinCode}
        use:uppercase
        onkeydown={(e) => e.key === 'Enter' && joinRoom()}
      />
      {#if joinError}
        <div class="err">{joinError}</div>
      {/if}
    </div>

    <button class="btn btn--ghost btn--lg btn--block" onclick={joinRoom} disabled={creating || joining}>
      {joining ? 'Uniéndome…' : 'Unirme →'}
    </button>

    <button
      class="btn btn--ghost btn--block"
      style="color:var(--c-ink-soft)"
      onclick={() => navigate('/')}
    >← Volver</button>
  </div>
</div>
