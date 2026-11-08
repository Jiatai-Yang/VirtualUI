import { catalog, checkCode, recommendComponents } from './index';
it('recommends supported components in English and Chinese and returns no invented matches', () => {
  expect(recommendComponents('Button')[0]?.name).toBe('Button');
  expect(recommendComponents('需要一个下拉选择组件').map((item) => item.name)).toContain('Select');
  expect(recommendComponents('quantum sandwich')).toEqual([]); expect(recommendComponents('')).toEqual([]);
  expect(catalog).toHaveLength(8);
});
it('reports mixed state, missing callbacks and names with accurate locations', () => {
  const result = checkCode('const Demo = () => (\n  <Select value="a" defaultValue="b" options={[]} />\n);');
  expect(result.passed).toBe(false);
  expect(result.findings.map((finding) => finding.rule)).toEqual(expect.arrayContaining(['mixed-state', 'controlled-callback', 'accessible-name']));
  expect(result.findings[0]).toMatchObject({ line: 2, column: 3 });
});
it('detects literal colors, unknown tokens, raw HTML and primitive buttons', () => {
  const code = 'const Demo = () => <button style={{color: "#ff0000", background: "var(--vui-color-missing)"}} dangerouslySetInnerHTML={{__html: text}} />';
  const result = checkCode(code);
  expect(result.findings.map((finding) => finding.rule)).toEqual(expect.arrayContaining(['literal-color', 'unknown-token', 'unsafe-html', 'prefer-component']));
  expect(result.passed).toBe(false);
});
it('accepts documented tokens, controlled callbacks and accessible labels', () => {
  const result = checkCode('const Demo = () => <Select label="Choice" value={value} onValueChange={setValue} options={[]} style={{color: "var(--vui-color-accent)"}} />');
  expect(result.findings).toEqual([]); expect(result.passed).toBe(true);
  expect(checkCode('<Input aria-label="Read only" value="hello" readOnly />').findings).toEqual([]);
});
it('resolves aliases and namespace imports and exempts explicit read-only controls', () => {
  expect(checkCode('import { Select as Choice } from "@virtuui/react/select"; const x = <Choice value="x" />;').findings.map((finding) => finding.rule)).toContain('controlled-callback');
  expect(checkCode('import * as UI from "@virtuui/react"; const x = <UI.Switch checked defaultChecked label="Updates" />;').passed).toBe(false);
  expect(checkCode('<Button />').findings[0]?.rule).toBe('accessible-name');
  expect(checkCode('<Button aria-label="Add" />').findings).toEqual([]);
  expect(checkCode('<Input label="Name" disabled value="Ada" />').findings).toEqual([]);
});
