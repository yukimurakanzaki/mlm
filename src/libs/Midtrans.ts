import { Buffer } from 'node:buffer';
import { Env } from '@/libs/Env';

export const isMidtransConfigured = () => Boolean(Env.MIDTRANS_SERVER_KEY);

const snapUrl = () => Env.MIDTRANS_IS_PRODUCTION === 'true'
  ? 'https://app.midtrans.com/snap/v1/transactions'
  : 'https://app.sandbox.midtrans.com/snap/v1/transactions';

type SnapInput = {
  orderId: string;
  amountIdr: number;
  itemName: string;
  customer: { name: string; phone: string; email?: string | null };
  finishUrl: string;
};

/** Creates a Midtrans Snap checkout and returns the hosted payment page URL. */
export const createSnapPayment = async (input: SnapInput) => {
  const response = await fetch(snapUrl(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Basic ${Buffer.from(`${Env.MIDTRANS_SERVER_KEY}:`).toString('base64')}`,
    },
    body: JSON.stringify({
      transaction_details: { order_id: input.orderId, gross_amount: input.amountIdr },
      item_details: [{ id: input.orderId, price: input.amountIdr, quantity: 1, name: input.itemName.slice(0, 50) }],
      customer_details: {
        first_name: input.customer.name,
        phone: input.customer.phone,
        ...(input.customer.email ? { email: input.customer.email } : {}),
      },
      callbacks: { finish: input.finishUrl },
    }),
  });

  if (!response.ok) {
    throw new Error(`Midtrans Snap error ${response.status}`);
  }

  const data = await response.json() as { redirect_url?: string };

  if (!data.redirect_url) {
    throw new Error('Midtrans Snap returned no redirect_url');
  }

  return data.redirect_url;
};
