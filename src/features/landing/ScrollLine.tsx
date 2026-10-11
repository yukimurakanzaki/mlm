'use client';

import { motion, useReducedMotion, useScroll } from 'motion/react';
import { useRef } from 'react';
import { cn } from '@/utils/Helpers';

/**
 * A hairline that fills with the action color as its section scrolls through the viewport.
 * Position and size come from `className`; `axis` picks the fill direction. Fully drawn under reduced motion.
 */
export const ScrollLine = (props: { axis: 'x' | 'y'; className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'end 50%'] });
  const style = props.axis === 'x' ? { scaleX: scrollYProgress } : { scaleY: scrollYProgress };

  return (
    <div ref={ref} className={cn('absolute bg-border', props.className)} aria-hidden="true">
      <motion.div className="size-full origin-top-left bg-primary" style={reduce ? undefined : style} />
    </div>
  );
};
