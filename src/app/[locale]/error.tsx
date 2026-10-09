'use client';

import * as Sentry from '@sentry/nextjs';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from '@/libs/I18nNavigation';
import { AppConfig } from '@/utils/AppConfig';

/** Friendly fallback for any page error, so visitors never see a raw error dump. */
export default function LocaleError(props: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('ErrorPage');

  useEffect(() => {
    Sentry.captureException(props.error);
  }, [props.error]);

  return (
    <main className="
      mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center
      gap-4 px-4 text-center
    "
    >
      <h1 className="text-2xl font-bold">{t('title')}</h1>
      <p className="text-muted-foreground">{t('description')}</p>
      <div className="flex flex-wrap justify-center gap-2">
        <Button onClick={props.reset}>{t('retry')}</Button>
        <Button variant="outline" asChild>
          <Link href="/">{t('home')}</Link>
        </Button>
      </div>
      <a className="text-sm underline" href={`https://wa.me/${AppConfig.contact.whatsapp}`} target="_blank" rel="noopener noreferrer">
        {t('contact')}
      </a>
    </main>
  );
}
