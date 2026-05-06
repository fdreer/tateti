/** Svelte action — fuerza uppercase en tiempo real */
export function uppercase(node) {
  function handler() {
    const p = node.selectionStart;
    node.value = node.value.toUpperCase();
    try { node.setSelectionRange(p, p); } catch (_) {}
  }
  node.addEventListener('input', handler);
  return { destroy() { node.removeEventListener('input', handler); } };
}
