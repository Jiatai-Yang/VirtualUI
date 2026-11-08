import type { Preview } from '@storybook/react-vite';
import '@virtuui/react/styles.css';
const preview: Preview = {
  tags: ['autodocs'],
  parameters: { layout: 'centered', controls: { expanded: true } },
  globalTypes: { theme: { description: 'Theme', toolbar: { title: 'Theme', icon: 'paintbrush', items: ['light', 'dark'], dynamicTitle: true } } },
  initialGlobals: { theme: 'light' },
  decorators: [(Story, context) => <div data-vui-theme={context.globals.theme} style={{ background: 'var(--vui-color-background)', color: 'var(--vui-color-text)', fontFamily: 'var(--vui-font-sans)', padding: 32, minWidth: 330 }}><Story /></div>],
};
export default preview;
