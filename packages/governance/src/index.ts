import ts from 'typescript';
import { flattenTokens } from '@virtuui/tokens';
import { catalog, guidelines } from './catalog.js';
export { catalog, guidelines };
export type { ComponentDoc, PropDoc } from './catalog.js';

export function recommendComponents(query: string) {
  const words = query.toLowerCase().split(/[\s,，]+/).filter(Boolean);
  return catalog.map((component) => ({ ...component, score: words.reduce((score, word) => score + (component.name.toLowerCase() === word ? 5 : component.keywords.some((keyword) => keyword.includes(word) || word.includes(keyword)) ? 2 : 0), 0) }))
    .filter((component) => component.score > 0).sort((a, b) => b.score - a.score);
}

export interface Finding { rule: string; severity: 'warning' | 'error'; line: number; column: number; message: string; suggestion: string }
/** Static, advisory TSX analysis. Never evaluates submitted code or reads files. */
export function checkCode(code: string) {
  const source = ts.createSourceFile('submitted.tsx', code, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const findings: Finding[] = [];
  const knownTokens = flattenTokens();
  const componentAliases = new Map<string, string>();
  const namespaces = new Set<string>();
  source.statements.forEach((statement) => {
    if (!ts.isImportDeclaration(statement) || !ts.isStringLiteral(statement.moduleSpecifier) || !/^@virtuui\/react(?:\/|$)/.test(statement.moduleSpecifier.text)) return;
    const bindings = statement.importClause?.namedBindings;
    if (bindings && ts.isNamedImports(bindings)) bindings.elements.forEach((element) => componentAliases.set(element.name.text, element.propertyName?.text ?? element.name.text));
    if (bindings && ts.isNamespaceImport(bindings)) namespaces.add(bindings.name.text);
  });
  const add = (node: ts.Node, rule: string, message: string, suggestion: string, severity: Finding['severity'] = 'warning') => {
    const position = source.getLineAndCharacterOfPosition(node.getStart(source));
    findings.push({ rule, severity, line: position.line + 1, column: position.character + 1, message, suggestion });
  };
  const visit = (node: ts.Node) => {
    if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
      const rawTag = node.tagName.getText(source);
      const [namespace, member] = rawTag.split('.');
      const tag = componentAliases.get(rawTag) ?? (namespace && namespaces.has(namespace) ? member : rawTag);
      const attributes = node.attributes.properties.filter(ts.isJsxAttribute);
      const names = attributes.map((attr) => attr.name.getText(source));
      const has = (name: string) => names.includes(name);
      if (names.includes('dangerouslySetInnerHTML')) add(node, 'unsafe-html', 'Raw HTML insertion requires security review.', 'Prefer React text children; sanitize externally supplied HTML.', 'error');
      if (catalog.some((component) => component.name === tag)) {
        for (const [controlled, initial, callback] of [['value', 'defaultValue', tag === 'Input' ? 'onChange' : 'onValueChange'], ['checked', 'defaultChecked', 'onCheckedChange'], ['open', 'defaultOpen', 'onOpenChange']]) {
          if (controlled && initial && has(controlled) && has(initial)) add(node, 'mixed-state', `${tag} mixes ${controlled} and ${initial}.`, `Remove ${initial} for controlled usage.`, 'error');
          if (controlled && callback && has(controlled) && !has(callback) && !has('readOnly') && !has('disabled')) add(node, 'controlled-callback', `${tag} has ${controlled} without ${callback}.`, `Provide ${callback} to update the controlled state.`);
        }
        if (['Input', 'Select', 'Switch', 'Tabs', 'Menu'].includes(tag ?? '') && !has('label') && !has('aria-label') && !has('aria-labelledby')) add(node, 'accessible-name', `${tag} has no explicit accessible name.`, 'Provide a label or an appropriate aria-label.');
        if (tag === 'Button' && ts.isJsxSelfClosingElement(node) && !has('aria-label') && !has('aria-labelledby') && !has('children')) add(node, 'accessible-name', 'Empty button has no accessible name.', 'Add visible text or aria-label.');
      }
      if (tag === 'button') add(node, 'prefer-component', 'Native button bypasses the shared design system.', 'Use Button from @virtuui/react unless a primitive is required.');
    }
    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
      for (const match of node.text.matchAll(/var\((--vui-[\w-]+)/g)) {
        if (match[1] && !(match[1] in knownTokens)) add(node, 'unknown-token', `Unknown design token ${match[1]}.`, 'Select a variable from the tokens resource.', 'error');
      }
      if (/(?:^|[\s:])#[\da-f]{3,8}\b|\b(?:rgb|hsl)a?\(/i.test(node.text)) add(node, 'literal-color', 'Literal color may drift from the theme.', 'Replace with a semantic --vui-color-* variable.');
    }
    ts.forEachChild(node, visit);
  };
  visit(source);
  return { findings, passed: !findings.some((finding) => finding.severity === 'error'), limitation: 'Advisory static TSX check only. Spread props, dynamic expressions, external CSS, runtime behavior and full accessibility are not evaluated.' };
}
