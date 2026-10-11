import { ArrowRightIcon } from '@radix-ui/react-icons';
import { getTranslations } from 'next-intl/server';
import { Reveal } from '@/features/landing/Reveal';
import { Link } from '@/libs/I18nNavigation';
import { cn } from '@/utils/Helpers';
import { canOrderOnline } from '@/utils/Orders';

type Product = {
  id: number;
  slug: string;
  name: string;
  description: string;
  category: string | null;
  priceIdr: number | null;
  showPrice: boolean;
};

// Cell sizes and tints by position; the first product leads when there are three.
const LAYOUT: Record<number, string[]> = {
  1: ['md:col-span-3'],
  2: ['md:col-span-3 lg:col-span-1', 'md:col-span-3 lg:col-span-2'],
  3: ['md:col-span-2 md:row-span-2', '', ''],
};
const TINTS = ['bg-secondary', 'bg-primary/10', 'bg-card'];

export const FeaturedProducts = async (props: { products: Product[]; locale: string }) => {
  const t = await getTranslations({ locale: props.locale, namespace: 'Catalog' });
  const products = props.products.slice(0, 3);
  const layout = LAYOUT[products.length];

  if (!layout) {
    return null;
  }

  return (
    <section className="px-4 py-24">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <h2 className="
            font-serif text-3xl tracking-tight
            md:text-5xl
          "
          >
            {t('featured_title')}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">{t('featured_description')}</p>
        </Reveal>

        <div className="
          mt-12 grid gap-4
          md:grid-cols-3
        "
        >
          {products.map((product, index) => {
            const lead = products.length === 3 && index === 0;

            return (
              <Link
                key={product.id}
                href={`/catalog/${product.slug}`}
                className={cn(
                  `
                    group flex flex-col overflow-hidden rounded-lg border
                    bg-card transition-shadow
                    hover:shadow-[0_24px_60px_-30px] hover:shadow-foreground/30
                  `,
                  layout[index],
                )}
              >
                <div
                  className={cn(
                    `
                      flex flex-1 items-center justify-center border-b
                      font-serif text-foreground/60
                    `,
                    TINTS[index],
                    lead ? 'min-h-72 text-8xl' : 'min-h-40 text-6xl',
                  )}
                  aria-hidden="true"
                >
                  {/* TODO: product photo from image_url once photos are uploaded (phase 4) */}
                  {product.name.charAt(0)}
                </div>

                <div className="p-5">
                  {product.category && (
                    <div className="
                      font-mono text-[11px] tracking-[0.08em]
                      text-muted-foreground uppercase
                    "
                    >
                      {product.category}
                    </div>
                  )}
                  <h3 className={cn('mt-1.5 font-serif', lead
                    ? `
                      text-2xl
                      md:text-3xl
                    `
                    : `text-xl`)}
                  >
                    {product.name}
                  </h3>
                  {lead && (
                    <p className="
                      mt-2 line-clamp-2 max-w-[56ch] text-sm
                      text-muted-foreground
                    "
                    >
                      {product.description}
                    </p>
                  )}
                  <div className="
                    mt-4 inline-flex items-center gap-1.5 text-sm underline
                    decoration-primary decoration-2 underline-offset-4
                  "
                  >
                    {canOrderOnline(product) ? t('order_now') : t('request_quote')}
                    <ArrowRightIcon className="
                      transition-transform
                      group-hover:translate-x-0.5
                    "
                    />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};
