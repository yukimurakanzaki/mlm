import Image from 'next/image';
import { cn } from '@/utils/Helpers';

/**
 * Product photo on a light plate, or the Kawung pattern when there is none. `className` sizes and styles the box.
 * Supplier photos are small (about 100-500px), so they are centered at no more than their own size instead of
 * being stretched to fill the box.
 */
export const ProductImage = (props: { name: string; imageUrl: string | null; className?: string }) => {
  if (!props.imageUrl) {
    return (
      <div className={cn('relative text-foreground/10', props.className)} aria-hidden="true">
        <div className="absolute inset-0 bg-kawung" />
      </div>
    );
  }

  return (
    // The plate comes last so it wins over a caller's background: multiply on a dark ground would turn photos black
    <div className={cn(`
      relative flex items-center justify-center overflow-hidden p-[8%]
    `, props.className, `bg-plate`)}
    >
      {/* ponytail: served as-is; resizing tiny files gains nothing and srcsets would stretch them. Optimize when photos get big */}
      <Image
        src={props.imageUrl}
        alt={props.name}
        width={600}
        height={600}
        unoptimized
        className="
          size-auto max-h-full max-w-full object-contain mix-blend-multiply
        "
      />
    </div>
  );
};
