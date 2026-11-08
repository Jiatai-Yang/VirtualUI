import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type RefObject } from 'react';

export interface ControllableStateOptions<T> {
  value?: T;
  defaultValue: T;
  onChange?: (value: T) => void;
}

/** Presence of value (including false / empty string) determines controlled mode. */
export function useControllableState<T>({ value, defaultValue, onChange }: ControllableStateOptions<T>) {
  const [internal, setInternal] = useState(defaultValue);
  const controlled = value !== undefined;
  const current = controlled ? value : internal;
  const currentRef = useRef(current);
  currentRef.current = current;
  const set = useCallback((next: T | ((previous: T) => T)) => {
    const resolved = typeof next === 'function' ? (next as (previous: T) => T)(currentRef.current) : next;
    if (Object.is(resolved, currentRef.current)) return;
    if (!controlled) {
      currentRef.current = resolved;
      setInternal(resolved);
    }
    onChange?.(resolved);
  }, [controlled, onChange]);
  return [current, set] as const;
}

/** Roving focus shared by Menu and Tabs. Disabled items never receive focus. */
export function useRovingFocus(orientation: 'horizontal' | 'vertical' = 'horizontal') {
  return useCallback((event: KeyboardEvent<HTMLElement>) => {
    const nextKey = orientation === 'horizontal' ? 'ArrowRight' : 'ArrowDown';
    const previousKey = orientation === 'horizontal' ? 'ArrowLeft' : 'ArrowUp';
    if (![nextKey, previousKey, 'Home', 'End'].includes(event.key)) return;
    const items = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>('[data-vui-roving]:not(:disabled)'));
    if (!items.length) return;
    event.preventDefault();
    const index = items.indexOf(document.activeElement as HTMLButtonElement);
    const target = event.key === 'Home' ? 0 : event.key === 'End' ? items.length - 1
      : (index + (event.key === nextKey ? 1 : -1) + items.length) % items.length;
    items[target]?.focus();
  }, [orientation]);
}

export function useOutsideClick<T extends HTMLElement>(ref: RefObject<T | null>, onOutside: () => void, enabled = true) {
  useEffect(() => {
    if (!enabled) return;
    const listener = (event: PointerEvent) => {
      if (event.target instanceof Node && ref.current && !ref.current.contains(event.target)) onOutside();
    };
    document.addEventListener('pointerdown', listener);
    return () => document.removeEventListener('pointerdown', listener);
  }, [ref, onOutside, enabled]);
}
