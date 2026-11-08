import { defineConfig } from 'vite';
import { sourceAliases } from './vite.shared';
export default defineConfig({ resolve: { alias: sourceAliases }, server: { port: 5173 }, build: { chunkSizeWarningLimit: 650 } });
