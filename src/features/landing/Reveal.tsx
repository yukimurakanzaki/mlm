'use client';

import { motion, MotionConfig } from 'motion/react';

/**
 * Fades and lifts its children in the first time they scroll into view.
 * MotionConfig "user" drops the lift for reduced-motion users while server and client render the same markup.
 */
export const Reveal = (props: { children: React.ReactNode; delay?: number; className?: string }) => (
  <MotionConfig reducedMotion="user">
    <motion.div
      className={props.className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, delay: props.delay ?? 0, ease: [0.16, 1, 0.3, 1] }}
    >
      {props.children}
    </motion.div>
  </MotionConfig>
);
