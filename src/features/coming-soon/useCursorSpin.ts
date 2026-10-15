'use client';

import { useMotionValue, useSpring } from 'motion/react';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';

const motionPreference = '(prefers-reduced-motion: reduce)';
const subscribeMotionPreference = (onChange: () => void) => {
  const media = window.matchMedia(motionPreference);
  media.addEventListener('change', onChange);
  return () => media.removeEventListener('change', onChange);
};
const getMotionPreference = () => window.matchMedia(motionPreference).matches;
const getServerMotionPreference = () => true;

/** Follow the pointer's angle without jumping when it crosses the -180/180 seam. */
export const useCursorSpin = () => {
  const frameRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useSyncExternalStore(subscribeMotionPreference, getMotionPreference, getServerMotionPreference);
  const [following, setFollowing] = useState(false);
  const rotation = useMotionValue(0);
  const scale = useMotionValue(1);
  const smoothRotation = useSpring(rotation, { stiffness: 65, damping: 20, mass: 0.8 });
  const smoothScale = useSpring(scale, { stiffness: 90, damping: 24 });

  useEffect(() => {
    if (reducedMotion) {
      rotation.set(0);
      scale.set(1);
      return;
    }

    let active = false;
    let previousAngle: number | null = null;

    const reset = () => {
      if (!active) {
        return;
      }

      active = false;
      previousAngle = null;
      setFollowing(false);
      scale.set(1);
      // Settle at the nearest upright turn, without unwinding several revolutions.
      rotation.set(Math.round(rotation.get() / 360) * 360);
    };

    const follow = (event: PointerEvent) => {
      if (event.pointerType === 'touch' || !frameRef.current) {
        reset();
        return;
      }

      const bounds = frameRef.current.getBoundingClientRect();
      const distanceX = Math.max(bounds.left - event.clientX, 0, event.clientX - bounds.right);
      const distanceY = Math.max(bounds.top - event.clientY, 0, event.clientY - bounds.bottom);

      if (Math.hypot(distanceX, distanceY) > 100) {
        reset();
        return;
      }

      const x = event.clientX - (bounds.left + bounds.width / 2);
      const y = event.clientY - (bounds.top + bounds.height / 2);

      if (!active) {
        active = true;
        setFollowing(true);
        scale.set(1.025);
      }

      // The angle is unstable at the center; keep the last heading there.
      if (Math.hypot(x, y) < 24) {
        return;
      }

      const angle = Math.atan2(y, x) * 180 / Math.PI;
      const delta = previousAngle === null
        ? angle
        : ((angle - previousAngle + 540) % 360) - 180;
      rotation.set(rotation.get() + delta);
      previousAngle = angle;
    };

    const leave = (event: PointerEvent) => {
      if (!event.relatedTarget) {
        reset();
      }
    };

    window.addEventListener('pointermove', follow, { passive: true });
    window.addEventListener('pointerout', leave, { passive: true });
    window.addEventListener('blur', reset);
    window.addEventListener('scroll', reset, { passive: true });

    return () => {
      window.removeEventListener('pointermove', follow);
      window.removeEventListener('pointerout', leave);
      window.removeEventListener('blur', reset);
      window.removeEventListener('scroll', reset);
      reset();
    };
  }, [reducedMotion, rotation, scale]);

  return {
    frame: frameRef,
    following: !reducedMotion && following,
    style: {
      rotate: reducedMotion ? 0 : smoothRotation,
      scale: reducedMotion ? 1 : smoothScale,
    },
  };
};
