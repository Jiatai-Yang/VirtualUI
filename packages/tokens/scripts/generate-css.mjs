import { writeFile } from 'node:fs/promises';
import { createThemeCSS } from '../dist/index.js';
await writeFile(new URL('../dist/styles.css', import.meta.url), createThemeCSS());
