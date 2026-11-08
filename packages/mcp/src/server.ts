import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { catalog, checkCode, guidelines, recommendComponents } from '@virtuui/governance';
import { darkColors, flattenTokens, tokens } from '@virtuui/tokens';

export function createServer() {
  const server = new McpServer({ name: 'virtuui', version: '0.1.0' });
  const resources = [
    { name: 'components', uri: 'virtuui://components', data: catalog, description: 'Component APIs, examples and accessibility contracts.' },
    { name: 'tokens', uri: 'virtuui://tokens', data: { tokens, darkColors, variables: flattenTokens() }, description: 'Canonical theme values and CSS variables.' },
    { name: 'guidelines', uri: 'virtuui://guidelines', data: guidelines, description: 'Engineering and accessibility conventions.' },
  ];
  for (const resource of resources) server.registerResource(resource.name, resource.uri, { description: resource.description, mimeType: 'application/json' }, async (uri) => ({ contents: [{ uri: uri.href, mimeType: 'application/json', text: JSON.stringify(resource.data, null, 2) }] }));
  const result = (data: unknown) => ({ content: [{ type: 'text' as const, text: JSON.stringify(data, null, 2) }] });
  const annotations = { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false };
  server.registerTool('recommend_components', { description: 'Find matching VirtuUI components by English or Chinese requirements. Empty results mean no supported match.', inputSchema: { query: z.string().min(1).max(2000) }, annotations }, async ({ query }) => result(recommendComponents(query)));
  server.registerTool('get_component_docs', { description: 'Get component props, examples and accessibility notes.', inputSchema: { name: z.enum(['Button', 'Input', 'Select', 'Switch', 'Tabs', 'Menu', 'Badge', 'Card']) }, annotations }, async ({ name }) => result(catalog.find((component) => component.name === name)));
  server.registerTool('check_code', { description: 'Analyze TSX without executing it for token drift, unsafe HTML, state conflicts and missing accessible labels. Advisory, not a complete security or accessibility audit.', inputSchema: { code: z.string().max(100000) }, annotations }, async ({ code }) => result(checkCode(code)));
  server.registerTool('get_design_tokens', { description: 'Read canonical CSS variables and light/dark theme values.', inputSchema: {}, annotations }, async () => result({ variables: flattenTokens(), darkColors }));
  return server;
}
