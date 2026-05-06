<script>
  import { router } from './lib/router.svelte.js';
  import Home from './routes/Home.svelte';
  import OnlineSetup from './routes/OnlineSetup.svelte';
  import WaitingRoom from './routes/WaitingRoom.svelte';
  import Game from './routes/Game.svelte';
</script>

{#if router.path === '/'}
  <Home />
{:else if router.path === '/online'}
  <OnlineSetup />
{:else if router.path === '/waiting'}
  <WaitingRoom />
{:else if router.path === '/game'}
  <Game />
{:else}
  <Home />
{/if}
