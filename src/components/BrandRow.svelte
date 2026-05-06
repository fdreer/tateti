<script>
  /** @type {{ title?: string, subtitle?: string, style?: string }} */
  let { title = 'TATETI', subtitle = 'Tic-tac-toe · field edition', style = '' } = $props();
</script>

<div class="brand-row" {style}>
  <h1 class="brand">{title}</h1>
  {#if subtitle}
    <div class="brand-sub">{subtitle}</div>
  {/if}
</div>
