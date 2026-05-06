<script>
  /** @type {{ value: string|null, onClick: (i: number) => void, index: number, disabled?: boolean, isWin?: boolean, dimmed?: boolean }} */
  let { value, onClick, index, disabled = false, isWin = false, dimmed = false } = $props();
</script>

<button
  class="cell"
  class:is-filled={!!value}
  class:is-x={value === 'X'}
  class:is-o={value === 'O'}
  class:is-win={isWin}
  {disabled}
  style:opacity={dimmed ? '0.28' : ''}
  aria-label="Celda {index + 1}"
  onclick={() => onClick(index)}
>
  {#if value}
    <span class="mark">{value}</span>
  {/if}
</button>
