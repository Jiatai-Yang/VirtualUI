import { forwardRef, useId, type InputHTMLAttributes } from 'react';
import { cx } from './utils.js';
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input({ label, error, hint, id, className, 'aria-describedby': describedBy, ...props }, ref) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const message = error || hint;
  return <div className={cx('vui-field', className)}>
    {label && <label className="vui-label" htmlFor={inputId}>{label}{props.required && <span aria-hidden="true"> *</span>}</label>}
    <input {...props} ref={ref} id={inputId} className="vui-input" aria-invalid={error ? true : props['aria-invalid']}
      aria-describedby={[describedBy, message && `${inputId}-message`].filter(Boolean).join(' ') || undefined} />
    {message && <span id={`${inputId}-message`} className={error ? 'vui-error' : 'vui-hint'}>{message}</span>}
  </div>;
});
