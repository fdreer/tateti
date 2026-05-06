<script>
  import Sysbar from '../components/Sysbar.svelte';
  import CodeDisplay from '../components/CodeDisplay.svelte';
  import Slot from '../components/Slot.svelte';
  import { screen, room, game } from '../lib/state.svelte.js';
</script>

<div class="device grain">
  <Sysbar left="SALA {room.code || '-----'}" connection="waiting" />

  <div class="brand-row" style="padding-bottom:0">
    <div class="brand-sub" style="letter-spacing:.18em">// Sala creada</div>
  </div>

  <div style="padding:var(--s-4);display:flex;flex-direction:column;gap:var(--s-5)">
    <CodeDisplay code={room.code} />

    <div class="frame" style="padding: var(--s-4)">
      <div class="label" style="margin-bottom:var(--s-3)">Jugadores</div>
      <div class="slots">
        <Slot symbol="X" name={game.names.X} role="Vos · creaste la sala" status="ready" />
        <Slot symbol="O" status="waiting" />
      </div>
    </div>

    <button class="btn btn--ghost btn--block" onclick={() => screen.current = 'home'}>
      Cancelar
    </button>
  </div>
</div>
