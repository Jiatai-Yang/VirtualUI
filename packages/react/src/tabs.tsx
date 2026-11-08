import { useId, type ReactNode } from 'react';
import { useControllableState, useRovingFocus } from '@virtuui/hooks';
import { cx } from './utils.js';
export interface TabItem { value: string; label: ReactNode; content: ReactNode; disabled?: boolean }
export interface TabsProps {
  items: TabItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  orientation?: 'horizontal' | 'vertical';
  activationMode?: 'automatic' | 'manual';
  label: string;
  className?: string;
}
export function Tabs({ items, value, defaultValue, onValueChange, orientation = 'horizontal', activationMode = 'automatic', label, className }: TabsProps) {
  const id = useId();
  const [selected, setSelected] = useControllableState({ value, defaultValue: defaultValue ?? items.find((item) => !item.disabled)?.value ?? '', onChange: onValueChange });
  const roving = useRovingFocus(orientation);
  const active = items.find((item) => item.value === selected && !item.disabled)?.value ?? items.find((item) => !item.disabled)?.value;
  return <div className={cx('vui-tabs', `vui-tabs--${orientation}`, className)}>
    <div role="tablist" aria-label={label} aria-orientation={orientation} className="vui-tablist" onKeyDown={roving}>
      {items.map((item, index) => <button key={item.value} type="button" role="tab" id={`${id}-tab-${index}`} aria-controls={`${id}-panel-${index}`} aria-selected={active === item.value}
        data-vui-roving disabled={item.disabled} tabIndex={active === item.value ? 0 : -1} className="vui-tab"
        onClick={() => setSelected(item.value)} onFocus={() => { if (activationMode === 'automatic') setSelected(item.value); }}>{item.label}</button>)}
    </div>
    {items.map((item, index) => <div key={item.value} role="tabpanel" id={`${id}-panel-${index}`} aria-labelledby={`${id}-tab-${index}`} hidden={active !== item.value} tabIndex={0} className="vui-tabpanel">{item.content}</div>)}
  </div>;
}
