'use client';

import { useReducedMotion } from 'motion/react';
import { useId, useState } from 'react';
import { cn } from '@/utils/Helpers';

type Step = { id: string; title: string; description: string; panel: React.ReactNode };

/**
 * Vertical tabs that advance on their own: each active tab's underline fills over 6s, then the next tab opens.
 * Hovering or focusing pauses it; under reduced motion nothing advances on its own.
 */
export const StepTabs = (props: { label: string; steps: Step[] }) => {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();
  const baseId = useId();
  const count = props.steps.length;
  const select = (index: number) => setActive((index + count) % count);
  const current = props.steps[active];

  const onKeyDown = (event: React.KeyboardEvent) => {
    const delta = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[event.key];

    if (delta) {
      event.preventDefault();
      select(active + delta);
      document.getElementById(`${baseId}-tab-${(active + delta + count) % count}`)?.focus();
    }
  };

  return (
    <div
      className="
        grid gap-8
        lg:grid-cols-[1fr_1.15fr] lg:gap-16
      "
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div role="tablist" aria-label={props.label} aria-orientation="vertical" onKeyDown={onKeyDown}>
        {props.steps.map((step, index) => {
          const selected = index === active;

          return (
            <button
              key={step.id}
              id={`${baseId}-tab-${index}`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`${baseId}-panel`}
              tabIndex={selected ? 0 : -1}
              onClick={() => select(index)}
              className="
                relative block w-full cursor-pointer border-b py-5 text-left
              "
            >
              <span className={cn('text-lg font-bold transition-colors', !selected && `
                text-muted-foreground
              `)}
              >
                {step.title}
              </span>
              {selected && (
                <span className="
                  mt-2 block max-w-[46ch] text-sm/relaxed text-muted-foreground
                "
                >
                  {step.description}
                </span>
              )}
              {selected && (
                <span
                  key={active}
                  aria-hidden="true"
                  className={cn(
                    `
                      absolute inset-x-0 -bottom-px h-0.5 origin-left
                      bg-emphasis
                    `,
                    !reduce && 'animate-step',
                    paused && 'paused',
                  )}
                  onAnimationEnd={() => select(index + 1)}
                />
              )}
            </button>
          );
        })}
      </div>

      <div role="tabpanel" id={`${baseId}-panel`} aria-labelledby={`${baseId}-tab-${active}`}>
        {current?.panel}
      </div>
    </div>
  );
};
