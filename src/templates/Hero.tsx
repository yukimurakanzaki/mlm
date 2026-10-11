import { ArrowRightIcon } from '@radix-ui/react-icons';
import { useTranslations } from 'next-intl';
import { buttonVariants } from '@/components/ui/buttonVariants';
import { emphasis } from '@/features/landing/Emphasis';
import { Link } from '@/libs/I18nNavigation';
import { AppConfig } from '@/utils/AppConfig';
import { buildWhatsAppLink } from '@/utils/Catalog';

type SpotlightProduct = { slug: string; name: string; category: string | null };

export const Hero = (props: { spotlight?: SpotlightProduct }) => {
  const t = useTranslations('Hero');
  const { spotlight } = props;

  return (
    <section className="
      px-4 pt-14 pb-20
      md:pt-20
    "
    >
      <div className="
        mx-auto grid max-w-7xl items-center gap-12
        lg:grid-cols-[1.05fr_1fr] lg:gap-16
      "
      >
        <div>
          <h1 className="
            pb-1 text-4xl/[1.1] font-bold tracking-tight
            md:text-[3.5rem]/[1.1]
          "
          >
            {t.rich('title', { important: emphasis })}
          </h1>

          <p className="mt-6 max-w-[46ch] text-lg/relaxed text-muted-foreground">
            {t('description')}
          </p>

          <div className="
            mt-9 flex gap-3
            max-sm:flex-col
          "
          >
            <Link className={buttonVariants({ size: 'lg' })} href="/catalog">
              {t('primary_button')}
              <ArrowRightIcon />
            </Link>
            <a
              className={buttonVariants({ variant: 'outline', size: 'lg' })}
              href={buildWhatsAppLink(AppConfig.contact.whatsapp, t('quote_message', { company: AppConfig.name }))}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t('secondary_button')}
            </a>
          </div>
        </div>

        <div>
          {/* TODO: hero photo (blood bank refrigerator or gel card centrifuge on a light background), ~1200x1500, fills this frame */}
          <div className="
            relative aspect-4/5 max-h-[560px] w-full overflow-hidden border
            bg-secondary
            max-lg:aspect-4/3
          "
          >
            <div className="absolute inset-0 bg-kawung text-foreground/8" aria-hidden="true" />

            {spotlight && (
              <Link
                href={`/catalog/${spotlight.slug}`}
                className="
                  group absolute inset-x-5 bottom-5 border bg-card p-5
                  transition-transform
                  hover:-translate-y-0.5
                  sm:right-auto sm:w-80
                "
              >
                {spotlight.category && (
                  <div className="
                    font-mono text-[11px] tracking-[0.08em]
                    text-muted-foreground uppercase
                  "
                  >
                    {spotlight.category}
                  </div>
                )}
                <div className="mt-1.5 text-lg/snug font-semibold">{spotlight.name}</div>
                <div className="
                  mt-3 inline-flex items-center gap-1.5 text-sm underline
                  decoration-primary decoration-2 underline-offset-4
                "
                >
                  {t('view_product')}
                  <ArrowRightIcon className="
                    transition-transform
                    group-hover:translate-x-0.5
                  "
                  />
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
