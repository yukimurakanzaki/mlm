import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { KawungMark } from '@/components/KawungMark';
import { buttonVariants } from '@/components/ui/buttonVariants';
import { ProductCard } from '@/features/catalog/ProductCard';
import { listActiveProducts, listCategorySummaries } from '@/features/orders/queries';
import { Link } from '@/libs/I18nNavigation';
import { AppConfig } from '@/utils/AppConfig';
import { buildWhatsAppLink, groupByCategory } from '@/utils/Catalog';
import { cn } from '@/utils/Helpers';

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string | string[] }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: 'Catalog' });

  return { title: t('meta_title'), description: t('meta_description') };
}

const pillClass = (active: boolean) => cn(
  `
    block border px-3 py-2 font-mono text-[11px] tracking-[0.08em]
    whitespace-nowrap uppercase transition-colors
  `,
  active
    ? 'border-primary bg-primary text-primary-foreground'
    : `
      bg-card
      hover:border-foreground/40
    `,
);

export default async function CatalogPage(props: Props) {
  const { locale } = await props.params;
  const { category } = await props.searchParams;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'Catalog' });
  const th = await getTranslations({ locale, namespace: 'Hero' });
  const [products, categories] = await Promise.all([listActiveProducts(locale), listCategorySummaries(locale)]);

  // An unknown or missing ?category shows everything
  const active = categories.find(c => c.anchor === category);
  const visible = active ? products.filter(p => p.categoryKey === active.key) : products;
  const anchorByKey = new Map(categories.map(c => [c.key, c.anchor]));

  return (
    <div className="px-4 pt-14 pb-24">
      <div className="mx-auto max-w-7xl">
        <h1 className="
          text-4xl font-bold tracking-tight
          md:text-5xl
        "
        >
          {t('title')}
        </h1>
        <p className="mt-4 max-w-[60ch] text-lg text-muted-foreground">{t('description')}</p>

        {categories.length > 0 && (
          <nav aria-label={t('filter_label')} className="mt-10">
            <ul className="
              -mx-4 flex snap-x gap-2 overflow-x-auto px-4 pb-2
              md:mx-0 md:flex-wrap md:px-0
            "
            >
              <li className="snap-start">
                <Link href="/catalog" className={pillClass(!active)} aria-current={!active ? 'page' : undefined}>
                  {t('all')}
                </Link>
              </li>
              {categories.map(c => (
                <li key={c.key} className="snap-start">
                  <Link
                    href={`/catalog?category=${c.anchor}`}
                    className={pillClass(active?.key === c.key)}
                    aria-current={active?.key === c.key ? 'page' : undefined}
                  >
                    {c.label}
                    {' '}
                    <span className="opacity-60">{c.count}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}

        {visible.length === 0
          ? (
              <div className="
                mt-12 flex flex-col items-start gap-5 border bg-card p-8
              "
              >
                <KawungMark className="size-10" />
                <p className="text-lg">{t('empty')}</p>
                <a
                  className={buttonVariants()}
                  href={buildWhatsAppLink(AppConfig.contact.whatsapp, th('quote_message', { company: AppConfig.name }))}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {th('secondary_button')}
                </a>
              </div>
            )
          : (
              <div className="mt-12 space-y-16">
                {groupByCategory(visible).map(group => (
                  <section
                    key={group.category ?? 'other'}
                    id={anchorByKey.get(group.items[0]?.categoryKey ?? '')}
                    className="scroll-mt-24"
                  >
                    <h2 className="
                      mb-5 flex items-baseline gap-3 border-b-2
                      border-foreground pb-3 text-xl font-bold
                    "
                    >
                      {group.category ?? t('uncategorized')}
                      <span className="
                        font-mono text-xs font-normal text-muted-foreground
                      "
                      >
                        {group.items.length}
                      </span>
                    </h2>
                    <div className="
                      grid gap-4
                      sm:grid-cols-2
                      lg:grid-cols-3
                      xl:grid-cols-4
                    "
                    >
                      {group.items.map(product => (
                        <ProductCard key={product.id} product={product} locale={locale} />
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            )}
      </div>
    </div>
  );
}

export const dynamic = 'force-dynamic';
