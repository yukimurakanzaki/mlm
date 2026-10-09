import type { OrderWithDetails } from './queries';
import { getTranslations } from 'next-intl/server';
import { formatIDR } from '@/utils/Orders';
import { StatusBadge } from './StatusBadge';

/** Order summary with items, installment schedule and payment status. Shared by tracking and dashboard. */
export const OrderDetails = async (props: { order: OrderWithDetails; locale: string }) => {
  const t = await getTranslations({ locale: props.locale, namespace: 'OrderDetails' });
  const { order, locale } = props;
  const paid = order.payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amountIdr, 0);
  const date = new Intl.DateTimeFormat(locale === 'en' ? 'en-ID' : 'id-ID', { dateStyle: 'medium' });

  return (
    <div className="rounded-lg border bg-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <div className="text-xs text-muted-foreground">{t('order_code')}</div>
          <div className="font-mono text-lg font-semibold">{order.code}</div>
        </div>
        <StatusBadge status={order.status} locale={locale} />
      </div>

      <div className="mt-1 text-xs text-muted-foreground">{date.format(order.createdAt)}</div>

      <table className="mt-4 w-full text-sm">
        <thead>
          <tr className="border-b text-left text-muted-foreground">
            <th className="py-1 font-medium">{t('item')}</th>
            <th className="py-1 text-right font-medium">{t('qty')}</th>
            <th className="py-1 text-right font-medium">{t('subtotal')}</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map(item => (
            <tr
              key={item.id}
              className="
                border-b
                last:border-0
              "
            >
              <td className="py-1.5">{item.productName}</td>
              <td className="py-1.5 text-right">{item.quantity}</td>
              <td className="py-1.5 text-right">{formatIDR(item.unitPriceIdr * item.quantity, locale)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={2} className="pt-2 font-semibold">{t('total')}</td>
            <td className="pt-2 text-right font-semibold">{formatIDR(order.totalIdr, locale)}</td>
          </tr>
        </tfoot>
      </table>

      <h3 className="mt-5 text-sm font-semibold">{t('payments')}</h3>
      <ul className="mt-2 divide-y text-sm">
        {order.payments.map(payment => (
          <li
            key={payment.id}
            className="flex items-center justify-between py-1.5"
          >
            <span>
              {order.installmentCount > 1 ? t('installment_n', { n: payment.installmentNo, total: order.installmentCount }) : t('full_payment')}
              <span className="ml-2 text-xs text-muted-foreground">
                {t('due', { date: date.format(new Date(payment.dueDate)) })}
              </span>
            </span>
            <span className="text-right">
              {formatIDR(payment.amountIdr, locale)}
              <span className={payment.status === 'paid'
                ? `ml-2 text-green-700`
                : `ml-2 text-amber-700`}
              >
                {t(`payment_${payment.status}`)}
              </span>
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-2 text-right text-xs text-muted-foreground">
        {t('paid_so_far', { paid: formatIDR(paid, locale), total: formatIDR(order.totalIdr, locale) })}
      </div>
    </div>
  );
};
