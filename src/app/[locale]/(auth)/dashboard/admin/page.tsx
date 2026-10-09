import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { TitleBar } from '@/features/dashboard/TitleBar';
import { AdminOrderActions } from '@/features/orders/AdminOrderActions';
import { OrderDetails } from '@/features/orders/OrderDetails';
import { getAdminStats, listAllOrders } from '@/features/orders/queries';
import { isAdmin } from '@/libs/Auth';
import { Link } from '@/libs/I18nNavigation';
import { formatIDR } from '@/utils/Orders';

const Stat = (props: { label: string; value: string }) => (
  <div className="rounded-lg border bg-card p-4">
    <div className="text-sm text-muted-foreground">{props.label}</div>
    <div className="mt-1 text-2xl font-bold">{props.value}</div>
  </div>
);

export default async function AdminPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  // Hide the page entirely from non-admins
  if (!(await isAdmin())) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: 'Admin' });
  const [stats, orders] = await Promise.all([getAdminStats(), listAllOrders()]);

  return (
    <>
      <TitleBar title={t('title')} description={t('description')} />

      <Link
        href="/dashboard/admin/products"
        className="mb-4 inline-block text-sm underline"
      >
        {t('manage_products')}
      </Link>

      <div className="
        mb-6 grid gap-4
        sm:grid-cols-3
      "
      >
        <Stat label={t('stat_orders')} value={String(stats.totalOrders)} />
        <Stat label={t('stat_pending')} value={String(stats.pendingOrders)} />
        <Stat label={t('stat_collected')} value={formatIDR(stats.collectedIdr, locale)} />
      </div>

      <div className="space-y-4">
        {orders.map(order => (
          <div key={order.id}>
            <OrderDetails order={order} locale={locale} />
            <AdminOrderActions order={order} locale={locale} />
          </div>
        ))}
      </div>
    </>
  );
}
