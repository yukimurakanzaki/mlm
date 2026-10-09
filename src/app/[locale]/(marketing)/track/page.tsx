import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { buttonVariants } from '@/components/ui/buttonVariants';
import { Section } from '@/features/landing/Section';
import { OrderDetails } from '@/features/orders/OrderDetails';
import { findOrderByCodeAndPhone } from '@/features/orders/queries';
import { normalizePhone } from '@/utils/Orders';

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ code?: string; phone?: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: 'Track' });

  return { title: t('meta_title'), description: t('meta_description'), robots: { index: false } };
}

export default async function TrackPage(props: Props) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  const { code, phone } = await props.searchParams;
  const t = await getTranslations({ locale, namespace: 'Track' });

  const normalizedPhone = phone ? normalizePhone(phone) : null;
  const searched = Boolean(code && phone);
  // Both values must match, so order codes cannot be probed on their own
  const order = code && normalizedPhone ? await findOrderByCodeAndPhone(code, normalizedPhone) : null;

  return (
    <Section title={t('title')} description={t('description')}>
      <form
        method="get"
        className="
          mx-auto flex max-w-xl flex-col gap-3
          sm:flex-row
        "
      >
        <input
          name="code"
          required
          defaultValue={code}
          placeholder={t('code_placeholder')}
          aria-label={t('code_label')}
          className="
            flex-1 rounded-md border bg-background px-3 py-2 text-sm uppercase
          "
        />
        <input
          name="phone"
          required
          type="tel"
          defaultValue={phone}
          placeholder={t('phone_placeholder')}
          aria-label={t('phone_label')}
          className="flex-1 rounded-md border bg-background px-3 py-2 text-sm"
        />
        <button type="submit" className={buttonVariants()}>{t('search')}</button>
      </form>

      <div className="mx-auto mt-8 max-w-2xl">
        {order && <OrderDetails order={order} locale={locale} />}
        {searched && !order && (
          <p role="alert" className="text-center text-destructive">{t('not_found')}</p>
        )}
      </div>
    </Section>
  );
}

export const dynamic = 'force-dynamic';
