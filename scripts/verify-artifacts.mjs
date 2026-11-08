import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { build } from 'vite';
import * as React from 'react';
import { renderToString } from 'react-dom/server';
import vm from 'node:vm';

const root = fileURLToPath(new URL('../', import.meta.url));
for (const name of ['react', 'hooks', 'tokens', 'governance', 'mcp']) {
  const directory = new URL(`../packages/${name}/`, import.meta.url);
  const pkg = JSON.parse(await readFile(new URL('package.json', directory), 'utf8'));
  for (const entry of Object.values(pkg.exports)) {
    for (const target of typeof entry === 'string' ? [entry] : Object.values(entry)) await access(new URL(target, directory));
  }
  await access(new URL('LICENSE', directory));
  await access(new URL('README.md', directory));
  console.log(`✓ @virtuui/${name}: exports, types, README and license`);
}
const components = await import('../packages/react/dist/index.js');
const expected = ['Badge', 'Button', 'Card', 'Input', 'Menu', 'Select', 'Switch', 'Tabs'];
assert.deepEqual(Object.keys(components).sort(), expected);
assert.match(renderToString(React.createElement(components.Button, null, 'SSR works')), /SSR works/);
const require = createRequire(import.meta.url);
const umdPath = new URL('../packages/react/dist/virtuui.umd.cjs', import.meta.url);
const umd = require(fileURLToPath(umdPath));
assert.deepEqual(Object.keys(umd).sort(), expected);
const context = vm.createContext({ React });
vm.runInContext(await readFile(umdPath, 'utf8'), context);
assert.deepEqual(Object.keys(context.VirtuUI).sort(), expected);
assert.match(renderToString(React.createElement(context.VirtuUI.Button, null, 'Global works')), /Global works/);
console.log('✓ ESM, CommonJS, browser UMD global and SSR');

const output = await build({
  configFile: false, root, logLevel: 'silent',
  plugins: [{ name: 'button-consumer', resolveId(id) { if (id.endsWith('virtual:consumer')) return '\0virtual:consumer'; }, load(id) { if (id === '\0virtual:consumer') return `export { Button } from ${JSON.stringify(fileURLToPath(new URL('../packages/react/dist/index.js', import.meta.url)))};`; } }],
  build: { write: false, lib: { entry: 'virtual:consumer', formats: ['es'] }, rollupOptions: { external: (id) => /^(react|react-dom)(\/|$)/.test(id) } },
});
const chunks = (Array.isArray(output) ? output : [output]).flatMap((result) => result.output);
const code = chunks.filter((item) => item.type === 'chunk').map((item) => item.code).join('\n');
assert.match(code, /vui-button/);
assert.doesNotMatch(code, /vui-menu|vui-tablist|vui-select|vui-switch|useControllableState/);
assert.doesNotMatch(code, /react\.production|__CLIENT_INTERNALS|createRoot/);
console.log(`✓ Button-only consumer tree-shakes unused components (${Buffer.byteLength(code)} bytes, React external)`);

const mcpRequire = createRequire(new URL('../packages/mcp/package.json', import.meta.url));
const { Client } = await import(pathToFileURL(mcpRequire.resolve('@modelcontextprotocol/sdk/client/index.js')).href);
const { StdioClientTransport } = await import(pathToFileURL(mcpRequire.resolve('@modelcontextprotocol/sdk/client/stdio.js')).href);
const client = new Client({ name: 'virtuui-verification', version: '1.0.0' });
const transport = new StdioClientTransport({ command: process.execPath, args: [fileURLToPath(new URL('../packages/mcp/dist/index.js', import.meta.url))], stderr: 'pipe' });
try {
  await client.connect(transport);
  assert.equal((await client.listTools()).tools.length, 4);
  const resources = (await client.listResources()).resources;
  assert.equal(resources.length, 3);
  for (const resource of resources) {
    const response = await client.readResource({ uri: resource.uri });
    assert.ok(JSON.parse(response.contents[0].text));
  }
  const docs = await client.callTool({ name: 'get_component_docs', arguments: { name: 'Button' } });
  assert.equal(JSON.parse(docs.content[0].text).name, 'Button');
  const recommendation = await client.callTool({ name: 'recommend_components', arguments: { query: '下拉选择' } });
  assert.equal(JSON.parse(recommendation.content[0].text)[0].name, 'Select');
  const result = await client.callTool({ name: 'check_code', arguments: { code: '<Select value="a" defaultValue="b" />' } });
  assert.equal(JSON.parse(result.content[0].text).passed, false);
  const tokenResult = await client.callTool({ name: 'get_design_tokens', arguments: {} });
  assert.ok(JSON.parse(tokenResult.content[0].text).variables['--vui-color-accent']);
  const invalid = await client.callTool({ name: 'get_component_docs', arguments: { name: 'Missing' } });
  assert.equal(invalid.isError, true);
  console.log('✓ MCP stdio handshake, 4 tools, 3 resources and input validation');
} finally { await client.close(); }
