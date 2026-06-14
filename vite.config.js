import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Served from GitHub Pages at the apex custom domain:
// https://askmilo.pro/
// Root domain, so assets resolve at the domain root (no subpath prefix).
export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss()],
});
