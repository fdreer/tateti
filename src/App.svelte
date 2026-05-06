<script>
  import { screen } from './lib/state.svelte.js';
  import Home from './routes/Home.svelte';
  import OnlineSetup from './routes/OnlineSetup.svelte';
  import WaitingRoom from './routes/WaitingRoom.svelte';
  import Game from './routes/Game.svelte';
</script>

{#if screen.current === 'home'}
  <Home />
{:else if screen.current === 'online'}
  <OnlineSetup />
{:else if screen.current === 'waiting'}
  <WaitingRoom />
{:else if screen.current === 'game'}
  <Game />
{/if}
