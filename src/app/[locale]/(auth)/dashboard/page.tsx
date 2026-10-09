import { auth } from '@clerk/nextjs/server';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { TitleBar } from '@/features/dashboard/TitleBar';
import { OrderDetails } from '@/features/orders/OrderDetails';
import { listOrdersForUser } from '@/features/orders/queries';
import { Link } from '@/libs/I18nNavigation';

export default async function DashboardIndexPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'DashboardIndexPage' });
  const { userId } = await auth();
  const orders = userId ? await listOrdersForUser(userId) : [];

  return (
    <>
      <TitleBar title={t('title_bar')} description={t('title_bar_description')} />

      {orders.length === 0
        ? (
            <div className="rounded-lg border bg-card p-8 text-center">
              <p className="text-muted-foreground">{t('empty')}</p>
              <Link className="mt-3 inline-block font-medium underline" href="/catalog">{t('browse_catalog')}</Link>
            </div>
          )
        : (
            <div className="space-y-4">
              {orders.map(order => (
                <OrderDetails key={order.id} order={order} locale={locale} />
              ))}
            </div>
          )}
    </>
  );
};
