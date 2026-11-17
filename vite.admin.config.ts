import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// EP-01 P8: the operator page, delivered by the operator worker as static
// assets. Fixed file names, because the worker's page shell names them; the
// output stays outside `dist` (never on GitHub Pages) and outside Git.
// `vite --config vite.admin.config.ts` serves a local review page
// (src/admin/index.html) that never saves anything.
export default defineConfig({
  base: '/',
  plugins: [react()],
  publicDir: false,
  build: {
    outDir: '.admin-build',
    emptyOutDir: true,
    // No data: URLs; the page's CSP allows files of its own origin only.
    assetsInlineLimit: 0,
    modulePreload: false,
    rollupOptions: {
      input: 'src/admin/main.tsx',
      output: {
        entryFileNames: 'assets/admin.js',
        assetFileNames: 'assets/admin[extname]',
        inlineDynamicImports: true,
      },
    },
  },
});
