import { desc } from 'drizzle-orm';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { TitleBar } from '@/features/dashboard/TitleBar';
import { ProductForm } from '@/features/products/ProductForm';
import { isAdmin } from '@/libs/Auth';
import { db } from '@/libs/DB';
import { productSchema } from '@/models/Schema';

export default async function AdminProductsPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  if (!(await isAdmin())) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: 'AdminProducts' });
  const products = await db.select().from(productSchema).orderBy(desc(productSchema.createdAt));

  return (
    <>
      <TitleBar title={t('title')} description={t('page_description')} />

      <section className="mb-6 rounded-lg border bg-card p-5">
        <h2 className="mb-3 font-semibold">{t('new_product')}</h2>
        <ProductForm locale={locale} />
      </section>

      <div className="space-y-4">
        {products.map(product => (
          <section key={product.id} className="rounded-lg border bg-card p-5">
            <h2 className="mb-3 font-semibold">
              {product.name}
              {!product.isActive && (
                <span className="ml-2 text-xs font-normal text-muted-foreground">
                  {t('hidden')}
                </span>
              )}
            </h2>
            <ProductForm product={product} locale={locale} />
          </section>
        ))}
      </div>
    </>
  );
}
