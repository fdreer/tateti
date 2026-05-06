<script>
  let time = $state('--:--');

  function updateTime() {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    time = `${hh}:${mm}`;
  }

  $effect(() => {
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  });
</script>

<span class="lcd-clock">
  {time.slice(0,2)}<span class="colon">:</span>{time.slice(3)}
</span>
