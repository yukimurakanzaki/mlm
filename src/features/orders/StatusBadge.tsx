import type { OrderStatus } from '@/types/Order';
import { getTranslations } from 'next-intl/server';
import { cn } from '@/utils/Helpers';

const styles: Record<OrderStatus, string> = {
  pending: 'bg-amber-100 text-amber-900',
  confirmed: 'bg-blue-100 text-blue-900',
  packed: 'bg-indigo-100 text-indigo-900',
  shipped: 'bg-purple-100 text-purple-900',
  delivered: 'bg-green-100 text-green-900',
  cancelled: 'bg-red-100 text-red-900',
};

export const StatusBadge = async (props: { status: OrderStatus; locale: string }) => {
  const t = await getTranslations({ locale: props.locale, namespace: 'Status' });

  return (
    <span className={cn(`
      inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold
    `, styles[props.status])}
    >
      {t(props.status)}
    </span>
  );
};
