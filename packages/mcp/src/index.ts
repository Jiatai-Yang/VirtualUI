#!/usr/bin/env node
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createServer } from './server.js';
const server = createServer();
await server.connect(new StdioServerTransport());
const shutdown = async () => { await server.close(); process.exit(0); };
process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown);
