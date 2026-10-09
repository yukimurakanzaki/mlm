import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { buttonVariants } from '@/components/ui/buttonVariants';
import { Section } from '@/features/landing/Section';
import { OrderForm } from '@/features/orders/OrderForm';
import { getActiveProductBySlug } from '@/features/orders/queries';
import { AppConfig } from '@/utils/AppConfig';
import { buildWhatsAppLink } from '@/utils/Catalog';
import { canOrderOnline, formatIDR } from '@/utils/Orders';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { slug } = await props.params;
  const product = await getActiveProductBySlug(slug);

  return product ? { title: product.name, description: product.description } : {};
}

export default async function ProductPage(props: Props) {
  const { locale, slug } = await props.params;
  setRequestLocale(locale);
  const product = await getActiveProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: 'Product' });
  const orderable = canOrderOnline(product);
  const soldOut = product.trackStock && product.stock <= 0;
  const details = [product.brand, product.packaging, product.sku].filter(Boolean).join(' · ');

  return (
    <Section>
      <div className="
        grid gap-10
        md:grid-cols-2
      "
      >
        <div>
          <div
            className="
              flex h-64 items-center justify-center rounded-lg bg-linear-to-br
              from-indigo-500 via-purple-500 to-pink-500 text-7xl font-bold
              text-white
            "
            aria-hidden="true"
          >
            {product.name.charAt(0)}
          </div>
          <h1 className="mt-5 text-3xl font-bold">{product.name}</h1>
          {details && <div className="mt-1 text-sm text-muted-foreground">{details}</div>}
          <p className="mt-2 text-muted-foreground">{product.description}</p>
          <div className="mt-4 text-2xl font-bold">
            {orderable ? formatIDR(product.priceIdr, locale) : t('price_on_request')}
          </div>
          {orderable && product.trackStock && (
            <div className="mt-1 text-sm text-muted-foreground">{t('stock', { count: product.stock })}</div>
          )}
        </div>

        <div className="rounded-lg border bg-card p-5">
          {orderable
            ? (
                <>
                  <h2 className="mb-4 text-xl font-semibold">{t('order_title')}</h2>
                  {soldOut
                    ? <p className="text-destructive">{t('sold_out')}</p>
                    : <OrderForm productId={product.id} unitPriceIdr={product.priceIdr} maxQuantity={product.trackStock ? product.stock : 99} />}
                </>
              )
            : (
                <>
                  <h2 className="mb-2 text-xl font-semibold">{t('quote_title')}</h2>
                  <p className="mb-4 text-sm text-muted-foreground">{t('quote_description')}</p>
                  <a
                    className={buttonVariants()}
                    href={buildWhatsAppLink(AppConfig.contact.whatsapp, t('quote_message', { company: AppConfig.name, name: product.name, sku: product.sku ?? '-' }))}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t('quote_button')}
                  </a>
                </>
              )}
        </div>
      </div>
    </Section>
  );
}

export const dynamic = 'force-dynamic';
