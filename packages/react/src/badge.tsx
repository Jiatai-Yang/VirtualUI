import type { HTMLAttributes } from 'react';
import { cx } from './utils.js';
export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> { variant?: 'neutral' | 'success' | 'danger'; dot?: boolean }
export function Badge({ variant = 'neutral', dot, className, children, ...props }: BadgeProps) {
  return <span {...props} className={cx('vui-badge', `vui-badge--${variant}`, className)}>{dot && <span className="vui-badge-dot" aria-hidden="true" />}{children}</span>;
}
