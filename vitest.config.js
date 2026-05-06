import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [svelte()],
  resolve: {
    conditions: ['browser'],
  },
  test: {
    include: ['tests/**/*.test.js'],
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.js'],
    coverage: {
      provider: 'v8',
      include: ['src/lib/**', 'src/routes/**'],
      exclude: ['src/lib/firebase.js', 'src/lib/router.svelte.js'],
    },
  },
});
