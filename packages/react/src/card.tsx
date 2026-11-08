import { forwardRef, type HTMLAttributes } from 'react';
import { cx } from './utils.js';
export type CardProps = HTMLAttributes<HTMLDivElement>;
export const Card = forwardRef<HTMLDivElement, CardProps>(function Card({ className, ...props }, ref) {
  return <div {...props} ref={ref} className={cx('vui-card', className)} />;
});
