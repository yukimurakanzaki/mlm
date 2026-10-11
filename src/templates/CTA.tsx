import { useTranslations } from 'next-intl';
import { buttonVariants } from '@/components/ui/buttonVariants';
import { emphasis } from '@/features/landing/Emphasis';
import { Reveal } from '@/features/landing/Reveal';
import { AppConfig } from '@/utils/AppConfig';
import { buildWhatsAppLink } from '@/utils/Catalog';

/** Closing line of the home page: one question, one WhatsApp quote button. */
export const CTA = () => {
  const t = useTranslations('CTA');
  const th = useTranslations('Hero');

  return (
    <section className="px-4 pt-12 pb-24">
      <Reveal className="
        mx-auto flex max-w-7xl flex-col gap-8 border-t-2 border-foreground pt-12
        md:flex-row md:items-end md:justify-between
      "
      >
        <div>
          <h2 className="
            max-w-[22ch] pb-1 text-3xl/[1.15] font-bold tracking-tight
            md:text-5xl/[1.1]
          "
          >
            {t.rich('title', { important: emphasis })}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">{t('description')}</p>
        </div>

        <a
          className={buttonVariants({ size: 'lg', className: 'shrink-0' })}
          href={buildWhatsAppLink(AppConfig.contact.whatsapp, th('quote_message', { company: AppConfig.name }))}
          target="_blank"
          rel="noopener noreferrer"
        >
          {t('button_text')}
        </a>
      </Reveal>
    </section>
  );
};
