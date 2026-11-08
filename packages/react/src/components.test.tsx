import { createRef, useState } from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './button';
import { Input } from './input';
import { Select } from './select';
import { Switch } from './switch';
import { Tabs, type TabItem } from './tabs';
import { Menu } from './menu';
import { Card } from './card';
import { Badge } from './badge';

describe('Button', () => {
  it('does not submit forms by default, forwards a ref and fires native events', async () => {
    const onClick = jest.fn(); const onSubmit = jest.fn(); const ref = createRef<HTMLButtonElement>();
    render(<form onSubmit={onSubmit}><Button ref={ref} onClick={onClick} className="custom" startIcon={<span aria-hidden="true">+</span>}>Create</Button></form>);
    await userEvent.click(screen.getByRole('button', { name: 'Create' }));
    expect(onClick).toHaveBeenCalledTimes(1); expect(onSubmit).not.toHaveBeenCalled();
    expect(ref.current).toHaveClass('custom');
  });
  it('blocks interactions while loading or disabled and keeps the accessible name', async () => {
    const onClick = jest.fn(); const { rerender } = render(<Button loading onClick={onClick}>Save</Button>);
    const button = screen.getByRole('button', { name: 'Save' });
    expect(button).toHaveAttribute('aria-busy', 'true'); await userEvent.click(button); expect(onClick).not.toHaveBeenCalled();
    rerender(<Button disabled onClick={onClick}>Save</Button>); expect(button).toBeDisabled(); expect(button).not.toHaveAttribute('aria-busy');
  });
});

describe('Input and form controls', () => {
  it('links labels, hints, errors and external descriptions without losing input props', () => {
    const ref = createRef<HTMLInputElement>();
    const { rerender } = render(<Input ref={ref} label="Email" hint="Private" aria-describedby="external" required type="email" />);
    const input = screen.getByRole('textbox', { name: 'Email' });
    expect(input).toHaveAttribute('aria-describedby', `external ${input.id}-message`);
    expect(input).toHaveAttribute('type', 'email'); expect(ref.current).toBe(input);
    rerender(<Input label="Email" error="Invalid address" hint="Private" />);
    expect(input).toHaveAttribute('aria-invalid', 'true'); expect(input).toHaveAccessibleDescription('Invalid address');
    expect(screen.queryByText('Private')).not.toBeInTheDocument();
    rerender(<Input aria-label="Email" id="explicit" />); expect(input).toHaveAttribute('id', 'explicit'); expect(input).not.toHaveAttribute('aria-describedby');
  });
  it('supports native controlled input changes', async () => {
    function Form() { const [value, setValue] = useState(''); return <Input label="Name" value={value} onChange={(event) => setValue(event.target.value)} />; }
    render(<Form />); await userEvent.type(screen.getByLabelText('Name'), 'Ada'); expect(screen.getByLabelText('Name')).toHaveValue('Ada');
  });
  it('selects values, skips disabled options and submits through FormData', async () => {
    const onChange = jest.fn();
    render(<form data-testid="form"><Select label="Framework" name="framework" placeholder="Choose" options={[{ value: 'react', label: 'React' }, { value: 'next', label: 'Next', disabled: true }]} onValueChange={onChange} /></form>);
    const select = screen.getByRole('combobox'); expect(select).toHaveValue('');
    await userEvent.selectOptions(select, 'react'); expect(select).toHaveValue('react'); expect(onChange).toHaveBeenCalledWith('react');
    await userEvent.selectOptions(select, 'next'); expect(select).toHaveValue('react');
    expect(new FormData(screen.getByTestId('form') as HTMLFormElement).get('framework')).toBe('react');
  });
  it('keeps controlled selection until the owner updates it and handles empty options', async () => {
    const change = jest.fn(); const options = [{ value: 'a', label: 'A' }, { value: 'b', label: 'B' }];
    const { rerender } = render(<Select label="Choice" options={options} value="a" onValueChange={change} error="Check this" />);
    const select = screen.getByRole('combobox'); await userEvent.selectOptions(select, 'b');
    expect(change).toHaveBeenCalledWith('b'); expect(select).toHaveValue('a'); expect(select).toHaveAccessibleDescription('Check this');
    rerender(<Select label="Choice" options={options} value="b" />); expect(select).toHaveValue('b');
    rerender(<Select aria-label="Empty" options={[]} value="" />); expect(screen.getByRole('combobox')).toBeEmptyDOMElement();
  });
  it('defaults to the first enabled select option', () => {
    render(<Select label="Choice" options={[{ value: 'a', label: 'A', disabled: true }, { value: 'b', label: 'B' }]} />);
    expect(screen.getByRole('combobox')).toHaveValue('b');
  });
  it('switch toggles with Space, supports name/value, and respects disabled', async () => {
    const change = jest.fn(); const { rerender } = render(<form data-testid="form"><Switch label="Updates" name="updates" value="yes" onCheckedChange={change} /></form>);
    const control = screen.getByRole('switch', { name: 'Updates' }); await userEvent.tab(); await userEvent.keyboard(' ');
    expect(control).toBeChecked(); expect(change).toHaveBeenCalledWith(true);
    expect(new FormData(screen.getByTestId('form') as HTMLFormElement).get('updates')).toBe('yes');
    rerender(<Switch label="Updates" disabled checked />); await userEvent.click(screen.getByRole('switch')); expect(screen.getByRole('switch')).toBeChecked();
  });
  it('controlled switch reports changes without taking ownership', async () => {
    const change = jest.fn(); const { rerender } = render(<Switch label="Updates" checked={false} onCheckedChange={change} />);
    await userEvent.click(screen.getByRole('switch')); expect(change).toHaveBeenCalledWith(true); expect(screen.getByRole('switch')).not.toBeChecked();
    rerender(<Switch label="Updates" checked onCheckedChange={change} />); expect(screen.getByRole('switch')).toBeChecked();
  });
});

