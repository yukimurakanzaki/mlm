import { useTranslations } from 'next-intl';
import { CenteredFooter } from '@/features/landing/CenteredFooter';
import { Section } from '@/features/landing/Section';
import { Link } from '@/libs/I18nNavigation';
import { AppConfig } from '@/utils/AppConfig';
import { Logo } from './Logo';

export const Footer = () => {
  const t = useTranslations('Footer');

  return (
    <Section className="pt-0 pb-16">
      <CenteredFooter
        logo={<Logo />}
        name={AppConfig.name}
        legalLinks={(
          <>
            <li>
              <a href={`mailto:${AppConfig.contact.email}`}>{t('email')}</a>
            </li>
            <li>
              <a href={`https://wa.me/${AppConfig.contact.whatsapp}`} target="_blank" rel="noopener noreferrer">
                WhatsApp
              </a>
            </li>
          </>
        )}
      >
        <li>
          <Link href="/catalog">{t('catalog')}</Link>
        </li>

        <li>
          <Link href="/track">{t('track')}</Link>
        </li>

        <li>
          <Link href="/#faq">{t('faq')}</Link>
        </li>
      </CenteredFooter>
    </Section>
  );
};
