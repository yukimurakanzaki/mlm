import { cn } from '@/utils/Helpers';

export const Section = (props: {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  description?: string;
  className?: string;
}) => (
  <div className={cn('@container px-4 py-20', props.className)}>
    {(props.title || props.subtitle || props.description) && (
      <div className="mx-auto mb-12 max-w-3xl text-center">
        {props.subtitle && (
          <div className="
            font-mono text-xs tracking-[0.08em] text-muted-foreground uppercase
          "
          >
            {props.subtitle}
          </div>
        )}

        {props.title && (
          <h2 className="
            mt-2 font-serif text-3xl tracking-tight
            md:text-4xl
          "
          >
            {props.title}
          </h2>
        )}

        {props.description && (
          <div className="mt-2 text-lg text-muted-foreground">
            {props.description}
          </div>
        )}
      </div>
    )}

    <div className="mx-auto max-w-5xl">{props.children}</div>
  </div>
);
