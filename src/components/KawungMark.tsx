import { cn } from '@/utils/Helpers';

/**
 * The Kawung mark (identity v2.0): four ellipses on a 120-unit grid; the empty channel between them forms the cross.
 * Geometry is fixed by the brand guide. Do not rotate, recolor red or add effects.
 */
export const KawungMark = (props: { className?: string }) => (
  <svg viewBox="0 0 120 120" className={cn('shrink-0', props.className)} aria-hidden="true">
    <g className="fill-mark-a">
      <ellipse cx="27.4" cy="27.4" rx="33.9" ry="18.9" transform="rotate(45 27.4 27.4)" />
      <ellipse cx="92.6" cy="92.6" rx="33.9" ry="18.9" transform="rotate(45 92.6 92.6)" />
    </g>
    <g className="fill-mark-b">
      <ellipse cx="92.6" cy="27.4" rx="33.9" ry="18.9" transform="rotate(-45 92.6 27.4)" />
      <ellipse cx="27.4" cy="92.6" rx="33.9" ry="18.9" transform="rotate(-45 27.4 92.6)" />
    </g>
  </svg>
);
