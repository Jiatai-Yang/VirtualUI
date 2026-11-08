import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { useControllableState, useOutsideClick, useRovingFocus } from '@virtuui/hooks';
import { Button, type ButtonProps } from './button.js';
import { cx } from './utils.js';
export interface MenuItem { value: string; label: ReactNode; icon?: ReactNode; disabled?: boolean; danger?: boolean }
export interface MenuProps {
  label: string;
  items: MenuItem[];
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onAction?: (value: string) => void;
  align?: 'start' | 'end';
  triggerVariant?: ButtonProps['variant'];
}
export function Menu({ label, items, open, defaultOpen = false, onOpenChange, onAction, align = 'start', triggerVariant = 'secondary' }: MenuProps) {
  const [isOpen, setOpen] = useControllableState({ value: open, defaultValue: defaultOpen, onChange: onOpenChange });
  const [focused, setFocused] = useState<string>();
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const edge = useRef<'first' | 'last'>('first');
  const id = useId();
  const close = useCallback(() => setOpen(false), [setOpen]);
  useOutsideClick(root, close, isOpen);
  const roving = useRovingFocus('vertical');
  useEffect(() => {
    if (isOpen) {
      const enabled = list.current?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)');
      const target = edge.current === 'last' ? enabled?.[enabled.length - 1] : enabled?.[0];
      if (target) target.focus(); else list.current?.focus();
    }
  }, [isOpen]);
  return <div className="vui-menu" ref={root} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) close(); }}>
    <Button ref={trigger} variant={triggerVariant} id={`${id}-trigger`} aria-haspopup="menu" aria-expanded={isOpen} aria-controls={isOpen ? id : undefined}
      onClick={() => { edge.current = 'first'; setOpen(!isOpen); }}
      onKeyDown={(event) => { if (event.key === 'ArrowDown' || event.key === 'ArrowUp') { event.preventDefault(); edge.current = event.key === 'ArrowUp' ? 'last' : 'first'; setOpen(true); } }}>
      {label}<span aria-hidden="true">⌄</span>
    </Button>
    {isOpen && <div id={id} ref={list} role="menu" aria-labelledby={`${id}-trigger`} tabIndex={-1} className={cx('vui-menu-list', align === 'end' && 'vui-menu-list--end')}
      onKeyDown={(event) => {
        roving(event);
        if (event.key === 'Escape') { event.preventDefault(); close(); trigger.current?.focus(); }
        if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey && event.key !== ' ') {
          const enabled = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>('button:not(:disabled)'));
          const index = enabled.indexOf(document.activeElement as HTMLButtonElement);
          const rotated = [...enabled.slice(index + 1), ...enabled.slice(0, index + 1)];
          rotated.find((item) => item.textContent?.trim().toLowerCase().startsWith(event.key.toLowerCase()))?.focus();
        }
      }}>
      {items.length === 0 && <span className="vui-menu-empty">No actions available</span>}
      {items.map((item) => <button type="button" key={item.value} role="menuitem" data-vui-roving disabled={item.disabled} tabIndex={focused === item.value ? 0 : -1}
        className={cx('vui-menu-item', item.danger && 'vui-menu-item--danger')} onFocus={() => setFocused(item.value)}
        onClick={() => { close(); trigger.current?.focus(); onAction?.(item.value); }}>{item.icon}{item.label}</button>)}
    </div>}
  </div>;
}
