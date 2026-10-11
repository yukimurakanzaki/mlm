import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { listActiveProducts, listCategorySummaries } from '@/features/orders/queries';
import { CategoryMarquee } from '@/templates/CategoryMarquee';
import { ColdChainFlow } from '@/templates/ColdChainFlow';
import { CTA } from '@/templates/CTA';
import { FAQ } from '@/templates/FAQ';
import { FeaturedProducts } from '@/templates/FeaturedProducts';
import { Hero } from '@/templates/Hero';
import { HowItWorks } from '@/templates/HowItWorks';
import { TrustBand } from '@/templates/TrustBand';

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
    title: { absolute: t('meta_title') },
    description: t('meta_description'),
  };
}

export default async function Index(props: IndexProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  // First three products fill the bento; the fourth, if any, is spotlighted in the hero
  const [products, categories] = await Promise.all([listActiveProducts(locale, 4), listCategorySummaries(locale)]);

  return (
    <>
      <Hero spotlight={products[3]} />
      <CategoryMarquee categories={categories} />
      <ColdChainFlow categories={categories} />
      <FeaturedProducts products={products} locale={locale} />
      <TrustBand />
      <HowItWorks categories={categories} sample={products[0]} />
      <FAQ />
      <CTA />
    </>
  );
};

// Products come from the database and change at runtime
export const dynamic = 'force-dynamic';