const tabs: TabItem[] = [{ value: 'a', label: 'Alpha', content: <Input label="Draft" /> }, { value: 'b', label: 'Beta', content: 'Beta content', disabled: true }, { value: 'c', label: 'Charlie', content: 'Charlie content' }];
describe('Tabs', () => {
  it('links panels, wraps focus, skips disabled items, and preserves panel state', async () => {
    render(<Tabs label="Project" items={tabs} />);
    const alpha = screen.getByRole('tab', { name: 'Alpha' }); const charlie = screen.getByRole('tab', { name: 'Charlie' });
    expect(screen.getByRole('tabpanel')).toHaveAttribute('aria-labelledby', alpha.id);
    expect(alpha).toHaveAttribute('aria-controls', screen.getByRole('tabpanel').id);
    await userEvent.type(screen.getByLabelText('Draft'), 'Keep this'); await userEvent.click(alpha); await userEvent.keyboard('{ArrowRight}');
    expect(charlie).toHaveFocus(); expect(charlie).toHaveAttribute('aria-selected', 'true'); expect(screen.getByRole('tabpanel')).toHaveTextContent('Charlie content');
    await userEvent.keyboard('{ArrowRight}'); expect(alpha).toHaveFocus(); expect(screen.getByLabelText('Draft')).toHaveValue('Keep this');
    await userEvent.keyboard('{End}'); expect(charlie).toHaveFocus(); await userEvent.keyboard('{Home}'); expect(alpha).toHaveFocus();
  });
  it('manual vertical navigation changes focus without selecting until activation', async () => {
    render(<Tabs label="Project" items={tabs} activationMode="manual" orientation="vertical" />);
    const alpha = screen.getByRole('tab', { name: 'Alpha' }); const charlie = screen.getByRole('tab', { name: 'Charlie' });
    await userEvent.click(alpha); await userEvent.keyboard('{ArrowDown}'); expect(charlie).toHaveFocus(); expect(alpha).toHaveAttribute('aria-selected', 'true');
    await userEvent.keyboard('{Enter}'); expect(charlie).toHaveAttribute('aria-selected', 'true');
    await userEvent.keyboard('{ArrowUp}'); expect(alpha).toHaveFocus();
  });
  it('supports controlled state, item removal, empty and all-disabled lists', async () => {
    const change = jest.fn(); const { rerender } = render(<Tabs label="Project" items={tabs} value="c" onValueChange={change} activationMode="manual" />);
    await userEvent.click(screen.getByRole('tab', { name: 'Alpha' })); expect(change).toHaveBeenCalledWith('a'); expect(screen.getByRole('tab', { name: 'Charlie' })).toHaveAttribute('aria-selected', 'true');
    rerender(<Tabs label="Project" items={tabs.slice(0, 2)} value="c" />); expect(screen.getByRole('tab', { name: 'Alpha' })).toHaveAttribute('aria-selected', 'true');
    rerender(<Tabs label="Empty" items={[]} />); expect(screen.queryByRole('tab')).not.toBeInTheDocument();
    rerender(<Tabs label="Disabled" items={tabs.map((item) => ({ ...item, disabled: true }))} />);
    expect(screen.queryByRole('tabpanel')).not.toBeInTheDocument(); fireEvent.keyDown(screen.getByRole('tablist'), { key: 'ArrowRight' });
  });
});

