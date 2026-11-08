import { forwardRef, useId, type InputHTMLAttributes } from 'react';
import { useControllableState } from '@virtuui/hooks';
import { cx } from './utils.js';
export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange' | 'size'> {
  label: string;
  onCheckedChange?: (checked: boolean) => void;
}
export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch({ label, checked, defaultChecked = false, onCheckedChange, id, className, disabled, ...props }, ref) {
  const generatedId = useId();
  const [value, setValue] = useControllableState({ value: checked, defaultValue: defaultChecked, onChange: onCheckedChange });
  return <label className={cx('vui-switch', disabled && 'vui-switch--disabled', className)} htmlFor={id ?? generatedId}>
    <input {...props} id={id ?? generatedId} ref={ref} type="checkbox" role="switch" checked={value} disabled={disabled} onChange={(event) => setValue(event.target.checked)} />
    <span className="vui-switch-track" aria-hidden="true"><span /></span><span>{label}</span>
  </label>;
});
