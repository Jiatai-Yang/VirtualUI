export interface PropDoc { name: string; type: string; default?: string; description: string }
export interface ComponentDoc {
  name: string;
  category: 'Actions' | 'Forms' | 'Navigation' | 'Data display';
  description: string;
  keywords: string[];
  props: PropDoc[];
  example: string;
  accessibility: string[];
}
export const catalog: ComponentDoc[] = [
  { name: 'Button', category: 'Actions', description: 'A clear starting point for every action. Consistent variants, sizes and loading states.', keywords: ['action', 'submit', 'click', '按钮', '提交'],
    props: [
      { name: 'variant', type: "'primary' | 'secondary' | 'ghost' | 'danger'", default: 'primary', description: 'Visual emphasis of the action.' },
      { name: 'size', type: "'sm' | 'md' | 'lg'", default: 'md', description: 'Height and spacing.' },
      { name: 'loading', type: 'boolean', default: 'false', description: 'Shows a spinner, sets aria-busy and prevents clicks.' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables interaction.' },
      { name: 'startIcon', type: 'ReactNode', description: 'Optional leading icon.' },
      { name: 'onClick', type: 'MouseEventHandler<HTMLButtonElement>', description: 'Native click event.' },
    ], example: '<Button variant="primary" onClick={save}>Save changes</Button>', accessibility: ['Uses a native button and defaults to type="button".', 'Icon-only buttons require aria-label.', 'Loading disables the control and sets aria-busy.'] },
  { name: 'Input', category: 'Forms', description: 'Text fields with connected labels, helpful hints and accessible validation.', keywords: ['text', 'input', 'email', 'form', '输入', '表单'],
    props: [
      { name: 'label', type: 'string', description: 'Visible, associated label.' },
      { name: 'error', type: 'string', description: 'Validation message; sets aria-invalid and aria-describedby.' },
      { name: 'hint', type: 'string', description: 'Supporting text when no error is present.' },
      { name: 'value / defaultValue', type: 'string', description: 'Native controlled or uncontrolled input.' },
      { name: 'onChange', type: 'ChangeEventHandler<HTMLInputElement>', description: 'Native change event.' },
    ], example: '<Input label="Email address" type="email" placeholder="you@example.com" />', accessibility: ['Label and description IDs are stable across SSR hydration.', 'Supports required, name, native validation and ref forwarding.'] },
  { name: 'Select', category: 'Forms', description: 'Make choosing simple with a native, keyboard-friendly selection control.', keywords: ['select', 'option', 'dropdown', '选择', '下拉'],
    props: [
      { name: 'options', type: 'SelectOption[]', description: 'Required array of value, label and optional disabled.' },
      { name: 'value / defaultValue', type: 'string', description: 'Controlled or initial selected value.' },
      { name: 'onValueChange', type: '(value: string) => void', description: 'Called with the new value.' },
      { name: 'label / placeholder / error', type: 'string', description: 'Label, empty-state text and validation message.' },
    ], example: '<Select label="Framework" options={[{ value: "react", label: "React" }]} />', accessibility: ['Native select supports typeahead and mobile pickers.', 'Disabled options are not selectable; name participates in FormData.', 'Provide label or aria-label. Single selection only.'] },
  { name: 'Switch', category: 'Forms', description: 'An immediate on or off choice, built on a real form control.', keywords: ['toggle', 'switch', 'setting', '开关', '设置'],
    props: [
      { name: 'label', type: 'string', description: 'Required visible accessible name.' },
      { name: 'checked / defaultChecked', type: 'boolean', default: 'false', description: 'Controlled or initial state.' },
      { name: 'onCheckedChange', type: '(checked: boolean) => void', description: 'Called on a state change.' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Prevents changes.' },
    ], example: '<Switch label="Email notifications" defaultChecked />', accessibility: ['Uses checkbox input with role="switch"; Space toggles.', 'Supports name and value for form submission.'] },
  { name: 'Tabs', category: 'Navigation', description: 'Related content, thoughtfully organized into accessible panels.', keywords: ['tabs', 'panel', 'navigation', '标签', '页签'],
    props: [
      { name: 'items', type: 'TabItem[]', description: 'Unique value, label, content and optional disabled.' },
      { name: 'label', type: 'string', description: 'Required accessible name for tablist.' },
      { name: 'value / defaultValue', type: 'string', description: 'Controlled or initial active tab.' },
      { name: 'onValueChange', type: '(value: string) => void', description: 'Called when active tab changes.' },
      { name: 'orientation', type: "'horizontal' | 'vertical'", default: 'horizontal', description: 'Layout and arrow-key direction.' },
      { name: 'activationMode', type: "'automatic' | 'manual'", default: 'automatic', description: 'Activate on focus or only Enter/Space/click.' },
    ], example: '<Tabs label="Project" items={[{ value: "overview", label: "Overview", content: "Project details" }]} />', accessibility: ['Roving tabindex with arrows, Home and End; disabled items are skipped.', 'Tab panels have linked aria-controls / aria-labelledby.', 'Invalid or removed selected item falls back to the first enabled item without firing a change event.', 'Panels remain mounted to preserve local state.'] },
  { name: 'Menu', category: 'Navigation', description: 'A compact home for contextual actions, with predictable focus management.', keywords: ['menu', 'action', 'context', '菜单', '操作'],
    props: [
      { name: 'label', type: 'string', description: 'Required trigger text.' },
      { name: 'items', type: 'MenuItem[]', description: 'Unique value, label, optional icon, disabled and danger.' },
      { name: 'open / defaultOpen', type: 'boolean', default: 'false', description: 'Controlled or initial open state.' },
      { name: 'onOpenChange', type: '(open: boolean) => void', description: 'Called when visibility changes.' },
      { name: 'onAction', type: '(value: string) => void', description: 'Called with the activated item value.' },
      { name: 'align', type: "'start' | 'end'", default: 'start', description: 'Popup alignment.' },
      { name: 'triggerVariant', type: "ButtonProps['variant']", default: 'secondary', description: 'Trigger visual emphasis.' },
    ], example: '<Menu label="Actions" items={[{ value: "edit", label: "Edit" }]} onAction={handleAction} />', accessibility: ['Arrows open and navigate; Home/End jump; character keys match visible labels.', 'Escape and item activation restore trigger focus; outside click and blur dismiss.', 'Inline popup: ensure ancestor containers do not clip overflow. Submenus are not supported.'] },
  { name: 'Badge', category: 'Data display', description: 'Small, expressive labels for status, counts and metadata.', keywords: ['badge', 'status', 'tag', '标签', '状态'],
    props: [
      { name: 'variant', type: "'neutral' | 'success' | 'danger'", default: 'neutral', description: 'Semantic color.' },
      { name: 'dot', type: 'boolean', default: 'false', description: 'Decorative status dot.' },
      { name: 'children', type: 'ReactNode', description: 'Readable status text.' },
    ], example: '<Badge variant="success" dot>Published</Badge>', accessibility: ['Pair color with visible text.', 'Use role="status" on a surrounding live region for asynchronous changes.'] },
  { name: 'Card', category: 'Data display', description: 'A quiet surface that gives related content room to breathe.', keywords: ['card', 'container', 'surface', '卡片', '容器'],
    props: [
      { name: 'children', type: 'ReactNode', description: 'Card content.' },
      { name: 'className', type: 'string', description: 'Optional layout extension.' },
    ], example: '<Card><h3>Your workspace</h3><p>All your projects in one place.</p></Card>', accessibility: ['A neutral div container; add headings appropriate to the page hierarchy.', 'Avoid making the entire card clickable when it contains other interactive controls.'] },
];

export const guidelines = [
  'Import components from @virtuui/react or documented component subpaths. Import @virtuui/react/styles.css once.',
  'Use --vui-* CSS variables from the token resource. Avoid literal colors in application styles.',
  'Choose either controlled value/checked/open with a change callback or uncontrolled defaultValue/defaultChecked/defaultOpen; never both.',
  'Preserve accessible names, keyboard interactions, visible focus and semantic HTML.',
  'Use unique, stable item values for Menu, Tabs and Select. Do not mutate item arrays.',
  'Components and hooks must not import application, governance or MCP modules.',
  'Add stories, interaction tests and a Changeset for public API changes.',
];
