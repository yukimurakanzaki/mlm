import { CheckIcon } from '@radix-ui/react-icons';
import { useTranslations } from 'next-intl';
import { KawungMark } from '@/components/KawungMark';
import { buttonVariants } from '@/components/ui/buttonVariants';
import { Reveal } from '@/features/landing/Reveal';
import { StepTabs } from '@/features/landing/StepTabs';
import { Link } from '@/libs/I18nNavigation';
import { AppConfig } from '@/utils/AppConfig';
import { buildWhatsAppLink } from '@/utils/Catalog';

type CategorySummary = { key: string; label: string; anchor: string; count: number };
type SampleProduct = { name: string; sku: string | null };

const LETTER_ITEMS = ['1', '2', '3', '4'] as const;

export const HowItWorks = (props: { categories: CategorySummary[]; sample?: SampleProduct }) => {
  const t = useTranslations('HowItWorks');
  const tc = useTranslations('Categories');
  const tp = useTranslations('Product');
  const th = useTranslations('Hero');

  // Same message the product page's quote button sends, so the preview never drifts from it
  const message = props.sample
    ? tp('quote_message', { company: AppConfig.name, name: props.sample.name, sku: props.sample.sku ?? '-' })
    : th('quote_message', { company: AppConfig.name });

  const steps = [
    {
      id: 'browse',
      title: t('step1_title'),
      description: t('step1_description'),
      panel: (
        <ul className="
          grid gap-px border bg-border
          sm:grid-cols-2
        "
        >
          {props.categories.map(category => (
            <li key={category.key} className="bg-card">
              <Link
                href={`/catalog?category=${category.anchor}`}
                className="
                  flex h-full items-baseline justify-between gap-3 p-4 text-sm
                  font-semibold transition-colors
                  hover:bg-secondary
                "
              >
                {category.label}
                <span className="
                  font-mono text-xs font-normal text-muted-foreground
                "
                >
                  {tc('product_count', { count: category.count })}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ),
    },
    {
      id: 'quote',
      title: t('step2_title'),
      description: t('step2_description'),
      panel: (
        <div className="border bg-card p-6">
          <div className="
            font-mono text-[11px] tracking-[0.14em] text-muted-foreground
            uppercase
          "
          >
            {t('message_label')}
          </div>
          <p className="mt-4 max-w-md bg-secondary p-4 text-sm/relaxed">{message}</p>
          <a
            className={buttonVariants({ className: 'mt-6' })}
            href={buildWhatsAppLink(AppConfig.contact.whatsapp, message)}
            target="_blank"
            rel="noopener noreferrer"
          >
            {th('secondary_button')}
          </a>
        </div>
      ),
    },
    {
      id: 'letter',
      title: t('step3_title'),
      description: t('step3_description'),
      panel: (
        <div className="border bg-card p-6">
          <div className="
            flex items-center gap-3 border-b-2 border-foreground pb-3
          "
          >
            <KawungMark className="size-6" />
            <span className="
              font-mono text-[11px] tracking-[0.14em] text-muted-foreground
              uppercase
            "
            >
              {t('letter_label')}
            </span>
          </div>
          <ul className="
            mt-5 grid gap-4
            sm:grid-cols-2
          "
          >
            {LETTER_ITEMS.map(item => (
              <li key={item} className="flex gap-2.5 text-sm">
                <CheckIcon className="mt-0.5 size-4 shrink-0 text-emphasis" />
                {t(`letter_item${item}`)}
              </li>
            ))}
          </ul>
        </div>
      ),
    },
  ];

  return (
    <section className="px-4 py-24">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mb-12">
          <div className="
            font-mono text-xs tracking-[0.14em] text-muted-foreground uppercase
          "
          >
            {t('eyebrow')}
          </div>
          <h2 className="
            mt-3 text-3xl font-bold tracking-tight
            md:text-5xl
          "
          >
            {t('title')}
          </h2>
        </Reveal>

        <StepTabs label={t('tabs_label')} steps={steps} />
      </div>
    </section>
  );
};
