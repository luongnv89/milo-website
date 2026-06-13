import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Served from GitHub Pages as a project site:
// https://luongnv89.github.io/milo-website/
// The base path prefixes every Vite-processed asset so they resolve under
// the /milo-website/ subpath instead of the domain root.
export default defineConfig({
  base: '/milo-website/',
  plugins: [react(), tailwindcss()],
});
