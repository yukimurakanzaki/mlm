import Image from 'next/image';
import { cn } from '@/utils/Helpers';

/** Product photo, or the Kawung pattern when there is none. `className` sizes and styles the box. */
export const ProductImage = (props: { name: string; imageUrl: string | null; className?: string; sizes: string }) => {
  if (!props.imageUrl) {
    return (
      <div className={cn('relative text-foreground/10', props.className)} aria-hidden="true">
        <div className="absolute inset-0 bg-kawung" />
      </div>
    );
  }

  return (
    <div className={cn('relative', props.className)}>
      {/* ponytail: https images skip the optimizer so next.config needs no remote domains */}
      <Image
        src={props.imageUrl}
        alt={props.name}
        fill
        sizes={props.sizes}
        unoptimized={props.imageUrl.startsWith('https://')}
        className="object-contain mix-blend-multiply"
      />
    </div>
  );
};
