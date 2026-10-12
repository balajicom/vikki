import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';


export default defineConfig(({ command }) => {
  // Use relative base './' for universal compatibility across GitHub Pages (/vikki/),
  // custom domains, root deployments, or subdirectories, preventing blank page issues.
  const base = process.env.VITE_BASE_URL || (command === 'serve' ? '/' : './');

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
          '**/data/*',
          '**/public/**',
          '**/dist/**',
          '**/vikki/**',
          '**/docs/**',
          '**/*.json',
          '**/node_modules/**',
          (p: string) => typeof p === 'string' && (
            p.includes('/data/') ||
            p.includes('/public/') ||
            p.includes('/dist/') ||
            p.includes('/vikki/') ||
            p.includes('/docs/') ||
            p.endsWith('.json')
          ),
        ],
      },
    },
  };
});
