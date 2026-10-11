import { useTranslations } from 'next-intl';
import { Section } from '@/features/landing/Section';

const STEPS = ['1', '2', '3'] as const;

export const HowItWorks = () => {
  const t = useTranslations('HowItWorks');

  return (
    <Section subtitle={t('subtitle')} title={t('title')} description={t('description')}>
      <div className="
        grid gap-6
        md:grid-cols-3
      "
      >
        {STEPS.map(step => (
          <div key={step} className="rounded-lg border bg-card p-5">
            <div className="
              flex size-9 items-center justify-center rounded-full border
              font-mono text-sm
            "
            >
              {step}
            </div>
            <h3 className="mt-3 font-serif text-lg">{t(`step${step}_title`)}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{t(`step${step}_description`)}</p>
          </div>
        ))}
      </div>
    </Section>
  );
};
