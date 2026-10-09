import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ProductCard } from '@/features/catalog/ProductCard';
import { Section } from '@/features/landing/Section';
import { listActiveProducts } from '@/features/orders/queries';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: 'Catalog' });

  return { title: t('meta_title'), description: t('meta_description') };
}

export default async function CatalogPage(props: Props) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'Catalog' });
  const products = await listActiveProducts();

  return (
    <Section title={t('title')} description={t('description')}>
      {products.length === 0
        ? <p className="text-center text-muted-foreground">{t('empty')}</p>
        : (
            <div className="
              grid gap-6
              sm:grid-cols-2
              lg:grid-cols-3
            "
            >
              {products.map(product => (
                <ProductCard key={product.id} product={product} locale={locale} />
              ))}
            </div>
          )}
    </Section>
  );
}

export const dynamic = 'force-dynamic';
