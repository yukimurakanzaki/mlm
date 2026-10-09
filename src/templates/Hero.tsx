import { ArrowRightIcon } from '@radix-ui/react-icons';
import { useTranslations } from 'next-intl';
import { buttonVariants } from '@/components/ui/buttonVariants';
import { CenteredHero } from '@/features/landing/CenteredHero';
import { Section } from '@/features/landing/Section';
import { Link } from '@/libs/I18nNavigation';

export const Hero = () => {
  const t = useTranslations('Hero');

  return (
    <Section className="py-24">
      <CenteredHero
        banner={<span className="text-sm font-semibold text-muted-foreground">{t('banner')}</span>}
        title={t.rich('title', {
          important: chunks => (
            <span className="
              bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500
              bg-clip-text text-transparent
            "
            >
              {chunks}
            </span>
          ),
        })}
        description={t('description')}
        buttons={(
          <>
            <Link className={buttonVariants({ size: 'lg' })} href="/catalog">
              {t('primary_button')}
              <ArrowRightIcon className="ml-1 size-5" />
            </Link>

            <Link className={buttonVariants({ variant: 'outline', size: 'lg' })} href="/track">
              {t('secondary_button')}
            </Link>
          </>
        )}
      />
    </Section>
  );
};
