import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig } from 'vite';
import { sourceAliases } from '../vite.shared';
const config: StorybookConfig = {
  stories: ['../src/stories/**/*.stories.tsx'],
  addons: ['@storybook/addon-docs'],
  framework: { name: '@storybook/react-vite', options: {} },
  core: { disableTelemetry: true },
  docs: { defaultName: 'Documentation' },
  viteFinal: (config) => mergeConfig(config, { resolve: { alias: sourceAliases } }),
};
export default config;
