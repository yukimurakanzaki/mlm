import type { OrderWithDetails } from './queries';
import { getTranslations } from 'next-intl/server';
import { Button } from '@/components/ui/button';
import { NEXT_STATUSES } from '@/utils/Orders';
import { markPaymentPaid, updateOrderStatus } from './actions';

export const AdminOrderActions = async (props: { order: OrderWithDetails; locale: string }) => {
  const t = await getTranslations({ locale: props.locale, namespace: 'Admin' });
  const status = await getTranslations({ locale: props.locale, namespace: 'Status' });
  const { order } = props;
  const nextPayment = order.payments.find(p => p.status === 'pending');

  return (
    <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
      <span className="text-muted-foreground">
        {order.customerName}
        {' · '}
        <a className="underline" href={`https://wa.me/${order.customerPhone}`} target="_blank" rel="noopener noreferrer">
          {order.customerPhone}
        </a>
      </span>

      {NEXT_STATUSES[order.status].map(next => (
        <form key={next} action={updateOrderStatus}>
          <input type="hidden" name="orderId" value={order.id} />
          <input type="hidden" name="status" value={next} />
          <Button type="submit" size="sm" variant={next === 'cancelled' ? 'outline' : 'default'}>
            {status(next)}
          </Button>
        </form>
      ))}

      {nextPayment && order.status !== 'cancelled' && (
        <form action={markPaymentPaid}>
          <input type="hidden" name="paymentId" value={nextPayment.id} />
          <Button type="submit" size="sm" variant="secondary">
            {t('mark_paid', { n: nextPayment.installmentNo })}
          </Button>
        </form>
      )}
    </div>
  );
};
