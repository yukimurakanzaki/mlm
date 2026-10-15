import type { LocalizationResource } from '@clerk/shared/types';
import type { LocalePrefixMode } from 'next-intl/routing';
import type { AppLocale } from '@/types/I18n';
import { enUS, idID } from '@clerk/localizations';

/** Locale prefix strategy for next-intl routing. */
const localePrefix: LocalePrefixMode = 'as-needed';
const locales = [
  {
    id: 'id',
    name: 'Bahasa Indonesia',
  },
  {
    id: 'en',
    name: 'English',
  },
] satisfies AppLocale[];

/** Centralized application configuration */
export const AppConfig = {
  name: 'PT Mitra Labora Medika',
  // Keep catalog access and new sales paused until the sales permissions are complete.
  comingSoon: true,
  i18n: {
    locales,
    defaultLocale: 'id',
    localePrefix,
  },
  contact: {
    email: 'admin@mitralaboramedika.com',
    whatsapp: '6281266854415', // International format, digits only
    whatsappDisplay: '0812-6685-4415',
    address: 'Jl. Tanjung Mas Prima Blok D2 No.4, Jagakarsa, Jakarta Selatan 12530',
  },
  currency: 'IDR',
  // Number of monthly installments a customer can choose when ordering
  installmentOptions: [1, 3, 6],
} as const;

const supportedLocales: Record<string, LocalizationResource> = {
  id: idID,
  en: enUS,
};

export const ClerkLocalizations = {
  defaultLocale: idID,
  supportedLocales,
};

export const AllLocales = AppConfig.i18n.locales.map(locale => locale.id);
