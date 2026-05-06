<script>
  import Sysbar from '../components/Sysbar.svelte';
  import Scoreboard from '../components/Scoreboard.svelte';
  import Board from '../components/Board.svelte';
  import ResultModal from '../components/ResultModal.svelte';
  import ReconnectOverlay from '../components/ReconnectOverlay.svelte';
  import { game, room, nextRound } from '../lib/state.svelte.js';
  import { applyMove } from '../lib/gameLogic.js';
  import * as online from '../lib/online.svelte.js';
  import { navigate } from '../lib/router.svelte.js';

  const isOnline = $derived(game.mode === 'online');

  let showModal   = $state(false);
  let modalResult = $state(/** @type {'win'|'draw'} */ ('win'));
  let modalWinner = $state('');

  // ── Move handler ──────────────────────────────────────────────────────────

  function move(idx) {
    if (game.over || game.board[idx]) return;
    // In online mode, only move on your turn
    if (isOnline && room.slot !== game.current) return;

    if (isOnline) {
      online.sendMove(idx);
      return;
    }

    // Local mode
    const r = applyMove(game.board, idx, game.current);
    if (!r.ok) return;

    game.board        = r.board;
    game.winningCombo = r.winningCombo;
    game.over         = r.over;

    if (r.result === 'win') {
      game.scores[game.current]++;
      modalResult = 'win';
      modalWinner = game.names[game.current];
      game.current = r.nextTurn;
      setTimeout(() => { showModal = true; }, 420);
      return;
    }
    if (r.result === 'draw') {
      modalResult = 'draw';
      game.current = r.nextTurn;
      setTimeout(() => { showModal = true; }, 320);
      return;
    }
    game.current = r.nextTurn;
  }

  // ── Online: detect win/draw from subscription updates ─────────────────────

  $effect(() => {
    if (!isOnline || !game.over) return;
    if (game.winningCombo) {
      modalResult = 'win';
      modalWinner = game.names[game.current];
      setTimeout(() => { showModal = true; }, 420);
    } else {
      modalResult = 'draw';
      setTimeout(() => { showModal = true; }, 320);
    }
  });

  // Hide modal when round resets
  $effect(() => {
    if (!game.over) showModal = false;
  });

  // ── Next round / Exit callbacks ───────────────────────────────────────────

  function handleNextRound() {
    isOnline ? online.nextRoundOnline() : nextRound();
  }

  function handleExit() {
    if (isOnline) online.leaveRoom();
    navigate('/');
  }
</script>

<div class="device device--game" style="position:relative">
  <Sysbar left={isOnline ? `SALA ${room.code}` : 'LOCAL'} />

  <div class="game-body">
    <div class="game-center">
      <Scoreboard
        nameX={game.names.X}
        nameO={game.names.O}
        scoreX={game.scores.X}
        scoreO={game.scores.O}
        round={game.round}
      />

      <Board
        board={game.board}
        winningCombo={game.winningCombo}
        onMove={move}
        disabled={game.over || (isOnline && room.slot !== game.current)}
      />
    </div>
  </div>

  {#if showModal}
    <ResultModal
      result={modalResult}
      winnerName={modalWinner}
      onNextRound={handleNextRound}
      onExit={handleExit}
    />
  {/if}

  {#if room.status === 'reconnecting'}
    <ReconnectOverlay />
  {/if}
</div>
