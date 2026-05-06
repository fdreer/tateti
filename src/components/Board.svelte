<script>
  import Cell from './Cell.svelte';
  import { WIN_LINES } from '../lib/gameLogic.js';

  /** @type {{ board: (string|null)[], winningCombo: number[]|null, onMove: (i: number) => void, disabled?: boolean }} */
  let { board, winningCombo, onMove, disabled = false } = $props();

  const lineCoords = $derived(
    winningCombo ? WIN_LINES[winningCombo.join(',')] : null
  );
</script>

<div style="position:relative;max-width:460px;margin:0 auto;width:100%">
  <div class="board-ticks"><span></span><span></span><span></span><span></span></div>
  <div class="board">
    {#each board as value, i}
      <Cell
        {value}
        index={i}
        onClick={onMove}
        disabled={disabled || !!value}
        isWin={!!winningCombo && winningCombo.includes(i)}
        dimmed={!!winningCombo && !winningCombo.includes(i)}
      />
    {/each}
  </div>
  {#if lineCoords}
    <svg class="winline" viewBox="0 0 100 100" preserveAspectRatio="none">
      <line
        x1={lineCoords[0]} y1={lineCoords[1]}
        x2={lineCoords[2]} y2={lineCoords[3]}
      />
    </svg>
  {/if}
</div>
