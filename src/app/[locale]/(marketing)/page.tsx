import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ProductCard } from '@/features/catalog/ProductCard';
import { Section } from '@/features/landing/Section';
import { listActiveProducts } from '@/features/orders/queries';
import { CTA } from '@/templates/CTA';
import { FAQ } from '@/templates/FAQ';
import { Hero } from '@/templates/Hero';
import { HowItWorks } from '@/templates/HowItWorks';

type IndexProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(props: IndexProps): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({
    locale,
    namespace: 'Index',
  });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  };
}

export default async function Index(props: IndexProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'Catalog' });
  const featured = await listActiveProducts(3);

  return (
    <>
      <Hero />

      {featured.length > 0 && (
        <Section title={t('featured_title')} description={t('featured_description')}>
          <div className="
            grid gap-6
            sm:grid-cols-2
            lg:grid-cols-3
          "
          >
            {featured.map(product => (
              <ProductCard key={product.id} product={product} locale={locale} />
            ))}
          </div>
        </Section>
      )}

      <HowItWorks />
      <FAQ />
      <CTA />
    </>
  );
};

// Products come from the database and change at runtime
export const dynamic = 'force-dynamic';
