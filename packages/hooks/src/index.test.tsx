import { act, fireEvent, render, renderHook, screen } from '@testing-library/react';
import { useRef } from 'react';
import { useControllableState, useOutsideClick } from './index';

it('supports functional state updates, deduplicates unchanged values and tracks sequential updates', () => {
  const change = jest.fn(); const { result } = renderHook(() => useControllableState({ defaultValue: 0, onChange: change }));
  act(() => { result.current[1]((value) => value + 1); result.current[1]((value) => value + 1); });
  expect(result.current[0]).toBe(2); expect(change.mock.calls).toEqual([[1], [2]]);
  act(() => result.current[1](2)); expect(change).toHaveBeenCalledTimes(2);
});

it('treats false and empty strings as controlled values and ignores subsequent defaults', () => {
  const { result, rerender } = renderHook(({ value, defaultValue }: { value?: string; defaultValue: string }) => useControllableState({ value, defaultValue }), { initialProps: { value: '', defaultValue: 'a' } });
  act(() => result.current[1]('b')); expect(result.current[0]).toBe('');
  rerender({ value: 'next', defaultValue: 'other' }); expect(result.current[0]).toBe('next');
  const uncontrolled = renderHook(({ initial }) => useControllableState({ defaultValue: initial }), { initialProps: { initial: false } });
  uncontrolled.rerender({ initial: true }); expect(uncontrolled.result.current[0]).toBe(false);
});

it('cleans up outside pointer listeners and does not report inside clicks', () => {
  const outside = jest.fn();
  function Example({ enabled = true }: { enabled?: boolean }) { const ref = useRef<HTMLDivElement>(null); useOutsideClick(ref, outside, enabled); return <div ref={ref}>Inside</div>; }
  const { rerender, unmount } = render(<Example />);
  fireEvent.pointerDown(screen.getByText('Inside')); expect(outside).not.toHaveBeenCalled();
  fireEvent.pointerDown(document.body); expect(outside).toHaveBeenCalledTimes(1);
  rerender(<Example enabled={false} />); fireEvent.pointerDown(document.body); expect(outside).toHaveBeenCalledTimes(1);
  unmount(); fireEvent.pointerDown(document.body); expect(outside).toHaveBeenCalledTimes(1);
});
