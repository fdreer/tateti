<script>
  /** @type {{ current: 'X'|'O', currentName: string }} */
  let { current, currentName } = $props();
</script>

<div class="turnbar is-yours">
  <span class="turnbar__sym turnbar__sym--{current.toLowerCase()}">{current}</span>
  <span class="turnbar__txt"><strong>TURNO DE {currentName}</strong></span>
</div>
