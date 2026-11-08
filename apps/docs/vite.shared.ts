import { fileURLToPath } from 'node:url';
const source = (path: string) => fileURLToPath(new URL(`../../packages/${path}`, import.meta.url));
export const sourceAliases = [
  { find: '@virtuui/react/styles.css', replacement: source('react/src/styles.css') },
  { find: /^@virtuui\/react$/, replacement: source('react/src/index.tsx') },
  { find: /^@virtuui\/hooks$/, replacement: source('hooks/src/index.ts') },
  { find: /^@virtuui\/tokens$/, replacement: source('tokens/src/index.ts') },
  { find: '@virtuui/governance/catalog', replacement: source('governance/src/catalog.ts') },
];
