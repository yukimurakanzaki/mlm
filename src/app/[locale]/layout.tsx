import type { Metadata, Viewport } from 'next';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { IBM_Plex_Mono, Newsreader, Plus_Jakarta_Sans } from 'next/font/google';
import { notFound } from 'next/navigation';
import { routing } from '@/libs/I18nRouting';
import { AppConfig } from '@/utils/AppConfig';
import '@/styles/global.css';

// Kawung identity type: Plus Jakarta Sans (logo, headings, body), IBM Plex Mono (data, labels), Newsreader italic (narrative)
const sans = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-jakarta' });
const mono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-plex-mono' });
const serif = Newsreader({ subsets: ['latin'], style: ['normal', 'italic'], variable: '--font-newsreader' });

export const metadata: Metadata = {
  title: { default: AppConfig.name, template: `%s | ${AppConfig.name}` },
  icons: [
    {
      rel: 'icon',
      type: 'image/svg+xml',
      url: '/icon.svg',
    },
    {
      rel: 'apple-touch-icon',
      url: '/apple-touch-icon.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      url: '/favicon-32x32.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '16x16',
      url: '/favicon-16x16.png',
    },
    {
      rel: 'icon',
      url: '/favicon.ico',
    },
  ],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }));
}

export default async function RootLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <html
      lang={locale}
      className={`
        ${sans.variable}
        ${mono.variable}
        ${serif.variable}
      `}
      suppressHydrationWarning
    >
      <body>
        <NextIntlClientProvider>
          {props.children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
