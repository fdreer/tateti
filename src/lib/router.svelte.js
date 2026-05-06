export const router = $state({
  path: typeof window !== 'undefined' ? window.location.pathname : '/',
});

export function navigate(path) {
  history.pushState(null, '', path);
  router.path = path;
}

if (typeof window !== 'undefined') {
  window.addEventListener('popstate', () => {
    router.path = window.location.pathname;
  });
}
