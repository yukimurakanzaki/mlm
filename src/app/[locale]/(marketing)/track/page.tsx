import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { redirect } from 'next/navigation';
import { buttonVariants } from '@/components/ui/buttonVariants';
import { lookupOrder } from '@/features/orders/actions';
import { OrderDetails } from '@/features/orders/OrderDetails';
import { findOrderByCodeAndPhone } from '@/features/orders/queries';
import { getTrackSession } from '@/features/orders/TrackSession';
import { AppConfig } from '@/utils/AppConfig';
import { normalizePhone } from '@/utils/Orders';

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ code?: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: 'Track' });

  return { title: t('meta_title'), description: t('meta_description'), robots: { index: false } };
}

export default async function TrackPage(props: Props) {
  const { locale } = await props.params;
  if (AppConfig.comingSoon) {
    redirect(locale === 'en' ? '/en' : '/');
  }

  setRequestLocale(locale);
  const { code: codeParam } = await props.searchParams;
  const session = await getTrackSession();
  // The phone number lives in a short-lived cookie, never in the URL. A `?code=` link (e.g. returning
  // from the payment page) reuses it only when it belongs to the same order.
  const code = codeParam ?? session?.code;
  const phone = session && (!codeParam || session.code === codeParam.toUpperCase()) ? session.phone : undefined;
  const t = await getTranslations({ locale, namespace: 'Track' });

  const normalizedPhone = phone ? normalizePhone(phone) : null;
  const searched = Boolean(code && phone);
  // Both values must match, so order codes cannot be probed on their own
  const order = code && normalizedPhone ? await findOrderByCodeAndPhone(code, normalizedPhone) : null;

  return (
    <div className="px-4 pt-14 pb-24">
      <div className="mx-auto max-w-3xl">
        <h1 className="
          text-4xl font-bold tracking-tight
          md:text-5xl
        "
        >
          {t('title')}
        </h1>
        <p className="mt-4 max-w-[60ch] text-lg text-muted-foreground">{t('description')}</p>

        <form
          action={lookupOrder}
          className="
            mt-10 grid gap-4 border bg-card p-6
            sm:grid-cols-[1fr_1fr_auto] sm:items-end
          "
        >
          <input type="hidden" name="locale" value={locale} />
          <label className="grid gap-2 text-sm font-semibold">
            {t('code_label')}
            <input
              name="code"
              autoComplete="off"
              required
              defaultValue={code}
              placeholder={t('code_placeholder')}
              className="
                border border-input bg-background px-3 py-2.5 font-mono
                font-normal uppercase
              "
            />
          </label>
          <label className="grid gap-2 text-sm font-semibold">
            {t('phone_label')}
            <input
              name="phone"
              required
              type="tel"
              autoComplete="tel"
              defaultValue={phone}
              placeholder={t('phone_placeholder')}
              className="
                border border-input bg-background px-3 py-2.5 font-normal
              "
            />
          </label>
          <button type="submit" className={buttonVariants({ size: 'lg' })}>{t('search')}</button>
        </form>

        <div className="mt-8">
          {order && <OrderDetails order={order} locale={locale} />}
          {searched && !order && (
            <p role="alert" className="text-destructive">{t('not_found')}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export const dynamic = 'force-dynamic';