const menuItems = [{ value: 'edit', label: 'Edit' }, { value: 'share', label: 'Share', disabled: true }, { value: 'delete', label: 'Delete', danger: true }];
describe('Menu', () => {
  it('opens, navigates, invokes one action and restores trigger focus', async () => {
    const action = jest.fn(); render(<Menu label="Actions" items={menuItems} onAction={action} />);
    const trigger = screen.getByRole('button', { name: 'Actions' }); await userEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true'); expect(screen.getByRole('menuitem', { name: 'Edit' })).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}{Enter}'); expect(action).toHaveBeenCalledTimes(1); expect(action).toHaveBeenCalledWith('delete');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument(); expect(trigger).toHaveFocus();
  });
  it('supports ArrowUp opening, Home/End, typeahead and Escape', async () => {
    render(<Menu label="Actions" items={menuItems} align="end" />); const trigger = screen.getByRole('button');
    await userEvent.tab(); await userEvent.keyboard('{ArrowUp}'); expect(screen.getByRole('menuitem', { name: 'Delete' })).toHaveFocus();
    await userEvent.keyboard('{Home}'); expect(screen.getByRole('menuitem', { name: 'Edit' })).toHaveFocus();
    await userEvent.keyboard('d'); expect(screen.getByRole('menuitem', { name: 'Delete' })).toHaveFocus();
    await userEvent.keyboard('{End}{Escape}'); expect(trigger).toHaveFocus(); expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    await userEvent.keyboard('{ArrowDown}'); expect(screen.getByRole('menuitem', { name: 'Edit' })).toHaveFocus();
  });
  it('dismisses on outside pointer interaction and Tab without trapping focus', async () => {
    render(<><Menu label="Actions" items={menuItems} /><button>Outside</button></>);
    await userEvent.click(screen.getByRole('button', { name: 'Actions' })); await userEvent.click(screen.getByRole('button', { name: 'Outside' })); expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Actions' })); await userEvent.tab(); expect(screen.getByRole('button', { name: 'Outside' })).toHaveFocus(); expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });
  it('supports controlled visibility and an empty menu', async () => {
    const change = jest.fn(); const { rerender } = render(<Menu label="Actions" items={menuItems} open={false} onOpenChange={change} />);
    await userEvent.click(screen.getByRole('button')); expect(change).toHaveBeenCalledWith(true); expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    rerender(<Menu label="Actions" items={[]} open onOpenChange={change} />); expect(screen.getByRole('menu')).toHaveFocus(); expect(screen.getByText('No actions available')).toBeVisible();
    await userEvent.keyboard('{ArrowDown}{Escape}'); expect(change).toHaveBeenCalledWith(false);
  });
});

it('Card and Badge preserve attributes, content and semantic status text', () => {
  const ref = createRef<HTMLDivElement>(); render(<Card ref={ref} aria-label="Project"><Badge dot variant="success" role="status">Published</Badge></Card>);
  expect(ref.current).toHaveClass('vui-card'); expect(within(screen.getByLabelText('Project')).getByRole('status')).toHaveTextContent('Published');
});
import '@testing-library/jest-dom';
