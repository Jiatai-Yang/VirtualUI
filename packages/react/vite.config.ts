import { defineConfig } from 'vite';
import { resolve } from 'node:path';
export default defineConfig({
  build: {
    lib: { cssFileName: 'styles', entry: Object.fromEntries(['index', 'button', 'input', 'badge', 'card', 'switch', 'menu', 'tabs', 'select'].map((name) => [name, resolve(import.meta.dirname, `src/${name}.tsx`)])), formats: ['es'], fileName: (_format, name) => `${name}.js` },
    sourcemap: true,
    rollupOptions: { external: (id) => /^(react|react-dom)(\/|$)/.test(id) || id.startsWith('@virtuui/'), output: { entryFileNames: '[name].js' } },
  },
});
