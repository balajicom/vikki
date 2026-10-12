import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(({ command }) => {
  // Use '/' by default for AI Studio & standard hosting, or '/vikki/' if building specifically for GitHub Pages
  const base = process.env.VITE_BASE_URL || (process.env.GITHUB_PAGES === 'true' ? '/vikki/' : '/');

  return {
    base,
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio to prevent unexpected page reloads
      hmr: false,
      watch: {
        ignored: [
          '**/data/**',
          '**/public/**',
          '**/dist/**',
          '**/*.json',
          '**/node_modules/**',
        ],
      },
    },
  };
});
