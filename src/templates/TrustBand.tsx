import { useTranslations } from 'next-intl';
import { Reveal } from '@/features/landing/Reveal';

const FACTS = ['1', '2', '3'] as const;

/** Brand core ("Selalu ada.") on the one Nila panel of the page, with the Kawung pattern as a watermark. */
export const TrustBand = () => {
  const t = useTranslations('Trust');

  return (
    <section className="px-4 py-12">
      <div className="
        relative mx-auto max-w-7xl overflow-hidden bg-band px-6 py-14
        text-band-foreground
        md:px-12 md:py-20
      "
      >
        <div className="absolute inset-0 bg-kawung text-band-foreground/6" aria-hidden="true" />

        <Reveal className="relative">
          <h2 className="
            pb-1 text-4xl/[1.1] font-bold tracking-tight
            md:text-6xl/[1.1]
          "
          >
            {t.rich('title', {
              important: chunks => (
                <span className="font-serif font-light text-band-accent italic">
                  {chunks}
                </span>
              ),
            })}
          </h2>
          <p className="
            mt-5 max-w-[40ch] font-serif text-xl/relaxed text-band-foreground/90
            italic
          "
          >
            {t('description')}
          </p>
          <div className="
            mt-5 font-mono text-[11px] tracking-[0.14em] text-band-muted
            uppercase
          "
          >
            {t('tagline')}
          </div>

          <ul className="
            mt-12 grid gap-8 border-t border-band-foreground/20 pt-8
            md:grid-cols-3
          "
          >
            {FACTS.map(fact => (
              <li
                key={fact}
                className="
                  md:border-l md:border-band-foreground/20 md:pl-6
                  md:first:border-0 md:first:pl-0
                "
              >
                <h3 className="font-semibold">{t(`fact${fact}_title`)}</h3>
                <p className="mt-1.5 text-sm/relaxed text-band-muted">{t(`fact${fact}_description`)}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
};
