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
        banner={(
          <span className="
            font-mono text-xs tracking-[0.08em] text-muted-foreground uppercase
          "
          >
            {t('banner')}
          </span>
        )}
        title={t.rich('title', {
          important: chunks => (
            <span className="text-emphasis italic">
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
