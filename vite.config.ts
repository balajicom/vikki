import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve( /vikki, '.'),
    },
  },
  server: {
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
});
