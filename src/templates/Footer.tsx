import { useTranslations } from 'next-intl';
import { CenteredFooter } from '@/features/landing/CenteredFooter';
import { Link } from '@/libs/I18nNavigation';
import { AppConfig } from '@/utils/AppConfig';
import { Logo } from './Logo';

export const Footer = () => {
  const t = useTranslations('Footer');

  return (
    <footer className="mt-16 border-t bg-card px-4 pt-14 pb-10">
      <CenteredFooter
        logo={<Logo />}
        contact={(
          <>
            <li>
              <a href={`https://wa.me/${AppConfig.contact.whatsapp}`} target="_blank" rel="noopener noreferrer">
                WhatsApp
                {' '}
                {AppConfig.contact.whatsappDisplay}
              </a>
            </li>
            <li>
              <a href={`mailto:${AppConfig.contact.email}`}>{AppConfig.contact.email}</a>
            </li>
            <li className="max-w-64 text-muted-foreground">{AppConfig.contact.address}</li>
          </>
        )}
      >
        <li>
          <Link href="/catalog">{t('catalog')}</Link>
        </li>

        <li>
          <Link href="/#faq">{t('faq')}</Link>
        </li>
      </CenteredFooter>
    </footer>
  );
};
