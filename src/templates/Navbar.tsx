import { getTranslations } from 'next-intl/server';
import { cookies } from 'next/headers';
import { LocaleSwitcher } from '@/components/LocaleSwitcher';
import { buttonVariants } from '@/components/ui/buttonVariants';
import { CenteredMenu } from '@/features/landing/CenteredMenu';
import { Section } from '@/features/landing/Section';
import { Link } from '@/libs/I18nNavigation';
import { Logo } from './Logo';

export const Navbar = async (props: { locale: string }) => {
  const t = await getTranslations({ locale: props.locale, namespace: 'Navbar' });
  // Clerk does not run for guests on public pages, so a session cookie is the only hint available here.
  // It only chooses which link to show; the dashboard itself is still protected by the middleware.
  const signedIn = (await cookies()).has('__session');

  return (
    <Section className="px-3 py-6">
      <CenteredMenu
        logo={<Logo />}
        rightMenu={(
          <>
            <li>
              <LocaleSwitcher />
            </li>
            {signedIn
              ? (
                  <li>
                    <Link className={buttonVariants()} href="/dashboard">
                      {t('my_orders')}
                    </Link>
                  </li>
                )
              : (
                  <li>
                    <Link className={buttonVariants()} href="/sign-in">
                      {t('sign_in')}
                    </Link>
                  </li>
                )}
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
