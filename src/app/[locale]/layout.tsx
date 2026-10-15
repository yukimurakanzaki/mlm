import type { Metadata, Viewport } from 'next';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import localFont from 'next/font/local';
import { notFound } from 'next/navigation';
import { routing } from '@/libs/I18nRouting';
import { AppConfig } from '@/utils/AppConfig';
import '@/styles/global.css';

// Kawung identity type: Plus Jakarta Sans (logo, headings, body), IBM Plex Mono (data, labels), Newsreader italic (narrative)
const sans = localFont({ src: '../../../public/fonts/plus-jakarta-sans-latin-wght-normal.woff2', weight: '200 800', variable: '--font-jakarta', display: 'swap' });
const mono = localFont({
  src: [
    { path: '../../../public/fonts/ibm-plex-mono-latin-400-normal.woff2', weight: '400' },
    { path: '../../../public/fonts/ibm-plex-mono-latin-500-normal.woff2', weight: '500' },
  ],
  variable: '--font-plex-mono',
  display: 'swap',
});
const serif = localFont({
  src: [
    { path: '../../../public/fonts/newsreader-latin-wght-normal.woff2', style: 'normal', weight: '200 800' },
    { path: '../../../public/fonts/newsreader-latin-wght-italic.woff2', style: 'italic', weight: '200 800' },
  ],
  variable: '--font-newsreader',
  display: 'swap',
});

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
