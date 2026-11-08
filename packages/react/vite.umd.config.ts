import { defineConfig } from 'vite';
export default defineConfig({
  esbuild: { jsx: 'transform', jsxInject: "import * as React from 'react'" },
  build: {
    emptyOutDir: false,
    lib: { cssFileName: 'styles', entry: 'src/index.tsx', name: 'VirtuUI', formats: ['umd'], fileName: () => 'virtuui.umd.cjs' },
    rollupOptions: { external: ['react', 'react-dom'], output: { globals: { react: 'React', 'react-dom': 'ReactDOM' } } },
  },
});
