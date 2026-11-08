import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../', import.meta.url));
const initial = spawn('pnpm', ['-r', 'build'], { cwd: root, stdio: 'inherit' });
const status = await new Promise((resolve) => initial.on('exit', resolve));
if (status !== 0) process.exit(status ?? 1);
const children = [];
let stopping = false;
function stop(code = 0) {
  if (stopping) return;
  stopping = true;
  for (const child of children) child.kill('SIGTERM');
  process.exitCode = code;
}
function run(args, directory = root) {
  const child = spawn('pnpm', args, { cwd: directory, stdio: 'inherit' });
  children.push(child);
  child.on('error', (error) => { console.error(error.message); stop(1); });
  child.on('exit', (code) => { if (!stopping) stop(code ?? 1); });
}
// Docs aliases source components/hooks/catalog for immediate HMR; token CSS is generated.
run(['exec', 'tsc', '-p', 'tsconfig.build.json', '--watch', '--preserveWatchOutput'], `${root}/packages/tokens`);
run(['exec', 'node', '--watch', 'scripts/generate-css.mjs'], `${root}/packages/tokens`);
run(['--filter', '@virtuui/docs', 'dev']);
process.once('SIGINT', () => stop());
process.once('SIGTERM', () => stop());
