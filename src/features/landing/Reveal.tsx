'use client';

import { motion, useReducedMotion } from 'motion/react';

/** Fades and lifts its children in the first time they scroll into view. Static under reduced motion. */
export const Reveal = (props: { children: React.ReactNode; delay?: number; className?: string }) => {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={props.className}
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, delay: props.delay ?? 0, ease: [0.16, 1, 0.3, 1] }}
    >
      {props.children}
    </motion.div>
  );
};
