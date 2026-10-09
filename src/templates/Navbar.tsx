import { useTranslations } from 'next-intl';
import { LocaleSwitcher } from '@/components/LocaleSwitcher';
import { buttonVariants } from '@/components/ui/buttonVariants';
import { CenteredMenu } from '@/features/landing/CenteredMenu';
import { Section } from '@/features/landing/Section';
import { Link } from '@/libs/I18nNavigation';
import { Logo } from './Logo';

export const Navbar = () => {
  const t = useTranslations('Navbar');

  return (
    <Section className="px-3 py-6">
      <CenteredMenu
        logo={<Link href="/"><Logo /></Link>}
        rightMenu={(
          <>
            <li>
              <LocaleSwitcher />
            </li>
            <li className="mr-2.5 ml-1">
              <Link href="/sign-in">{t('sign_in')}</Link>
            </li>
            <li>
              <Link className={buttonVariants()} href="/dashboard">
                {t('my_orders')}
              </Link>
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
      </CenteredMenu>
    </Section>
  );
};
