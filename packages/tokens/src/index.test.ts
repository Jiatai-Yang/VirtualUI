import { createThemeCSS, darkColors, flattenTokens, tokens } from './index';
it('exports every token exactly once and generates matching light and dark CSS', () => {
  const variables = flattenTokens();
  expect(Object.keys(variables)).toHaveLength(Object.values(tokens).reduce((sum, group) => sum + Object.keys(group).length, 0));
  const css = createThemeCSS();
  Object.entries(variables).forEach(([key, value]) => expect(css).toContain(`${key}: ${value};`));
  expect(css).toContain('[data-vui-theme="dark"]'); expect(css).toContain(darkColors.accent); expect(Object.keys(darkColors)).toEqual(Object.keys(tokens.color));
});
