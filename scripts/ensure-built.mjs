import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
if (['react', 'hooks', 'tokens', 'governance'].some((name) => !existsSync(new URL(`../packages/${name}/dist/index.d.ts`, import.meta.url)))) {
  const result = spawnSync('pnpm', ['-r', 'build'], { stdio: 'inherit' });
  process.exit(result.status ?? 1);
}
