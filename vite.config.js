import { defineConfig } from 'vite';

export default defineConfig({
  // The base URL for the repository on GitHub Pages
  base: '/sports-tournament/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  }
});
