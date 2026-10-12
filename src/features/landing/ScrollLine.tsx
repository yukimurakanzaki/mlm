'use client';

import { motion, useScroll } from 'motion/react';
import { useRef } from 'react';
import { cn } from '@/utils/Helpers';

/**
 * A hairline that fills with the action color as its section scrolls through the viewport.
 * Position and size come from `className`; `axis` picks the fill direction.
 * Under reduced motion a CSS override shows it fully drawn, so server and client markup stay identical.
 */
export const ScrollLine = (props: { axis: 'x' | 'y'; className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'end 50%'] });

  return (
    <div ref={ref} className={cn('absolute bg-border', props.className)} aria-hidden="true">
      <motion.div
        className="
          size-full origin-top-left bg-primary
          motion-reduce:transform-none!
        "
        style={props.axis === 'x' ? { scaleX: scrollYProgress } : { scaleY: scrollYProgress }}
      />
    </div>
  );
};
