import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cx } from './utils.js';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  startIcon?: ReactNode;
}
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', loading = false, disabled, startIcon, className, children, type = 'button', ...props }, ref,
) {
  return <button {...props} ref={ref} type={type} disabled={disabled || loading} aria-busy={loading || undefined}
    className={cx('vui-button', `vui-button--${variant}`, `vui-button--${size}`, className)}>
    {loading ? <span className="vui-spinner" aria-hidden="true" /> : startIcon}
    {children}
  </button>;
});
