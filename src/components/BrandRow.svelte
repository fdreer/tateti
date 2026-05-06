<script>
  /** @type {{ title?: string, subtitle?: string, ghostLen?: number, style?: string }} */
  let { title = 'TATETI', subtitle = 'Tic-tac-toe · field edition', ghostLen = 5, style = '' } = $props();
  const ghost = $derived('8'.repeat(ghostLen));
</script>

<div class="brand-row" {style}>
  <span class="brand ghost" aria-hidden="true">{ghost}</span>
  <h1 class="brand">{title}</h1>
  {#if subtitle}
    <div class="brand-sub">{subtitle}</div>
  {/if}
</div>
