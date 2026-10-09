'use client';

import * as Sentry from '@sentry/nextjs';
import Link from 'next/link';
import { useEffect } from 'react';
import { routing } from '@/libs/I18nRouting';
import { AppConfig } from '@/utils/AppConfig';
import { UNAVAILABLE_COPY } from '@/utils/UnavailablePage';

// Last-resort page when even the root layout fails. It sits outside the translated layout, so it uses the standalone copy.
export default function GlobalError(props: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    Sentry.captureException(props.error);
  }, [props.error]);

  const text = UNAVAILABLE_COPY[routing.defaultLocale === 'id' ? 'id' : 'en'];

  return (
    <html lang={routing.defaultLocale}>
      <body style={{ fontFamily: 'system-ui, sans-serif', textAlign: 'center', padding: 16 }}>
        <h1>{text.title}</h1>
        <p>{text.body}</p>
        <p><Link href="/">{text.home}</Link></p>
        <p><a href={`https://wa.me/${AppConfig.contact.whatsapp}`}>{text.help}</a></p>
      </body>
    </html>
  );
}
