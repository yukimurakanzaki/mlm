import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { buttonVariants } from '@/components/ui/buttonVariants';
import { ProductCard } from '@/features/catalog/ProductCard';
import { ProductImage } from '@/features/catalog/ProductImage';
import { OrderForm } from '@/features/orders/OrderForm';
import { getActiveProductBySlug, listActiveProducts } from '@/features/orders/queries';
import { Link } from '@/libs/I18nNavigation';
import { AppConfig } from '@/utils/AppConfig';
import { buildWhatsAppLink } from '@/utils/Catalog';
import { cn } from '@/utils/Helpers';
import { canOrderOnline, formatIDR, slugify } from '@/utils/Orders';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

const RELATED_COUNT = 4;
// One column per spec so the grid never shows an empty cell
const SPEC_COLUMNS: Record<number, string> = { 1: '', 2: 'sm:grid-cols-2', 3: 'sm:grid-cols-3', 4: 'sm:grid-cols-2' };

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { locale, slug } = await props.params;
  const product = await getActiveProductBySlug(slug, locale);

  return product ? { title: product.name, description: product.description } : {};
}

export default async function ProductPage(props: Props) {
  const { locale, slug } = await props.params;
  setRequestLocale(locale);
  const product = await getActiveProductBySlug(slug, locale);

  if (!product) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: 'Product' });
  const orderable = canOrderOnline(product);
  const soldOut = product.trackStock && product.stock <= 0;
  const specs = [
    { label: t('brand'), value: product.brand },
    { label: t('packaging'), value: product.packaging },
    { label: t('unit'), value: product.unit },
    { label: t('sku'), value: product.sku },
  ].filter(spec => spec.value);
  const related = product.categoryKey
    ? (await listActiveProducts(locale))
        .filter(p => p.categoryKey === product.categoryKey && p.id !== product.id)
        .slice(0, RELATED_COUNT)
    : [];

  return (
    <div className="px-4 pt-10 pb-24">
      <div className="mx-auto max-w-7xl">
        <nav aria-label={t('catalog')}>
          <ol className="
            flex flex-wrap gap-2 font-mono text-[11px] tracking-[0.08em]
            text-muted-foreground uppercase
            [&_a:hover]:text-foreground
          "
          >
            <li><Link href="/catalog">{t('catalog')}</Link></li>
            {product.category && product.categoryKey && (
              <>
                <li aria-hidden="true">/</li>
                <li><Link href={`/catalog?category=${slugify(product.categoryKey)}`}>{product.category}</Link></li>
              </>
            )}
          </ol>
        </nav>

        <div className="
          mt-8 grid items-start gap-10
          lg:grid-cols-[1.1fr_1fr] lg:gap-16
        "
        >
          <ProductImage
            name={product.name}
            imageUrl={product.imageUrl}
            eager
            className="
              aspect-square border bg-secondary
              lg:sticky lg:top-24
            "
          />

          <div>
            <h1 className="
              text-3xl/tight font-bold tracking-tight
              md:text-4xl/tight
            "
            >
              {product.name}
            </h1>
            <p className="
              mt-4 max-w-[60ch] text-lg/relaxed text-muted-foreground
            "
            >
              {product.description}
            </p>

            <div className="mt-8 border bg-card p-6">
              {orderable
                ? (
                    <>
                      <div className="text-2xl font-bold">{formatIDR(product.priceIdr, locale)}</div>
                      {product.trackStock && (
                        <div className="mt-1 text-sm text-muted-foreground">{t('stock', { count: product.stock })}</div>
                      )}
                      <h2 className="mt-6 mb-4 text-lg font-bold">{t('order_title')}</h2>
                      {soldOut
                        ? <p className="text-destructive">{t('sold_out')}</p>
                        : <OrderForm productId={product.id} unitPriceIdr={product.priceIdr} maxQuantity={product.trackStock ? product.stock : 99} />}
                    </>
                  )
                : (
                    <>
                      <h2 className="text-lg font-bold">{t('quote_title')}</h2>
                      <p className="mt-2 text-sm/relaxed text-muted-foreground">{t('quote_description')}</p>
                      <a
                        className={buttonVariants({ size: 'lg', className: `
                          mt-5
                          max-sm:w-full
                        ` })}
                        href={buildWhatsAppLink(AppConfig.contact.whatsapp, t('quote_message', { company: AppConfig.name, name: product.name, sku: product.sku ?? '-' }))}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {t('quote_button')}
                      </a>
                    </>
                  )}
            </div>

            {specs.length > 0 && (
              <dl className={cn('mt-8 grid gap-px border bg-border', SPEC_COLUMNS[specs.length])}>
                {specs.map(spec => (
                  <div key={spec.label} className="bg-card p-4">
                    <dt className="
                      font-mono text-[11px] tracking-[0.08em]
                      text-muted-foreground uppercase
                    "
                    >
                      {spec.label}
                    </dt>
                    <dd className="mt-1 text-sm font-semibold">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-24">
            <h2 className="
              mb-5 border-b-2 border-foreground pb-3 text-xl font-bold
            "
            >
              {t('related_title')}
            </h2>
            <div className="
              grid gap-4
              sm:grid-cols-2
              lg:grid-cols-4
            "
            >
              {related.map(p => <ProductCard key={p.id} product={p} locale={locale} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export const dynamic = 'force-dynamic';
