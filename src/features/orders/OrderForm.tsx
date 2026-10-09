'use client';

import type { OrderFormState } from './actions';
import { useLocale, useTranslations } from 'next-intl';
import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { AppConfig } from '@/utils/AppConfig';
import { formatIDR } from '@/utils/Orders';
import { createOrder } from './actions';

const inputClass = 'mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm aria-invalid:border-destructive';

export const OrderForm = (props: { productId: number; unitPriceIdr: number; maxQuantity: number }) => {
  const t = useTranslations('OrderForm');
  const locale = useLocale();
  const [state, formAction, pending] = useActionState<OrderFormState, FormData>(createOrder, {});

  return (
    <form action={formAction} className="space-y-4" noValidate>
      <input type="hidden" name="productId" value={props.productId} />
      <input type="hidden" name="locale" value={locale} />

      {state.error && (
        <div
          role="alert"
          className="
            rounded-md border border-destructive/40 bg-destructive/10 p-3
            text-sm text-destructive
          "
        >
          {t(`errors.${state.error}`)}
        </div>
      )}

      <label className="block text-sm font-medium">
        {t('name')}
        <input name="customerName" required autoComplete="name" className={inputClass} aria-invalid={state.fieldErrors?.customerName} />
      </label>

      <label className="block text-sm font-medium">
        {t('phone')}
        <input name="customerPhone" required type="tel" autoComplete="tel" placeholder="0812 3456 7890" className={inputClass} aria-invalid={state.fieldErrors?.customerPhone} />
      </label>

      <label className="block text-sm font-medium">
        {t('email')}
        <input name="customerEmail" type="email" autoComplete="email" className={inputClass} aria-invalid={state.fieldErrors?.customerEmail} />
      </label>

      <label className="block text-sm font-medium">
        {t('address')}
        <textarea name="shippingAddress" required rows={3} autoComplete="street-address" className={inputClass} aria-invalid={state.fieldErrors?.shippingAddress} />
      </label>

      <div className="grid grid-cols-2 gap-4">
        <label className="block text-sm font-medium">
          {t('quantity')}
          <input name="quantity" type="number" min={1} max={Math.min(99, props.maxQuantity)} defaultValue={1} required className={inputClass} aria-invalid={state.fieldErrors?.quantity} />
        </label>

        <label className="block text-sm font-medium">
          {t('payment_plan')}
          <select name="installmentCount" defaultValue={1} className={inputClass}>
            {AppConfig.installmentOptions.map(count => (
              <option key={count} value={count}>
                {count === 1 ? t('pay_in_full') : t('installments', { count })}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="block text-sm font-medium">
        {t('notes')}
        <textarea name="notes" rows={2} className={inputClass} />
      </label>

      <p className="text-xs text-muted-foreground">
        {t('unit_price', { price: formatIDR(props.unitPriceIdr, locale) })}
      </p>

      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? t('submitting') : t('submit')}
      </Button>
    </form>
  );
};
