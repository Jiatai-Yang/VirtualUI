import { forwardRef, useId, type SelectHTMLAttributes } from 'react';
import { useControllableState } from '@virtuui/hooks';
import { cx } from './utils.js';
export interface SelectOption { value: string; label: string; disabled?: boolean }
export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'value' | 'defaultValue' | 'onChange' | 'children' | 'multiple' | 'size'> {
  label?: string;
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  onValueChange?: (value: string) => void;
  error?: string;
}
/** Native select preserves platform typeahead, mobile pickers and form validation. */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select({ label, options, value, defaultValue, onValueChange, placeholder, error, id, className, 'aria-describedby': describedBy, ...props }, ref) {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  const [selected, setSelected] = useControllableState({ value, defaultValue: defaultValue ?? (placeholder ? '' : options.find((option) => !option.disabled)?.value ?? ''), onChange: onValueChange });
  return <div className={cx('vui-field', className)}>
    {label && <label className="vui-label" htmlFor={selectId}>{label}</label>}
    <div className="vui-select-wrap"><select {...props} id={selectId} ref={ref} value={selected} onChange={(event) => setSelected(event.target.value)} className="vui-input vui-select"
      aria-invalid={error ? true : props['aria-invalid']} aria-describedby={[describedBy, error && `${selectId}-error`].filter(Boolean).join(' ') || undefined}>
      {placeholder && <option value="" disabled>{placeholder}</option>}
      {options.map((option) => <option key={option.value} value={option.value} disabled={option.disabled}>{option.label}</option>)}
    </select><span className="vui-select-chevron" aria-hidden="true">⌄</span></div>
    {error && <span className="vui-error" id={`${selectId}-error`}>{error}</span>}
  </div>;
});
