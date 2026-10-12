import { useTranslations } from 'next-intl';
import { Link } from '@/libs/I18nNavigation';
import { cn } from '@/utils/Helpers';

type CategorySummary = { key: string; label: string; anchor: string; count: number };

const Track = (props: { categories: CategorySummary[]; duplicate?: boolean }) => {
  const t = useTranslations('Categories');

  return (
    <ul
      className={cn('flex shrink-0', props.duplicate && 'motion-reduce:hidden')}
      aria-hidden={props.duplicate || undefined}
    >
      {props.categories.map(category => (
        <li
          key={category.key}
          className="
            border-l px-8
            md:px-12
          "
        >
          <Link
            href={`/catalog?category=${category.anchor}`}
            tabIndex={props.duplicate ? -1 : undefined}
            className="group flex items-baseline gap-3 whitespace-nowrap"
          >
            <span className="
              font-serif text-3xl italic transition-colors
              group-hover:text-emphasis
              md:text-4xl
            "
            >
              {category.label}
            </span>
            <span className="font-mono text-xs text-muted-foreground">
              {t('product_count', { count: category.count })}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
};

/** Endless row of catalog categories; pauses on hover, becomes a plain scrollable row under reduced motion. */
export const CategoryMarquee = (props: { categories: CategorySummary[] }) => {
  const t = useTranslations('Categories');

  if (props.categories.length === 0) {
    return null;
  }

  return (
    <section
      aria-label={t('label')}
      className="overflow-hidden border-y bg-card py-8"
    >
      <div className="
        flex w-max
        hover:paused
        motion-safe:animate-marquee
        motion-reduce:w-auto motion-reduce:overflow-x-auto
      "
      >
        <Track categories={props.categories} />
        <Track categories={props.categories} duplicate />
      </div>
    </section>
  );
};
