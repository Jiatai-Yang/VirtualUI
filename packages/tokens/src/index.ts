/** The single source for runtime tokens, generated CSS and AI resources. */
export const tokens = {
  color: {
    accent: '#52734d', accentHover: '#405d3c', accentSoft: '#edf3e9',
    background: '#f8f9f6', surface: '#ffffff', text: '#20271f', muted: '#65715f',
    border: '#e4e8df', danger: '#b53d36', dangerSoft: '#fff0ee', focus: '#64865e',
  },
  space: { '1': '4px', '2': '8px', '3': '12px', '4': '16px', '5': '20px', '6': '24px', '8': '32px', '10': '40px', '12': '48px' },
  radius: { sm: '6px', md: '10px', lg: '16px', full: '999px' },
  font: { sans: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', mono: '"SFMono-Regular", Consolas, monospace' },
  duration: { fast: '120ms', normal: '200ms' },
} as const;

export const darkColors = {
  accent: '#a3c593', accentHover: '#b6d8a6', accentSoft: '#293a27',
  background: '#171c17', surface: '#202720', text: '#edf2e9', muted: '#a0ac9a',
  border: '#394437', danger: '#f39a92', dangerSoft: '#442b29', focus: '#b6d8a6',
} satisfies Record<keyof typeof tokens.color, string>;

const kebab = (name: string) => name.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
export function flattenTokens() {
  return Object.fromEntries(Object.entries(tokens).flatMap(([group, values]) =>
    Object.entries(values).map(([key, value]) => [`--vui-${group}-${kebab(key)}`, value]),
  ));
}
export function createThemeCSS() {
  const declarations = Object.entries(flattenTokens()).map(([key, value]) => `  ${key}: ${value};`).join('\n');
  const dark = Object.entries(darkColors).map(([key, value]) => `  --vui-color-${kebab(key)}: ${value};`).join('\n');
  return `:root, [data-vui-theme="light"] {\n  color-scheme: light;\n${declarations}\n}\n[data-vui-theme="dark"] {\n  color-scheme: dark;\n${dark}\n}\n`;
}
