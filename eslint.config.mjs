import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import hooks from 'eslint-plugin-react-hooks';
import globals from 'globals';

export default tseslint.config(
  { ignores: ['**/dist/**', '**/node_modules/**', '**/storybook-static/**', 'coverage/**'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    rules: { '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }] },
  },
  {
    files: ['**/*.{ts,tsx}'],
    plugins: { 'react-hooks': hooks },
    rules: hooks.configs.recommended.rules,
  },
  {
    files: ['packages/{tokens,hooks}/src/**/*.{ts,tsx}'],
    rules: { 'no-restricted-imports': ['error', { patterns: ['@virtuui/react', '@virtuui/governance', '@virtuui/mcp', '@virtuui/docs'] }] },
  },
  {
    files: ['packages/react/src/**/*.{ts,tsx}'],
    rules: { 'no-restricted-imports': ['error', { patterns: ['@virtuui/governance', '@virtuui/mcp', '@virtuui/docs'] }] },
  },
  {
    files: ['packages/governance/src/**/*.ts'],
    rules: { 'no-restricted-imports': ['error', { patterns: ['@virtuui/react', '@virtuui/mcp', '@virtuui/docs'] }] },
  },
);
