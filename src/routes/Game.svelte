<script>
  import Sysbar from '../components/Sysbar.svelte';
  import Scoreboard from '../components/Scoreboard.svelte';
  import TurnBar from '../components/TurnBar.svelte';
  import Board from '../components/Board.svelte';
  import PlayerCard from '../components/PlayerCard.svelte';
  import ResultModal from '../components/ResultModal.svelte';
  import ReconnectOverlay from '../components/ReconnectOverlay.svelte';
  import { game, room, resetBoard } from '../lib/state.svelte.js';
  import { checkWinner, isDraw } from '../lib/gameLogic.js';

  let showModal = $state(false);
  let modalResult = $state(/** @type {'win'|'draw'} */ ('win'));
  let modalWinner = $state('');

  function move(idx) {
    if (game.over || game.board[idx]) return;

    game.board[idx] = game.current;

    const winner = checkWinner(game.board);
    if (winner) {
      game.over = true;
      game.winningCombo = winner;
      game.scores[game.current]++;
      modalResult = 'win';
      modalWinner = game.names[game.current];
      setTimeout(() => { showModal = true; }, 420);
      return;
    }

    if (isDraw(game.board)) {
      game.over = true;
      modalResult = 'draw';
      setTimeout(() => { showModal = true; }, 320);
      return;
    }

    game.current = game.current === 'X' ? 'O' : 'X';
  }

  // Reset modal on board reset
  $effect(() => {
    if (!game.over) showModal = false;
  });
</script>

<div class="device grain device--game" style="position:relative">
  <Sysbar left="LOCAL" />

  <div class="game-body">
    <div class="game-grid">

      <div class="side-panel-wrap">
        <PlayerCard
          symbol="X"
          name={game.names.X}
          wins={game.scores.X}
          isActive={game.current === 'X' && !game.over}
        />
      </div>

      <div class="game-center">
        <Scoreboard
          nameX={game.names.X}
          nameO={game.names.O}
          scoreX={game.scores.X}
          scoreO={game.scores.O}
          round={game.round}
        />

        {#if !game.over}
          <TurnBar current={game.current} currentName={game.names[game.current]} />
        {/if}

        <Board
          board={game.board}
          winningCombo={game.winningCombo}
          onMove={move}
          disabled={game.over}
        />
      </div>

      <div class="side-panel-wrap">
        <PlayerCard
          symbol="O"
          name={game.names.O}
          wins={game.scores.O}
          isActive={game.current === 'O' && !game.over}
        />
      </div>

    </div>
  </div>

  {#if showModal}
    <ResultModal result={modalResult} winnerName={modalWinner} />
  {/if}

  {#if room.status === 'reconnecting'}
    <ReconnectOverlay />
  {/if}
</div>
