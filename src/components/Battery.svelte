<script>
  /** @type {{ bars?: number }} */
  let { bars = 3 } = $props();
</script>

<span class="lcd-batt">
  {#each Array(bars) as _}
    <i></i>
  {/each}
</span>
